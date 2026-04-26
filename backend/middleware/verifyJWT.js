import jwt from "jsonwebtoken";
import { forbidden, unauthorized } from "../utility/response";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer "))
    return unauthorized(res, "No Bearer Token found🔐!"); // Bearer Token missing
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return forbidden(res, "Invalid Token provided🔐!"); // invalid token
    req.user = decoded.UserInfo.email || decoded.UserInfo.phone;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

export default verifyJWT;
