import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Define __dirname and __filename for ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get(["/", "/index", "/index.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

export default router;
