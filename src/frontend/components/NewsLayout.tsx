import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { LATEST_ARTICLES, NAV_LINKS } from "../data/mockArticles";
import type { LatestArticle } from "../data/mockArticles";
import {
  getCurrentUser,
  doOnAuthStateChange,
  logout,
} from "../../services/AuthService";
import "../NewsPage.css";

export function TopNav() {
  return (
    <nav className="top-nav" aria-label="Categories">
      <ul className="top-nav__list">
        {NAV_LINKS.map((link) => (
          <li key={link}>
            <a href="#" className="top-nav__link">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteHeader() {
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const unsub = doOnAuthStateChange(async (user) => {
      if (!user) {
        setCurrentUser("");
        return;
      }
      setCurrentUser(getCurrentUser()?.uid || "");
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setCurrentUser("");
  };

  return (
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
            <Link to="/dashboard" className="auth-btn auth-btn--register">
              Dashboard
            </Link>
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
  );
}

function LatestArticleCard({ article }: { article: LatestArticle }) {
  return (
    <article className="latest-article">
      <h2 className="latest-article__headline">
        <Link to={`/article/${article.id}`}>{article.headline}</Link>
      </h2>
      <p className="latest-article__snippet">{article.snippet}</p>
      <footer className="latest-article__footer">
        <span className="latest-article__author">
          by <a href="#">{article.author}</a>
        </span>
      </footer>
    </article>
  );
}

export function LatestNewsSidebar() {
  return (
    <aside className="latest-section" aria-label="Latest news">
      <h2 className="latest-section__title">LATEST NEWS</h2>
      <div className="latest-section__list">
        {LATEST_ARTICLES.map((article) => (
          <LatestArticleCard key={article.id} article={article} />
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
