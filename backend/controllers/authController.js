import expressAsyncHandler from "express-async-handler";
import UserService from "../services/userService";
import {
  badRequest,
  created,
  forbidden,
  unauthorized,
} from "../utility/response";
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
} from "../utility/password";

// @desc Login
// @route POST /auth
// @access Public
const login = expressAsyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // require email or phone for login
  if (!username) return badRequest(res, "Username is required to login.");

  if (!password) return badRequest(res, "Password is required to login.");

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

    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const user = await foundUser.save();
    const populatedUser = await UserService.populateUser(user._id);
    console.log(populatedUser);

    // set cookie with refresh token
    setRefreshTokenCookie(res, refreshToken);

    return created(
      res,
      {
        accessToken,
        user: populatedUser,
      },
      "Login successful☺️🔓",
    );
  } else {
    return unauthorized(res, "Login failed😔! Invalid credentials🗝️.");
  }
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {};

// @desc Logout
// @route POST /auth/logout
// @ccess Public - just to clear cookie if exists
const logout = (req, res) => {};

export { login, refresh, logout };
