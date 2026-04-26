import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import NoteService from "../services/noteService.js";
import UserService from "../services/userService.js";
import {
  ok,
  noContent,
  created,
  badRequest,
  notFound,
  conflict,
} from "../utility/response.js";
import { hashPassword, validatePassword } from "../utility/password.js";

// @desc  Get all notes
// @route GET /api/notes
// @access Public
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await NoteService.findAllNotes();
  if (!notes?.length) return noContent(res);
  return ok(res, notes);
});

// @desc  Get a note
// @route GET /notes:id
// @access Public
const getNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) return badRequest(res, "Invalid note ID");

  const note = await NoteService.findNoteById(id);
  if (!note) return notFound(res, "Note not found");

  return ok(res, note);
});

// @desc  Create new note
// @route POST /notes
// @access Public
const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text, completed } = req.body;

  if (!mongoose.isValidObjectId(user))
    return badRequest(res, "Invalid user ID");

  // Confirm Data
  if (!user || !title || !text) {
    return badRequest(res, "All fields are required");
  }

  // check if user exists
  const existingUser = await UserService.findUserById(user);
  if (!existingUser) return notFound(res, "User not found");

  // Check for duplicate title for the same user
  const duplicate = await NoteService.checkDuplicateNoteForUser(user, title);
  if (duplicate) {
    return conflict(res, "You already have a note with this title");
  }

  const noteObject = { user: user, title, text, completed };

  // Create and store new note
  const note = await NoteService.createNote(noteObject);

  if (note) {
    return created(res, note, `New note ${note.title} created`);
  } else {
    return badRequest(res, "Invalid note data received");
  }
});

// @desc  Update a note
// @route PATCH /notes
// @access Public
const updateNote = asyncHandler(async (req, res) => {
  const { id, title, text, completed } = req.body;

  // Confirm data
  if (!id || !title || !text || typeof completed !== "boolean") {
    return badRequest(
      res,
      "All fields are required to update a note and completed must be a boolean value",
    );
  }

  if (!mongoose.isValidObjectId(id)) return badRequest(res, "Invalid note ID");

  const note = await NoteService.findNoteById(id);
  if (!note) return notFound(res, "Note not found");

  // Check for duplicate user note
  const duplicate = await NoteService.checkDuplicateNoteForUser(
    note.user,
    title,
  );
  // Allow update to the original note, but prevent changing to another existing notename
  if (duplicate && duplicate?._id.toString() !== id) {
    return conflict(res, "Note already exists");
  }

  const updatedNote = await NoteService.updateNote(note, req);

  return ok(res, updatedNote, `Note ${updatedNote.title} updated`);
});

// @desc  Delete note
// @route DELETE /notes
// @access Public
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) return badRequest(res, "Note ID required");
  if (!mongoose.isValidObjectId(id)) return badRequest(res, "Invalid note ID");

  const note = await NoteService.findNoteById(id);
  if (!note) return notFound(res, "Note not found");

  const result = await NoteService.deleteNote(id);
  return ok(res, result, `Note ${note.title} with ID ${note._id} deleted`);
});

export { getAllNotes, getNote, createNewNote, updateNote, deleteNote };
