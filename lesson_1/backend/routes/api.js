import express from "express";
import root from "./root.js";
import userRoutes from "./api/userRoutes.js";

const api = express.Router();

// Define API routes here
api.use("/", root);
api.use("/users", userRoutes);

export default api;
