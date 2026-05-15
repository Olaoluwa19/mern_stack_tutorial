import express from "express";
const noteRouter = express.Router();

import {
  getAllNotes,
  getNote,
  createNewNote,
  updateNote,
  deleteNote,
} from "../../controllers/notesController.js";

noteRouter
  .route("/")
  .get(getAllNotes)
  .post(createNewNote)
  .patch(updateNote)
  .delete(deleteNote);

noteRouter.route("/:id").get(getNote);

export default noteRouter;
