import User from "../models/User.js";
import Note from "../models/Note.js";
import validator from "validator";

class UserService {
  constructor() {}

  static async validateRole(roles) {
    return [6743, 9087, 1473].includes(roles);
  }

  static async findAllUsers() {
    return await User.find().select("-password").lean();
  }

  static async findUserById(id) {
    return await User.findById(id).select("-password").exec();
  }

  static async createUser(userObj) {
    return await User.create(userObj);
  }

  static async updateUser(user, req, hashPwd) {
    const { username, roles, active, password } = req.body;
    user.username = username;
    user.roles = roles;
    user.active = active;
    if (password) {
      user.password = hashPwd;
    }
    return await user.save();
  }

  static async checkDuplicateUser(username) {
    return await User.findOne({ username }).lean().exec();
  }

  static async findUserByEmailOrPhone(identifier) {
    return await User.findOne({
      $or: [{ phone: identifier }, { email: identifier }],
    }).exec();
  }

  static async deleteUser(id) {
    return await User.deleteOne({ _id: id });
  }

  static async populateUser(id) {
    return await User.findById(id)
      .populate({
        path: "notes",
        select: "-password -refreshToken -createdAt -updatedAt",
      })
      .exec();
  }
}

export default UserService;
