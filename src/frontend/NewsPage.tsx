import { Link } from "react-router-dom";
import {
  LatestNewsSidebar,
  NewsPageShell,
} from "./components/NewsLayout";
import { FEATURED_ARTICLES } from "./data/mockArticles";
import type { FeaturedArticle } from "./data/mockArticles";
import "./NewsPage.css";

function FeaturedArticleCard({ article }: { article: FeaturedArticle }) {
  return (
    <article className="featured-article">
      <Link to={`/article/${article.id}`}>
        <img
          className="featured-article__image"
          src={article.imageUrl}
          alt=""
          loading="lazy"
        />
      </Link>
      <div className="featured-article__body">
        <span className="featured-article__category">{article.category}</span>
        <h2 className="featured-article__headline">
          <Link to={`/article/${article.id}`}>{article.headline}</Link>
        </h2>
        <p className="featured-article__snippet">{article.snippet}</p>
        <footer className="featured-article__footer">
          <time dateTime="2026-06-06">{article.date}</time>
          <span className="featured-article__author">
            by <a href="#">{article.author}</a>
          </span>
        </footer>
      </div>
    </article>
  );
}

export default function NewsPage() {
  return (
    <NewsPageShell>
      <main className="news-page__main">
        <section className="featured-section" aria-label="Featured articles">
          {FEATURED_ARTICLES.map((article) => (
            <FeaturedArticleCard key={article.id} article={article} />
          ))}
        </section>
        <LatestNewsSidebar />
      </main>
    </NewsPageShell>
  );
}
