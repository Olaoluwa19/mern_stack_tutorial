import asyncHandler from "express-async-handler";

// @desc  Get all users
// @route GET /api/users
// @access Private/Admin
const getAllUsers = asyncHandler((req, res) => {
  res.send("Get all users");
});

// @desc  Get a user
// @route GET /users:id
// @access Private/Admin
const getUser = asyncHandler((req, res) => {
  res.send("Get user");
});

// @desc  Create new user
// @route POST /users
// @access Private/Admin
const createNewUser = asyncHandler((req, res) => {
  res.send("Create user");
});

// @desc  Update a user
// @route PATCH /users
// @access Private/Admin
const updateUser = asyncHandler((req, res) => {
  res.send("Update user");
});

// @desc  Delete user
// @route DELETE /users
// @access Private/Admin
const deleteUser = asyncHandler((req, res) => {
  res.send("Delete user");
});

export { getAllUsers, getUser, createNewUser, updateUser, deleteUser };
