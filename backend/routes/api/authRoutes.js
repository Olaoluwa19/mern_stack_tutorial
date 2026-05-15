import express from "express";
const authRouter = express.Router();
import { login, refresh, logout } from "../../controllers/authController";
import loginLimiter from "../../middleware/loginLimiter";

authRouter.route("/").post(loginLimiter, login);

authRouter.route("/refresh").get(refresh);

authRouter.route("/logout").post(logout);

export default authRouter;
