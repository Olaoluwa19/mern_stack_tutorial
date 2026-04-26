import "dotenv/config";
import mongoose from "mongoose";
import http from "http";
import app from "./app.js";
import connectDB from "./config/mongodb.js";
import { logEvents } from "./middleware/logEvents.js";

const PORT = process.env.PORT || 3500;

const server = http.createServer(app);

const startServer = async () => {
  try {
    // check mongoDB error first before connecting to the server
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      logEvents(`${err.code}\t${err.message}`, "mongoErrLog.log");
    });

    // connect to mongoDB
    connectDB();
    mongoose.connection.once("open", () => {
      console.log("Connected to MongoDB ☑️");
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT} 🚀🚀`);
      });
    });
  } catch (err) {
    await logEvents(
      `${err.code || err.no || "UNKNOWN"}\t${err.syscall || ""}\t${err.hostname || ""}`,
      "mongoErrLog.log",
    );
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

startServer();
