import { serverError } from "../utility/response.js";
import { logEvents } from "./logEvents.js";

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name} : ${err.message}`, "errLog.txt");
  console.error(err.stack);
  return serverError(res, "An unexpected error occurred", err);
};

export default errorHandler;
