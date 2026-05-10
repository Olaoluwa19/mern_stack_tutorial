import { useState, useEffect } from "react";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const EditNoteForm = ({ note, users }) => {
  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation();
  const [
    deleteNote,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteNoteMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [completed, setCompleted] = useState(note.completed);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setText("");
      navigate("/dash/notes");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onCompletedChanged = () => setCompleted((prev) => !prev);

  const onSaveNoteClicked = async (e) => {
    await updateNote({ id: note.id, title, text, completed });
  };

  const onDeleteNoteClicked = async () => {
    await deleteNote({ id: note.id });
  };

  const canSave = [title, text].every(Boolean) && !isLoading;

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const titleClass = !title ? "form__input--incomplete" : "";
  const textClass = !text ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Note</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveNoteClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteNoteClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          Title:
        </label>
        <input
          type="text"
          className={`form__input ${titleClass}`}
          id="title"
          name="title"
          value={title}
          onChange={onTitleChanged}
        />
        <label className="form__label" htmlFor="title">
          Text:
        </label>
        <input
          type="text"
          className={`form__input ${textClass}`}
          id="text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />
        <label
          className="form__label form__checkbox-container"
          htmlFor="note-completed"
        >
          COMPLETED:
          <input
            className="form__checkbox"
            id="note-completed"
            name="note-completed"
            type="checkbox"
            checked={completed}
            onChange={onCompletedChanged}
          />
        </label>
      </form>
    </>
  );

  return content;
};

export default EditNoteForm;
