import "./NewsPage.css";

const NAV_LINKS = [
  "CELEBRITY",
  "MOVIES & TV",
  "POP CULTURE",
  "MUSIC",
  "GAMING",
  "SPORTS",
] as const;

interface FeaturedArticle {
  id: string;
  category: string;
  headline: string;
  snippet: string;
  date: string;
  author: string;
  imageUrl: string;
}

interface LatestArticle {
  id: string;
  headline: string;
  snippet: string;
  author: string;
}

const FEATURED_ARTICLES: FeaturedArticle[] = [
  {
    id: "1",
    category: "SPORTS",
    headline: "Turkey vs. USA: A Clash of Titans in the World Cup Qualifiers",
    snippet:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    date: "June 06, 2026",
    author: "Dana Analia",
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    category: "SPORTS",
    headline: "Turkey vs. USA: A Clash of Titans in the World Cup Qualifiers",
    snippet:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    date: "June 06, 2026",
    author: "Dana Analia",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffeeba9e7a36?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    category: "SPORTS",
    headline: "Turkey vs. USA: A Clash of Titans in the World Cup Qualifiers",
    snippet:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    date: "June 06, 2026",
    author: "Dana Analia",
    imageUrl:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&h=400&fit=crop",
  },
];

const LATEST_ARTICLES: LatestArticle[] = [
  {
    id: "1",
    headline:
      "Breaking: Major Studio Announces Surprise Sequel to Cult Classic Film",
    snippet:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    author: "Juliana J",
  },
  {
    id: "2",
    headline: "Chart-Topping Artist Drops Unexpected Collaboration Album",
    snippet:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    author: "Juliana J",
  },
  {
    id: "3",
    headline: "Tech Giant Unveils Next-Gen Gaming Console at Summer Expo",
    snippet:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    author: "Juliana J",
  },
];

function TopNav() {
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

function SiteHeader() {
  return (
    <header className="site-header">
      <h1 className="site-header__logo">WEBSITENAME</h1>
      <div className="site-header__search">
        <input
          type="search"
          className="site-header__search-input"
          placeholder="Search..."
          aria-label="Search articles"
        />
      </div>
      <div className="site-header__auth form-input">
        <button type="button" className="auth-btn auth-btn--register">
          Register
        </button>
        <button type="button" className="auth-btn auth-btn--login">
          Login
        </button>
      </div>
    </header>
  );
}

function FeaturedArticleCard({ article }: { article: FeaturedArticle }) {
  return (
    <article className="featured-article">
      <img
        className="featured-article__image"
        src={article.imageUrl}
        alt=""
        loading="lazy"
      />
      <div className="featured-article__body">
        <span className="featured-article__category">{article.category}</span>
        <h2 className="featured-article__headline">{article.headline}</h2>
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

function LatestArticleCard({ article }: { article: LatestArticle }) {
  return (
    <article className="latest-article">
      <h2 className="latest-article__headline">{article.headline}</h2>
      <p className="latest-article__snippet">{article.snippet}</p>
      <footer className="latest-article__footer">
        <span className="latest-article__author">
          by <a href="#">{article.author}</a>
        </span>
      </footer>
    </article>
  );
}

export default function NewsPage() {
  return (
    <div className="news-page">
      <TopNav />
      <div className="news-page__container">
        <SiteHeader />
        <main className="news-page__main">
          <section className="featured-section" aria-label="Featured articles">
            {FEATURED_ARTICLES.map((article) => (
              <FeaturedArticleCard key={article.id} article={article} />
            ))}
          </section>
          <aside className="latest-section" aria-label="Latest news">
            <h2 className="latest-section__title">LATEST NEWS</h2>
            <div className="latest-section__list">
              {LATEST_ARTICLES.map((article) => (
                <LatestArticleCard key={article.id} article={article} />
              ))}
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
