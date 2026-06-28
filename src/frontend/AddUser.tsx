import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../services/UserService";
import { getCurrentUser } from "../services/AuthService";
import "./css/Login.css";

function AddUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (getCurrentUser()) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    try {
      await setUser(
        { email: email, displayName: displayName },
        password,
      );
      setEmail("");
      setPassword("");
      setDisplayName("");
      setMessage({ text: "Account created successfully!", type: "success" });
      setTimeout(() => navigate("/"), 1500);
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : "Registration failed";
      setMessage({ text: errMsg, type: "error" });
    } finally {
      setSubmitting(false);
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

          {message && (
            <p className={`auth-form__message auth-form__message--${message.type}`}>
              {message.text}
            </p>
          )}

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
                disabled={submitting}
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
                disabled={submitting}
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
                disabled={submitting}
              />
            </div>

            <button type="submit" className="auth-form__submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
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
