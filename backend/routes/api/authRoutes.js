import express from "express";
const authRouter = express.Router();
import { login, refresh, logout } from "../../controllers/authController.js";
import loginLimiter from "../../middleware/loginLimiter.js";

authRouter.route("/").post(loginLimiter, login);

authRouter.route("/refresh").get(refresh);

authRouter.route("/logout").post(logout);

export default authRouter;
