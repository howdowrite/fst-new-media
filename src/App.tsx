import AddUser from "./frontend/AddUser";
import CreatePosts from "./frontend/CreatePosts";
import Login from "./frontend/Login";
import NewsPage from "./frontend/NewsPage";
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
      </ul>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<NewsPage />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/add-user" element={<AddUser />} />
      <Route path="/create-post" element={<CreatePosts />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
