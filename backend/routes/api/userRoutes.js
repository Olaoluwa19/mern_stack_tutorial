import express from "express";
const userRouter = express.Router();

import {
  getAllUsers,
  getUser,
  createNewUser,
  updateUser,
  deleteUser,
} from "../../controllers/usersController.js";

userRouter
  .route("/")
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser);

userRouter.route("/:id").get(getUser);

export default userRouter;
