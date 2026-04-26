import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import UserService from "../services/userService.js";
import {
  ok,
  noContent,
  created,
  badRequest,
  notFound,
  conflict,
} from "../utility/response.js";
import { hashPassword, validatePassword } from "../utility/password.js";
import NoteService from "../services/noteService.js";

// @desc  Get all users
// @route GET /api/users
// @access Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserService.findAllUsers();
  if (!users?.length) return noContent(res);
  return ok(res, users);
});

// @desc  Get a user
// @route GET /users:id
// @access Private/Admin
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) return badRequest(res, "Invalid user ID");

  const user = await UserService.findUserById(id);
  if (!user) return noContent(res);
  return ok(res, user);
});

// @desc  Create new user
// @route POST /users
// @access Private/Admin
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  // Confirm Data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return badRequest(res, "All fields are required");
  }
  // Validate role
  if (!UserService.validateRole(roles)) {
    return badRequest(`Invalid role specified, ${roles} is not allowed.`);
  }

  // Check for duplicate username
  const duplicate = await UserService.checkDuplicateUser(username);
  if (duplicate) return conflict(res, "Username already exists");

  // validate password
  if (!validatePassword(password)) {
    return badRequest(
      res,
      "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.",
    );
  }

  // Hash password
  const hashedPwd = await hashPassword(password);
  const userObject = { username, password: hashedPwd, roles };

  // Create and store new user
  const user = await UserService.createUser(userObject);

  if (user) {
    return created(res, user, `New user ${user.username} created`);
  } else {
    return badRequest(res, "Invalid user data received");
  }
});

// @desc  Update a user
// @route PATCH /users
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // Confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return badRequest(
      res,
      "All fields except password are required and must be valid",
    );
  }

  if (!mongoose.isValidObjectId(id)) return badRequest(res, "Invalid user ID");

  const user = await UserService.findUserById(id);
  if (!user) return notFound(res, "User not found");

  // Check for duplicate
  const duplicate = await UserService.checkDuplicateUser(username);
  // Allow update to the original user, but prevent changing to another existing username
  if (duplicate && duplicate?._id.toString() !== id) {
    return conflict(res, "Username already exists");
  }
  const hashPwd = password ? await hashPassword(password) : null;

  const updatedUser = await UserService.updateUser(user, req, hashPwd);

  return ok(res, updatedUser, `User ${updatedUser.username} updated`);
});

// @desc  Delete user
// @route DELETE /users
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) return badRequest(res, "User ID required");

  if (!mongoose.isValidObjectId(id)) return badRequest(res, "Invalid user ID");

  const note = await NoteService.findUserNote(id);
  if (note) {
    return badRequest(res, "User has assigned notes");
  }

  const user = await UserService.findUserById(id);
  if (!user) return notFound(res, "User not found");

  const result = await UserService.deleteUser(id);
  return ok(res, result, `User ${user.username} with ID ${user._id} deleted`);
});

export { getAllUsers, getUser, createNewUser, updateUser, deleteUser };
