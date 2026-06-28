import { useState, useEffect, type FormEvent } from "react";
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
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

interface DraftArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  lastUpdated: string;
  status: "DRAFT";
}

function Drafts() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  const [draftsList, setDraftsList] = useState<DraftArticle[]>([
    {
      id: 1,
      title: "Celebrity Lifestyle Lorem Ipsum Lorem Ipsum",
      content: "a",
      category: "celebrity",
      lastUpdated: "28/6/26",
      status: "DRAFT",
    },
    {
      id: 2,
      title: "Turkey vs. USA Sports Lorem Ipsum Lorem Ipsum",
      content:
        "Lorem Ipsum two countries fighting over sports i guess lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lore..",
      category: "sports",
      lastUpdated: "28/6/26",
      status: "DRAFT",
    },
  ]);

  const [activeDraft, setActiveDraft] = useState<DraftArticle | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const categories = [
    "celebrity",
    "movies & tv",
    "pop culture",
    "music",
    "gaming",
    "sports",
  ];

  useEffect(() => {
    // 1. Authentication lifecycle sub
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

    // 2. Automated responsive layout sync
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
        setIsMobileMenuOpen(false); // Clean drawer states if scaling up window width
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      if (typeof unsub === "function") unsub();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSelectDraft = (draft: DraftArticle) => {
    setActiveDraft(draft);
    setEditTitle(draft.title);
    setEditContent(draft.content);
    setEditCategory(draft.category);
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
        setDraftsList((prev) =>
          prev.filter((item) => item.id !== activeDraft.id),
        );
        console.log(
          `Successfully deleted draft tracking index: ${activeDraft.id}`,
        );
      } else {
        const finalStatus = action === "PUBLISH" ? "PUBLISHED" : "DRAFT";

        await createPost({
          creatorId: currentUserId || "temporary-dev-id",
          title: editTitle,
          content: editContent,
          tags: editCategory ? [editCategory] : [],
          status: finalStatus,
        });

        setDraftsList((prev) =>
          prev.map((item) =>
            item.id === activeDraft.id
              ? {
                  ...item,
                  title: editTitle,
                  content: editContent,
                  category: editCategory,
                  lastUpdated: "28/6/26",
                }
              : item,
          ),
        );

        if (action === "PUBLISH") {
          setDraftsList((prev) =>
            prev.filter((item) => item.id !== activeDraft.id),
          );
        }

        console.log(
          `Success handling draft dispatch payload action marked: ${action}`,
        );
      }

      handleReturnToFeed();
    } catch (err) {
      console.error(`Error processing transactional layout actions: ${err}`);
    }
  };

  return (
    <div className="dashboard-page">
      {/* BRANDING HEADER - Interchanges layout setups between desktop and mobile query constraints */}
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
        {/* SIDEBAR PANEL */}
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

        {/* WORKSPACE CONTENT SURFACE */}
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
                  <label htmlFor="edit-category">category: </label>
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

              {draftsList.length === 0 ? (
                <p
                  style={{
                    fontFamily: "var(--body, sans-serif)",
                    color: "#777",
                    paddingLeft: "8px",
                  }}
                >
                  No remaining drafts saved.
                </p>
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
                        <span className="story-card__date">
                          LAST UPDATED: {draft.lastUpdated}
                        </span>

                        <div className="story-card__indicator-group">
                          <span className="story-card__tag story-card__tag--draft">
                            {draft.status}
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
