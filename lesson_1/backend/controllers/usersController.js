import asyncHandler from "express-async-handler";
import UserService from "../services/userService.js";
import { noContent, ok } from "../utility/response.js";

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
  res.send("Get user");
});

// @desc  Create new user
// @route POST /users
// @access Private/Admin
const createNewUser = asyncHandler(async (req, res) => {
  res.send("Create user");
});

// @desc  Update a user
// @route PATCH /users
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  res.send("Update user");
});

// @desc  Delete user
// @route DELETE /users
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  res.send("Delete user");
});

export { getAllUsers, getUser, createNewUser, updateUser, deleteUser };
