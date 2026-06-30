import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  LatestNewsSidebar,
  NewsPageShell,
  RecentlyViewedSidebar,
} from "./components/NewsLayout";
import { getAllPosts } from "../services/ArticleService";
import type { ArticleProps } from "../models/Article";
import "./NewsPage.css";

const formatDate = (ts: unknown) => {
  if (!ts) return "";
  if (typeof (ts as any)?.toDate === "function") {
    return (ts as any).toDate().toLocaleDateString();
  }
  if (typeof (ts as any)?.seconds === "number") {
    return new Date((ts as any).seconds * 1000).toLocaleDateString();
  }
  return "";
};

function FeaturedArticleCard({ article }: { article: ArticleProps }) {
  return (
    <article className="featured-article">
      <Link to={`/article/${article.id}`}>
        {article.imageURL && (
          <img
            className="featured-article__image"
            src={article.imageURL}
            alt=""
            loading="lazy"
          />
        )}
      </Link>
      <div className="featured-article__body">
        <span className="featured-article__category">
          {article.tags?.[0] || "GENERAL"}
        </span>
        <h2 className="featured-article__headline">
          <Link to={`/article/${article.id}`}>{article.title}</Link>
        </h2>
        <p className="featured-article__snippet">{article.content}</p>
        <footer className="featured-article__footer">
          <time>{formatDate(article.createdAt)}</time>
          <span className="featured-article__author">
            by {article.creatorDisplayName || article.creatorId.slice(0, 8)}
          </span>
        </footer>
      </div>
    </article>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllPosts();
        const published = (data as ArticleProps[]).filter(
          (a) => a.status === "PUBLISHED"
        );
        setArticles(published);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredArticles = categoryFilter
    ? articles.filter((a) =>
        a.tags?.some((tag) => tag.toLowerCase() === categoryFilter.toLowerCase()),
      )
    : articles;

  return (
    <NewsPageShell>
      <main className="news-page__main">
        <section className="featured-section" aria-label="Featured articles">
          {loading ? (
            <p className="article-status">Loading...</p>
          ) : filteredArticles.length === 0 ? (
            <p className="article-status">No articles yet.</p>
          ) : (
            filteredArticles.map((article) => (
              <FeaturedArticleCard key={article.id} article={article} />
            ))
          )}
        </section>
        <div>
          <LatestNewsSidebar />
          <RecentlyViewedSidebar />
        </div>
      </main>
    </NewsPageShell>
  );
}
