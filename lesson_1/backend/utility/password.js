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

const generateAccessToken = (user, role) => {
  if (!user || !role)
    throw new Error("User and role are required to generate access token.");

  if (!user.email && !user.phone)
    throw new Error(
      "User must have either email or phone to generate access token.",
    );

  const accessToken = jwt.sign(
    {
      UserInfo: {
        user: user.email || user.phone,
        roles: role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  return accessToken;
};

const generateRefreshToken = (user) => {
  if (!user) throw new Error("User is required to generate refresh token.");

  if (!user.email && !user.phone)
    throw new Error(
      "User must have either email or phone to generate refresh token.",
    );

  const refreshtoken = jwt.sign(
    { email: user.email, phone: user.phone },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" },
  );

  return refreshtoken;
};

const setRefreshTokenCookie = (res, refreshToken) => {
  return res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
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
