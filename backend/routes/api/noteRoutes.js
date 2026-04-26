import express from "express";
const noteRoutes = express.Router();

import {
  getAllNotes,
  getNote,
  createNewNote,
  updateNote,
  deleteNote,
} from "../../controllers/notesController.js";

noteRoutes
  .route("/")
  .get(getAllNotes)
  .post(createNewNote)
  .patch(updateNote)
  .delete(deleteNote);

noteRoutes.route("/:id").get(getNote);

export default noteRoutes;
