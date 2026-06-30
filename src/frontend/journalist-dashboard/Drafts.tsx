import { useState, useEffect, type FormEvent, type ChangeEvent, useRef } from "react";
import { Link } from "react-router-dom";
import { getAllPosts, deletePost, updatePostById } from "../../services/ArticleService";
import {
  getCurrentUser,
  doOnAuthStateChange,
} from "../../services/AuthService";
import { getUserById } from "../../services/UserService";
import {compressImage, uploadThumbnail} from "../../services/ImageService";
import type { ArticleProps } from "../../models/Article";
import "../css/JournalistDashboard.css";
import {
  House,
  LayoutDashboard,
  Pencil,
  SquarePen,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

function Drafts() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  const [draftsList, setDraftsList] = useState<ArticleProps[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeDraft, setActiveDraft] = useState<ArticleProps | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const [preview, setPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!currentUserId) return;
    const fetch = async () => {
      try {
        const data = await getAllPosts();
        const drafts = (data as ArticleProps[]).filter(
          (a) => a.creatorId === currentUserId && a.status === "DRAFT",
        );
        setDraftsList(drafts);
      } catch {
        setDraftsList([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [currentUserId]);

  const handleSelectDraft = async(draft: ArticleProps) => {
    setActiveDraft(draft);
    setEditTitle(draft.title);
    setEditContent(draft.content);
    setEditImageUrl(draft.imageURL);
    setEditImage(null);
    setPreview(draft.imageURL);
    setEditCategory(draft.tags?.[0] || "");
  };

  const handleReturnToFeed = () => {
    setActiveDraft(null);
  };

  const handleActionDispatch = async (
    e: FormEvent,
    action: "SAVE" | "PUBLISH" | "DELETE",
  ) => {
    e.preventDefault();
    if (!activeDraft) return;

    try {
      if (action === "DELETE") {
        await deletePost(activeDraft.id);
        setDraftsList((prev) =>
          prev.filter((item) => item.id !== activeDraft.id),
        );
      } else {
        const finalStatus = action === "PUBLISH" ? "PUBLISHED" : "DRAFT";

        let imageUrl = "";
        if(editImage){
          imageUrl = await uploadThumbnail(editImage);
        }

        await updatePostById(activeDraft.id, {
          title: editTitle,
          content: editContent,
          tags: editCategory ? [editCategory] : [],
          status: finalStatus,
          creatorDisplayName: currentUser,
          creatorId: currentUserId,
          imageURL: imageUrl || editImageUrl,
        } as Partial<ArticleProps>);

        setDraftsList((prev) =>
          prev.map((item) =>
            item.id === activeDraft.id
              ? { ...item, title: editTitle, content: editContent, imageURL: editImageUrl, tags: editCategory ? [editCategory] : [], status: finalStatus }
              : item,
          ),
        );

        if (action === "PUBLISH") {
          setDraftsList((prev) =>
            prev.filter((item) => item.id !== activeDraft.id),
          );
        }
      }

      handleReturnToFeed();
    } catch (err) {
      console.error(`Error processing action: ${err}`);
    }
  };

  const handleFileChange = async(e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0){
      const file = e.target.files[0];
      const compressed = await compressImage(file);
      const fileURL = URL.createObjectURL(compressed);

      setEditImage(file);
      setPreview(fileURL);
    }
  }
  return (
    <div className="dashboard-page">
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
            <div className="nav-item">
              <span className="nav-item__icon">
                <Pencil color="#1E1E1E" strokeWidth={1.25} />
              </span>
              <span className="nav-item__text">
                <Link to="/create-post">Create</Link>
              </span>
            </div>
            <div className="nav-item nav-item--active">
              <span className="nav-item__icon">
                <SquarePen strokeWidth={1.5} />
              </span>
              <span className="nav-item__text">Drafts</span>
            </div>
          </nav>
        </aside>

        <main className="dashboard-panel dashboard-panel--main">
          {activeDraft ? (
            <div className="draft-editor-wrapper">
              <div
                className="back-navigation-header"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "24px",
                }}
              >
                <button
                  type="button"
                  onClick={handleReturnToFeed}
                  className="back-btn"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ArrowLeft size={18} color="#1E1E1E" />
                </button>
                <span
                  onClick={handleReturnToFeed}
                  style={{
                    fontFamily: "var(--body, sans-serif)",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Back to Drafts
                </span>
              </div>

              <h2 className="feed-section-title">Edit Draft</h2>

              <form className="auth-form" style={{ maxWidth: "100%" }}>
                <div className="auth-field">
                  <label htmlFor="edit-title">Title</label>
                  <input
                    id="edit-title"
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="edit-content">contents</label>
                  <textarea
                    id="edit-content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
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
                  <label htmlFor="edit-category">category test: </label>
                  <select
                    id="edit-category"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      border: "none",
                      borderBottom: "1px solid #c8c8c8",
                      background: "transparent",
                      padding: "8px 0",
                      fontFamily: "var(--body, sans-serif)",
                      fontSize: "1rem",
                      color: editCategory ? "#000" : "#757575",
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
                    onClick={(e) => handleActionDispatch(e, "PUBLISH")}
                  >
                    Publish Post
                  </button>
                  <button
                    type="button"
                    className="action-btn action-btn--draft"
                    onClick={(e) => handleActionDispatch(e, "SAVE")}
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    className="action-btn action-btn--delete"
                    onClick={(e) => handleActionDispatch(e, "DELETE")}
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="draft-feed-wrapper">
              <h2 className="feed-section-title">Saved Drafts</h2>

              {loading ? (
                <p className="article-status">Loading...</p>
              ) : draftsList.length === 0 ? (
                <p className="article-status">No drafts saved.</p>
              ) : (
                <div className="stories-feed">
                  {draftsList.map((draft) => (
                    <div
                      key={draft.id}
                      className="story-card story-card--clickable"
                      onClick={() => handleSelectDraft(draft)}
                    >
                      <div className="story-card__content">
                        <h3 className="story-card__title">{draft.title}</h3>
                        <p className="story-card__excerpt">{draft.content}</p>
                      </div>

                      <div className="story-card__meta">
                        <div className="story-card__indicator-group">
                          <span className="story-card__tag story-card__tag--draft">
                            DRAFT
                          </span>
                          <span className="story-card__edit-hint-icon">
                            <SquarePen size={14} strokeWidth={2} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Drafts;
