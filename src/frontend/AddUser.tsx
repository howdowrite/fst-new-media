import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { setUser } from "../services/UserService";
import "./css/Login.css";

function AddUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const id = await setUser(
        { email: email, displayName: displayName },
        password,
      );
      console.log(`Success created user of ${id}`);
    } catch (e) {
      console.error(`Error: ${e}`);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__image">
        <div className="auth-page__brand-wrap">
          <div className="auth-page__brand">
            <h2 className="auth-page__brand-title">WebsiteName</h2>
            <p className="auth-page__brand-tagline">Stories Worth Sharing</p>
            <p className="auth-page__brand-copy">
              Write, edit, and publish your work from one place.
            </p>
          </div>
        </div>
        <p className="auth-page__attribution">
          Photo by{" "}
          <a
            href="https://unsplash.com/@kiwihug?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            target="_blank"
            rel="noreferrer"
          >
            Kiwihug
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com/photos/white-wall-paint-with-black-shadow-zGZYQQVmXw0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            target="_blank"
            rel="noreferrer"
          >
            Unsplash
          </a>
        </p>
      </div>

      <div className="auth-page__form-panel">
        <div className="auth-form">
          <h1 className="auth-form__title">Register</h1>
          <p className="auth-form__subtitle">Create Your Account</p>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="displayName">display name: </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="email">email address: </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password: </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" className="auth-form__submit">
              Submit
            </button>
          </form>

          <p className="auth-form__footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AddUser;
