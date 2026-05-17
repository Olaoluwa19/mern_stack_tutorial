import { serverError } from "../utility/response.js";
import { logEvents } from "./logger.js";

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name} : ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log",
  );
  console.error(err.stack);
  return serverError(res, "An unexpected error occurred", err);
};

export default errorHandler;
