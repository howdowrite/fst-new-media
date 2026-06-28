import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  doOnAuthStateChange,
  logout,
} from "../services/AuthService";
import { getUserById } from "../services/UserService";
import type { UserProps } from "../models/User";

export default function Profile() {
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = doOnAuthStateChange(async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      const data = await getUserById(user.uid);
      setUserData(data);
      setLoading(false);
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) return <div className="article-status">Loading...</div>;

  if (!userData) return <div className="article-status">No user data found.</div>;

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <p><strong>Display Name:</strong> {userData.displayName}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Role:</strong> {userData.role}</p>
      <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
        <Link to="/" className="auth-btn">Home</Link>
        <button type="button" className="auth-btn auth-btn--login" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
}
