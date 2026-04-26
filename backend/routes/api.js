import express from "express";
import root from "./root.js";
import userRoutes from "./api/userRoutes.js";
import noteRoutes from "./api/noteRoutes.js";

const api = express.Router();

// Define API routes here
api.use("/", root);
api.use("/users", userRoutes);
api.use("/notes", noteRoutes);

export default api;
