import express from "express";
const userRoutes = express.Router();

import {
  getAllUsers,
  getUser,
  createNewUser,
  updateUser,
  deleteUser,
} from "../../controllers/usersController.js";

userRoutes
  .route("/")
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser);

userRoutes.route("/:id").get(getUser);

export default userRoutes;
