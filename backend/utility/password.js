import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const validatePassword = (password) => {
  const regex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
  return regex.test(password);
};

const genSalt = async () => {
  return await bcrypt.genSalt(10);
};

const hashPassword = async (password) => {
  const salt = await genSalt();
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const generateAccessToken = (user, roles) => {
  if (!user.username || !roles)
    throw new Error("Invalid credentials. Provide a valid username and role.");

  return jwt.sign(
    {
      UserInfo: {
        user: user.username,
        roles: roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10s" },
  );
};

const generateRefreshToken = (user) => {
  if (!user.username) throw new Error("enter a valid username!");

  return jwt.sign(
    { username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    },
  );
};

const setRefreshTokenCookie = (res, refreshToken) => {
  return res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: process.env.NODE_ENV === "production", // https
    sameSite: "None", // cross-site coookies
    maxAge: 24 * 60 * 60 * 1000, // cookie expiry: set to match refreshToken
  });
};

export {
  validatePassword,
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
};
