import { useState, useEffect, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  login,
  getCurrentUser,
  doOnAuthStateChange,
  logout,
} from "../services/AuthService";
import { getUserById } from "../services/UserService";
import "./css/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const unsub = doOnAuthStateChange(async (user) => {
      if (!user) {
        setCurrentUser("");
        return;
      }
      const userData = await getUserById(user.uid);
      setCurrentUser(userData.displayName || "");
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log(`Success welcome ${getCurrentUser()?.uid}`);
    } catch (e) {
      alert(`Invalid Username or Password`);
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
          <h1 className="auth-form__title">Login</h1>
          <p className="auth-form__subtitle">Sign In To Your Account</p>

          {currentUser ? (
            <>
              <p className="auth-form__welcome">Welcome, {currentUser}</p>
              <button
                type="button"
                className="auth-form__submit"
                onClick={logout}
              >
                Log Out
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                {/* Changed back to Email Address */}
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={currentUser ? true : false}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">password: </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={currentUser ? true : false}
                />
              </div>

              {/* Changed back to Log In */}
              <button type="submit" className="auth-form__submit">
                Log In
              </button>
            </form>
          )}

          {!currentUser && (
            <p className="auth-form__footer">
              Don&apos;t have an account? <Link to="/add-user">Register</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
