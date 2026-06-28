import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doOnAuthStateChange } from "../services/AuthService";
import { getUserById } from "../services/UserService";
import { getAllPosts } from "../services/ArticleService";
import type { ArticleProps } from "../models/Article";
import "./css/JournalistDashboard.css";
import {
  House,
  LayoutDashboard,
  Pencil,
  SquarePen,
  Menu,
  X,
} from "lucide-react";

function JournalistDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [stories, setStories] = useState<ArticleProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = doOnAuthStateChange(async (user) => {
      if (!user) {
        setCurrentUser("");
        setCurrentUserId("");
        return;
      }
      const uid = user.uid;
      setCurrentUserId(uid);
      const userData = await getUserById(uid);
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
        const userPosts = (data as ArticleProps[]).filter(
          (a) => a.creatorId === currentUserId,
        );
        setStories(userPosts);
      } catch {
        setStories([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [currentUserId]);

  return (
    <div className="dashboard-page">
      {/* BRANDING HEADER - Swaps behavior internally between layouts using mobile CSS */}
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
            <div className="nav-item nav-item--active">
              <span className="nav-item__icon">
                <LayoutDashboard strokeWidth={1.5} />
              </span>
              <span className="nav-item__text">{"Dashboard"}</span>
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
          <h2 className="feed-section-title">MOST RECENT</h2>

          <div className="stories-feed">
            {loading ? (
              <p className="article-status">Loading...</p>
            ) : stories.length === 0 ? (
              <p className="article-status">No stories yet.</p>
            ) : (
              stories.map((story) => (
                <div key={story.id} className="story-card">
                  <div className="story-card__content">
                    <h3 className="story-card__title">{story.title}</h3>
                    <p className="story-card__excerpt">{story.content}</p>
                  </div>

                  <div className="story-card__meta">
                    <span className="story-card__date">
                      LAST UPDATED: {story.modifiedAt
                        ? (typeof story.modifiedAt === "object" && "toDate" in story.modifiedAt
                          ? (story.modifiedAt as { toDate: () => Date }).toDate().toLocaleDateString()
                          : "")
                        : ""}
                    </span>
                    <span
                      className={`story-card__tag story-card__tag--${story.status.toLowerCase()}`}
                    >
                      {story.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default JournalistDashboard;
