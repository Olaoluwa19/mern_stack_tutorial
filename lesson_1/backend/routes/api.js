import express from "express";
import root from "./root.js";

const api = express.Router();

// Define API routes here
api.use("/", root);

export default api;
