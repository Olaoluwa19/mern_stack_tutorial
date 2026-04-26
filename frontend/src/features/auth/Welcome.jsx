import { Link } from "react-router-dom";

const Welcome = () => {
  const date = new Date();
  const locale = navigator.language || "en-NG";

  const today = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const content = (
    <section className="welcome">
      <p>{today}</p>
      <h1>welcome!</h1>
      <p>
        <Link to="/dash/notes">View TechNotes</Link>
      </p>
      <p>
        <Link to="/dash/users">View View User Settings</Link>
      </p>
    </section>
  );

  return content;
};

export default Welcome;
