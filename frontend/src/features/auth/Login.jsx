import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import useTitle from "../../hooks/useTitle";
import { PulseLoader } from "react-spinners";

const Login = () => {
  useTitle("TechNotes: Employee Login");
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Clear error when user starts typing
  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ username, password }).unwrap();

      dispatch(setCredentials({ accessToken: response.data }));

      setUsername("");
      setPassword("");
      navigate("/dash");
    } catch (error) {
      console.error(error); // Helpful for debugging

      if (!error.status) {
        setErrMsg("No Server Response");
      } else if (error.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (error.status === 401) {
        setErrMsg("Invalid username or password");
      } else {
        setErrMsg(error?.data?.message || "Login Failed");
      }

      errRef.current?.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleTogglePersist = () => setPersist((prev) => !prev);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) return <PulseLoader color={"#FFF"} />;

  return (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label className="form__label" htmlFor="username">
            Username:
          </label>
          <input
            type="text"
            className="form__input"
            id="username"
            name="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label className="form__label" htmlFor="password">
            Password:
          </label>
          <div className="password-container">
            <input
              className="form__input password-input"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePwdInput}
              autoComplete="off"
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            className="form__submit-button"
            type="submit"
            disabled={isLoading}
          >
            Sign In
          </button>
          <label htmlFor="persist" className="persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={handleTogglePersist}
              checked={persist}
            />
            Trust this device?
          </label>
        </form>
      </main>
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );
};

export default Login;
