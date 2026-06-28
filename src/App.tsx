import AddUser from "./frontend/AddUser";
import CreatePosts from "./frontend/journalist-dashboard/CreatePosts";
import Login from "./frontend/Login";
import NewsPage from "./frontend/NewsPage";
import ArticlePage from "./frontend/ArticlePage";
import JournalistDashboard from "./frontend/JournalistDashboard";
import Drafts from "./frontend/journalist-dashboard/Drafts";
import Profile from "./frontend/Profile";
import ProtectedRoute from "./frontend/components/ProtectedRoute";
import NotFound from "./frontend/components/NotFound";
import "./App.css";
import { Link, Routes, Route } from "react-router-dom";

function AdminHome() {
  return (
    <>
      <h1>BACKEND TESTING</h1>
      <p>Defualts: email: john.doe@example.com; password: 1234567890</p>
      <ul>
        <li>
          <Link to="/add-user">Add User</Link>
        </li>
        <li>
          <Link to="/create-post">Create Post</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/drafts">Drafts</Link>
        </li>
      </ul>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<NewsPage />} />
      <Route path="/article/:id" element={<ArticlePage />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/add-user" element={<AddUser />} />
      <Route path="/create-post" element={<ProtectedRoute><CreatePosts /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><JournalistDashboard /></ProtectedRoute>} />
      <Route path="/drafts" element={<ProtectedRoute><Drafts /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
