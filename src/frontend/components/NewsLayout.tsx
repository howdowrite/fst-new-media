import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { NAV_LINKS } from "../data/mockArticles";
import { getLatestPosts } from "../../services/ArticleService";
import type { ArticleProps } from "../../models/Article";
import { getUserById } from "../../services/UserService";
import {
  getCurrentUser,
  doOnAuthStateChange,
  logout,
} from "../../services/AuthService";
import "../NewsPage.css";

export function TopNav() {
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const activeCategory = searchParams.get("category") || "";

  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="top-nav" aria-label="Categories">
      <button
        className={`top-nav__toggle ${isOpen ? "top-nav__toggle--open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      <ul className={`top-nav__list ${isOpen ? "top-nav__list--open" : ""}`}>
        <li>
          <Link
            to="/"
            onClick={handleLinkClick}
            className={`top-nav__link ${!activeCategory ? "top-nav__link--active" : ""}`}
          >
            ALL
          </Link>
        </li>
        {NAV_LINKS.map((link) => (
          <li key={link}>
            <Link
              to={`/?category=${encodeURIComponent(link)}`}
              onClick={handleLinkClick}
              className={`top-nav__link ${activeCategory === link ? "top-nav__link--active" : ""}`}
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteHeader() {
  const [currentUser, setCurrentUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [logoutMsg, setLogoutMsg] = useState("");

  useEffect(() => {
    const unsub = doOnAuthStateChange(async (user) => {
      if (!user) {
        setCurrentUser("");
        setUserRole("");
        return;
      }
      const uid = getCurrentUser()?.uid || "";
      setCurrentUser(uid);
      try {
        const userData = await getUserById(uid);
        setUserRole(userData.role);
      } catch {
        setUserRole("");
      }
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setCurrentUser("");
    setLogoutMsg("Logged out successfully.");
    setTimeout(() => setLogoutMsg(""), 3000);
  };

  return (
    <>
      {logoutMsg && (
        <div
          className="notification-banner notification-banner--success"
          role="status"
        >
          <p>{logoutMsg}</p>
        </div>
      )}
      <header className="site-header">
        <h1 className="site-header__logo">
          <Link to="/">WEBSITENAME</Link>
        </h1>
        <div className="site-header__search">
          <input
            type="search"
            className="site-header__search-input"
            placeholder="Search..."
            aria-label="Search articles"
          />
        </div>
        <div className="site-header__auth">
          {currentUser ? (
            <>
              {userRole === "JOURNALIST" && (
                <Link to="/dashboard" className="auth-btn auth-btn--register">
                  Dashboard
                </Link>
              )}
              <span className="auth-btn auth-btn--login" onClick={handleLogout}>
                Log Out
              </span>
            </>
          ) : (
            <>
              <Link to="/add-user" className="auth-btn auth-btn--register">
                Register
              </Link>
              <Link to="/login" className="auth-btn auth-btn--login">
                Login
              </Link>
            </>
          )}
        </div>
      </header>
    </>
  );
}

function LatestArticleCard({ article }: { article: ArticleProps }) {
  return (
    <article className="latest-article">
      <h2 className="latest-article__headline">
        <Link to={`/article/${article.id}`}>{article.title}</Link>
      </h2>
      <p className="latest-article__snippet">{article.content}</p>
      <footer className="latest-article__footer">
        <span className="latest-article__author">
          by {article.creatorDisplayName || article.creatorId.slice(0, 8)}
        </span>
      </footer>
    </article>
  );
}

export function LatestNewsSidebar() {
  const [latest, setLatest] = useState<ArticleProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getLatestPosts(5);
        setLatest(data);
      } catch {
        setLatest([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <aside className="latest-section" aria-label="Latest news">
      <h2 className="latest-section__title">LATEST NEWS</h2>
      <div className="latest-section__list">
        {loading ? (
          <p className="article-status">Loading...</p>
        ) : latest.length === 0 ? (
          <p className="article-status">No articles yet.</p>
        ) : (
          latest.map((article) => (
            <LatestArticleCard key={article.id} article={article} />
          ))
        )}
      </div>
    </aside>
  );
}

interface RecentlyViewedItem {
  id: string;
  title: string;
  content: string;
  creatorDisplayName: string;
  imageURL?: string;
}

export function RecentlyViewedSidebar() {
  const [recent, setRecent] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    const load = () => {
      try {
        const stored = localStorage.getItem("recentlyViewed");
        if (stored) setRecent(JSON.parse(stored));
      } catch {
        setRecent([]);
      }
    };
    load();
    window.addEventListener("recentlyViewedUpdated", load);
    return () => window.removeEventListener("recentlyViewedUpdated", load);
  }, []);

  if (recent.length === 0) return null;

  return (
    <aside className="latest-section" aria-label="Recently viewed">
      <h2 className="latest-section__title">RECENTLY VIEWED</h2>
      <div className="latest-section__list">
        {recent.map((item) => (
          <article className="latest-article" key={item.id}>
            <h2 className="latest-article__headline">
              <Link to={`/article/${item.id}`}>{item.title}</Link>
            </h2>
            <p className="latest-article__snippet">{item.content}</p>
            <footer className="latest-article__footer">
              <span className="latest-article__author">
                by {item.creatorDisplayName}
              </span>
            </footer>
          </article>
        ))}
      </div>
    </aside>
  );
}

interface NewsPageShellProps {
  children: ReactNode;
}

export function NewsPageShell({ children }: NewsPageShellProps) {
  return (
    <div className="news-page">
      <TopNav />
      <div className="news-page__container">
        <SiteHeader />
        {children}
      </div>
    </div>
  );
}
