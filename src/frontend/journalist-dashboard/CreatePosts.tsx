import { useState, useEffect, type ChangeEvent, type FormEvent, useRef} from "react";
import { Link } from "react-router-dom";
import { createPost } from "../../services/ArticleService";
import {
  getCurrentUser,
  doOnAuthStateChange,
} from "../../services/AuthService";
import { getUserById } from "../../services/UserService";
import "../css/JournalistDashboard.css";
import {
  House,
  LayoutDashboard,
  Pencil,
  SquarePen,
  Menu,
  X,
} from "lucide-react";
import { compressImage, uploadThumbnail } from "../../services/ImageService";

function CreatePosts() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null)
  const [category, setCategory] = useState("");

  const [preview, setPreview] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async(e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0){
      const file = e.target.files[0];
      const compressed = await compressImage(file);
      const fileURL = URL.createObjectURL(compressed);

      setImage(file);
      setPreview(fileURL);
    }
  }

  const categories = [
    "celebrity",
    "movies & tv",
    "pop culture",
    "music",
    "gaming",
    "sports",
  ];

  useEffect(() => {
    const unsub = doOnAuthStateChange(async (user) => {
      if (!user) {
        setCurrentUser("");
        setCurrentUserId("");
        return;
      }
      setCurrentUserId(getCurrentUser()?.uid || "");
      const userData = await getUserById(user.uid);
      setCurrentUser(userData.displayName || "User");
    });

    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      if (typeof unsub === "function") unsub();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleFormSubmit = async (
    e: FormEvent,
    status: "DRAFT" | "PUBLISHED",
  ) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      if(image){
        imageUrl = await uploadThumbnail(image);
      }

      await createPost({
        creatorId: currentUserId || "temporary-dev-id",
        creatorDisplayName: currentUser,
        title: title,
        content: content,
        imageURL: imageUrl,
        tags: category ? [category] : [],
        status: status,
      });
      console.log(`Success created post with status: ${status}`);
      setTitle("");
      setContent("");
      setCategory("");
      setImage(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
      setIsMobileMenuOpen(false);
    } catch (e) {
      console.error(`Error processing post operations: ${e}`);
    }
  };

  return (
    <div className="dashboard-page">
      {" "}
      <header className="dashboard-header-block">
        <p className="header-text">WebsiteName</p>
        <button
          className="hamburger-trigger"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>
      <div
        className={`dashboard-container ${isCollapsed ? "dashboard-container--collapsed" : ""} ${
          isMobileMenuOpen ? "dashboard-container--mobile-open" : ""
        }`}
      >
        <aside className="dashboard-panel dashboard-panel--sidebar">
          <div className="sidebar__header">
            <button
              className="sidebar__toggle"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? "→" : "←"}
            </button>

            <span className="sidebar__welcome">
              Welcome, {currentUser || "..."}
            </span>
          </div>

          <nav className="sidebar__nav">
            <div className="nav-item">
              <span className="nav-item__icon">
                <LayoutDashboard color="#1E1E1E" strokeWidth={1.25} />
              </span>
              <span className="nav-item__text">
                <Link to="/dashboard">Dashboard</Link>
              </span>
            </div>

            <div className="nav-item">
              <span className="nav-item__icon">
                <House color="#1E1E1E" strokeWidth={1.25} />
              </span>
              <span className="nav-item__text">
                <Link to="/">Feed</Link>
              </span>
            </div>

            <div className="nav-item nav-item--active">
              <span className="nav-item__icon">
                <Pencil strokeWidth={1.5} />
              </span>
              <span className="nav-item__text">Create</span>
            </div>

            <div className="nav-item">
              <span className="nav-item__icon">
                <SquarePen color="#1E1E1E" strokeWidth={1.25} />
              </span>
              <span className="nav-item__text">
                <Link to="/drafts">Drafts</Link>
              </span>
            </div>
          </nav>
        </aside>

        {/* WORKSPACE AREA */}
        <main className="dashboard-panel dashboard-panel--main">
          <h2 className="feed-section-title">Create Post</h2>

          <form
            onSubmit={(e) => handleFormSubmit(e, "PUBLISHED")}
            className="auth-form"
            style={{ maxWidth: "100%" }}
          >
            <div className="auth-field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!currentUserId}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="content">contents </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={!currentUserId}
                required
                style={{
                  width: "100%",
                  minHeight: "160px",
                  border: "none",
                  borderBottom: "1px solid #c8c8c8",
                  background: "transparent",
                  padding: "8px 0",
                  fontFamily: "var(--body, sans-serif)",
                  fontSize: "1rem",
                  color: "#000",
                  outline: "none",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="image">Image:</label>
              <input
                id="image"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={!currentUserId}
              />
              { preview && <img src={preview} alt="" /> }
              </div>

            <div className="auth-field">
              <label htmlFor="category">category: </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: "1px solid #c8c8c8",
                  background: "transparent",
                  padding: "8px 0",
                  fontFamily: "var(--body, sans-serif)",
                  fontSize: "1rem",
                  color: category ? "#000" : "#757575",
                  outline: "none",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                <option value="" disabled hidden>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    style={{ color: "#000", textTransform: "capitalize" }}
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="form-actions-wrapper"
              style={{ display: "flex", gap: "16px", marginTop: "32px" }}
            >
              <button
                type="button"
                className="action-btn action-btn--publish"
                onClick={(e) => handleFormSubmit(e, "PUBLISHED")}
              >
                Publish Post
              </button>

              <button
                type="button"
                className="action-btn action-btn--draft"
                onClick={(e) => handleFormSubmit(e, "DRAFT")}
              >
                Save Draft
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default CreatePosts;
