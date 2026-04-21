import User from "../models/User.js";
import Note from "../model/Note.js";
import validator from "validator";

class UserService {
  constructor() {}

  static async createUserField(
    request,
    hashedPassword,
    doctorFieldId,
    imageUrl,
  ) {
    const { name, email, phone, gender, dob, address, roles } = request.body;

    // Basic validations
    if (!imageUrl) throw new Error("Image upload failed");
    if (!name || !email) throw new Error("Name & email required");
    // Simple email format validation
    if (!validator.isEmail(email)) throw new Error("Invalid email format");
    // Validate role
    if (![5684, 1973, 3956].includes(roles))
      throw new Error(`Invalid role specified, ${roles} is not allowed.`);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone,
      roles: [roles],
    });

    return user;
  }

  static async findUserById(userId) {
    return await User.findOne({ _id: userId }).exec();
  }

  static async checkDuplicateUser(email, roles) {
    return await User.findOne({ email, roles }).exec();
  }

  static async findUserByEmailOrPhone(identifier) {
    return await User.findOne({
      $or: [{ phone: identifier }, { email: identifier }],
    }).exec();
  }

  static async deleteUser(id) {
    return await User.deleteOne(id);
  }

  static async populateUser(id) {
    return await User.findById(id)
      .populate({
        path: "doctorsField",
        select: "-password -refreshToken -createdAt -updatedAt",
      })
      .exec();
  }
}

export default UserService;
