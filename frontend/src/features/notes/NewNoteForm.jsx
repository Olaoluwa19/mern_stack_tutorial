import { useState, useEffect } from "react";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NewNoteForm = ({ users }) => {
  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();

  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    setUser(user);
  }, [user]);

  useEffect(() => {
    setTitle(title);
  }, [title]);

  useEffect(() => {
    setText(text);
  }, [text]);

  useEffect(() => {
    if (isSuccess) {
      setUser("");
      setTitle("");
      setText("");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onUserChanged = (e) => setUser(e.target.value);

  const canSave = [user, title, text].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewNote({ user, title, text });
    }
  };
  const errClass = isError ? "errmsg" : "offscreen";
  const userClass = !user ? "form__input--incomplete" : "";
  const titleClass = !title ? "form__input--incomplete" : "";
  const textClass = !text ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <form className="form" onSubmit={onSaveNoteClicked}>
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label htmlFor="title" className="form__label">
          Title:
        </label>
        <input
          className={`form__input ${titleClass}`}
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="text" className="form__label">
          Text:
        </label>
        <input
          className={`form__input ${textClass}`}
          id="text"
          name="text"
          type="text"
          value={text}
          onChange={onTextChanged}
        />
      </form>
    </>
  );

  return content;
};

export default NewNoteForm;
