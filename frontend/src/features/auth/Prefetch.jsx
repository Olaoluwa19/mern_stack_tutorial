import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import { store } from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { selectCurrentToken } from "./authSlice";

const Prefetch = () => {
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    if (!token) return; // ← Important: Don't run without token

    console.log("✅ Token found → Subscribing to notes & users");
    const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate());
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

    return () => {
      console.log("unsubscribing");
      notes.unsubscribe();
      users.unsubscribe();
    };
  }, [token]);

  return <Outlet />;
};

export default Prefetch;
