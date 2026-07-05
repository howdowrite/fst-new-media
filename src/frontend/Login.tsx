import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  login,
  getCurrentUser,
  doOnAuthStateChange,
  logout,
} from "../services/AuthService";
import { getUserById } from "../services/UserService";
import FormMessage from "./components/FormMessage";
import "./css/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [currentUser, setCurrentUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = doOnAuthStateChange(async (user) => {
      if (!user) {
        setCurrentUser("");
        return;
      }
      const userData = await getUserById(user.uid);
      setCurrentUser(userData.displayName || "");
      navigate("/");
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await login(email, password);
      console.log(`Success welcome ${getCurrentUser()?.uid}`);
      navigate("/");
    } catch {
      setMessage({ text: "Invalid email or password", type: "error" });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__image">
        <div className="auth-page__brand-wrap">
          <div className="auth-page__brand">
            <h2 className="auth-page__brand-title">The Culture Feed</h2>
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

          {message && <FormMessage text={message.text} type={message.type} />}

          <div className="auth-form__body">
            <div className="auth-form__main">
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

                  <button type="submit" className="auth-form__submit">
                    Log In
                  </button>
                </form>
              )}

              {!currentUser && (
                <p className="auth-form__footer">
                  Don&apos;t have an account?{" "}
                  <Link to="/add-user">Register</Link>
                </p>
              )}
            </div>

            <div className="auth-form__guidelines">
              <p className="auth-form__guidelines-title">
                Registration Requirements
              </p>
              <div className="auth-form__guidelines-section">
                <p className="auth-form__guidelines-heading">Display Name</p>
                <ul className="auth-form__guidelines-list">
                  <li>Optional — defaults to your email username</li>
                </ul>
              </div>
              <div className="auth-form__guidelines-section">
                <p className="auth-form__guidelines-heading">Email</p>
                <ul className="auth-form__guidelines-list">
                  <li>
                    Must be a valid email with a domain (e.g., name@domain.com)
                  </li>
                  <li>Max 254 characters</li>
                </ul>
              </div>
              <div className="auth-form__guidelines-section">
                <p className="auth-form__guidelines-heading">Password</p>
                <ul className="auth-form__guidelines-list">
                  <li>At least 8 characters</li>
                  <li>Max 128 characters</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
