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
import ConnectionBanner from "./frontend/components/ConnectionBanner";
import "./App.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <ConnectionBanner />
      <Routes>
        <Route path="/" element={<NewsPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-post" element={<ProtectedRoute allowedRoles={["ADMIN", "JOURNALIST"]}><CreatePosts /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["ADMIN", "JOURNALIST"]}><JournalistDashboard /></ProtectedRoute>} />
        <Route path="/drafts" element={<ProtectedRoute allowedRoles={["ADMIN", "JOURNALIST"]}><Drafts /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={["ADMIN", "JOURNALIST"]}><Profile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
