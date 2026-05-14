import Note from "../models/Note.js";
import Counter from "../models/Counter.js";
import validator from "validator";

class NoteService {
  constructor() {}

  static async findAllNotes() {
    return await Note.find().lean().populate({
      path: "user",
      select: "-password -refreshToken -createdAt -updatedAt",
    });
  }

  static async findNoteById(id) {
    return await Note.findById(id).exec();
  }

  static async findUserNote(userId) {
    return await Note.findOne({ user: userId }).lean().exec();
  }

  static async createNote(noteObj) {
    // Get next ticket number starting from 500
    const counter = await Counter.findOneAndUpdate(
      { _id: "ticketNums" },
      { $inc: { seq: 1 } },
      {
        upsert: true,
        returnDocument: "after", // ← This fixes the deprecation warning
      },
    );

    // Ensure it starts at 500 (this logic guarantees the first ticket is 500)
    let ticketNumber = counter.seq;

    if (ticketNumber < 500) {
      // This handles the case if counter was created with a low value
      await Counter.findOneAndUpdate(
        { _id: "ticketNums" },
        { seq: 499 },
        { upsert: true },
      );
      ticketNumber = 500;
    }

    const noteWithTicket = {
      ...noteObj,
      ticket: ticketNumber,
    };

    return await Note.create(noteWithTicket);
  }

  static async updateNote(note, req) {
    const { title, text, completed, user } = req.body;
    note.title = title;
    note.text = text;
    note.completed = completed;
    note.user = user;

    return await note.save();
  }

  static async checkDuplicateNoteForUser(userId, title) {
    if (!userId || !title) return null;

    return await Note.findOne({
      user: userId,
      title: { $regex: new RegExp(`^${title}$`, "i") },
    })
      .lean()
      .exec();
  }

  static async deleteNote(id) {
    return await Note.deleteOne({ _id: id });
  }
}

export default NoteService;
