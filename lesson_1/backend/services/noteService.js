import Note from "../models/Note.js";
import validator from "validator";

class NoteService {
  constructor() {}

  static async findAllNotes() {
    return await Note.find().lean();
  }

  static async findNoteById(id) {
    return await Note.findById(id).exec();
  }

  static async findUserNotes(userId) {
    return await Note.find({ user: userId }).lean().exec();
  }

  static async createNote(noteObject) {
    return await Note.create(noteObject);
  }

  static async updateNote(note) {
    note.title = title;
    note.text = text;
    note.completed = completed;

    return await note.save();
  }

  static async checkDuplicateNote(title) {
    return await Note.findOne({ title }).lean().exec();
  }

  static async deleteNote(id) {
    return await Note.deleteOne(id);
  }
}

export default NoteService;
