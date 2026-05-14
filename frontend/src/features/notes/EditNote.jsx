import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectNoteById } from "./notesApiSlice";
import { selectAllUsers } from "../users/UsersApiSlice";
import EditNoteForm from "./EditNoteForm";

const EditNote = () => {
  const { id } = useParams();

  const note = useSelector((state) => selectNoteById(state, id));
  const users = useSelector(selectAllUsers);

  if (!users || users.length === 0 || !note) {
    return <p>Loading...</p>;
  }

  // Note not found
  if (!note) {
    return <p>Note not found or you don't have access.</p>;
  }

  return <EditNoteForm note={note} users={users} />;
};

export default EditNote;
