import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>
          Welcome to <span className="nowrap">Ola_oluwa repair shop</span>
        </h1>
      </header>
      <main className="public__main">
        <p>
          Located in the heart of Ikeja, Computer village, Ola_oluwa repair
          procides a trained staff ready to meet your tech repair needs.
        </p>
        <address className="public__addr">
          Ola_oluwa Repairs
          <br />
          7 otigba street, Computer Village
          <br />
          Ikeja, Lagos
          <br />
          <a href="tel:+2349067759137">09067759137</a>
        </address>
        <br />
        <p>Owner: Oladapo Oluwadurotimi</p>
      </main>
      <footer>
        <Link to="/login">Employee Login</Link>
      </footer>
    </section>
  );
  return content;
};

export default Public;
