import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import UserService from "../services/userService.js";
import {
  badRequest,
  created,
  forbidden,
  ok,
  noContent,
  unauthorized,
} from "../utility/response.js";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
} from "../utility/password.js";

// @desc Login
// @route POST /auth
// @access Public
const login = expressAsyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // require email or phone for login
  if (!username || !password)
    return badRequest(res, "All fields are required.");

  //   Check if user exists
  const foundUser = await UserService.findUser(username);

  if (!foundUser)
    return unauthorized(res, "The User details provided does not exist"); // unauthorised

  if (!foundUser.active)
    return forbidden(res, "User is not allowed on the platform😡!"); // forbidden

  // Evaluate password
  const match = comparePassword(password, foundUser.password);

  if (match) {
    const roles = Object.values(foundUser.roles);

    //create JWT's
    const accessToken = generateAccessToken(foundUser, roles);
    const refreshToken = generateRefreshToken(foundUser);

    // set cookie with refresh token
    setRefreshTokenCookie(res, refreshToken);

    return created(res, accessToken, "Login successful☺️🔓");
  } else {
    return unauthorized(res, "Login failed😔! Invalid credentials🗝️.");
  }
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return unauthorized(res); // unauthorized
  const refreshToken = cookies.jwt;

  //Evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    expressAsyncHandler(async (err, decoded) => {
      if (err) {
        return forbidden(res, "JWT verification error:", err); //forbidden
      }

      // is refreshToken in db
      const foundUser = await UserService.findUser(decoded.username);
      if (!foundUser) {
        return unauthorized(res, "User does not exist in DB."); //forbidden
      }

      const roles = Object.values(foundUser.roles);
      const accessToken = generateAccessToken(decoded, roles);

      return ok(res, { accessToken }, "Access token refreshed successfully.");
    }),
  );
};

// @desc Logout
// @route POST /auth/logout
// @ccess Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return noContent(res, "No JWT cookies found."); // No content

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: process.env.NODE_ENV === "production", // https
  }); // secure: true - only serves on http
  return ok(res, "Successfully cleared cookie. Logout successfully.");
};

export { login, refresh, logout };
