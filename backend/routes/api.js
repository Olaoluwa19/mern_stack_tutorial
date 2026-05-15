import express from "express";
import root from "./root.js";
import userRouter from "./api/userRoutes";
import noteRouter from "./api/noteRoutes";
import authRouter from "./api/authRoutes.js";

const api = express.Router();

// Define API routes here
api.use("/", root);
api.use("/users", userRouter);
api.use("/notes", noteRouter);
api.use("/auth", authRouter);

export default api;
