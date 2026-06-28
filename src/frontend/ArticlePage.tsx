import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import InitialAvatar from "./components/InitialAvatar";
import { LatestNewsSidebar, NewsPageShell } from "./components/NewsLayout";
import { ARTICLE_COMMENTS, getArticleById } from "./data/mockArticles";
import type { Comment } from "./data/mockArticles";
import "./ArticlePage.css";

function CommentItem({
  comment,
  depth = 0,
}: {
  comment: Comment;
  depth?: number;
}) {
  const [repliesHidden, setRepliesHidden] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={`comment ${depth > 0 ? "comment--nested" : ""}`}>
      <div className="comment__row">
        <InitialAvatar name={comment.authorName} />
        <div className="comment__content">
          <header className="comment__header">
            <span className="comment__author">{comment.authorName}</span>
            <time className="comment__time">{comment.timestamp}</time>
          </header>
          <p className="comment__text">{comment.content}</p>
          <div className="comment__actions">
            <button
              type="button"
              className="comment__action"
              onClick={() => setReplyOpen((prev) => !prev)}
            >
              Reply
            </button>
            {hasReplies && depth === 0 && (
              <button
                type="button"
                className="comment__action"
                onClick={() => setRepliesHidden((prev) => !prev)}
              >
                {repliesHidden ? "Show replies" : "Hide replies"}
              </button>
            )}
          </div>
          {replyOpen && <CommentInput placeholder="Reply" authorName="You" />}
        </div>
      </div>

      {hasReplies && !repliesHidden && (
        <div className="comment__replies">
          {comment.replies!.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentInput({
  placeholder,
  authorName,
}: {
  placeholder: string;
  authorName: string;
}) {
  return (
    <form className="comment-input" onSubmit={(e) => e.preventDefault()}>
      <InitialAvatar name={authorName} size="sm" />
      <input
        type="text"
        className="comment-input__field"
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </form>
  );
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const article = id ? getArticleById(id) : undefined;

  if (!article) {
    return <Navigate to="/" replace />;
  }

  return (
    <NewsPageShell>
      <main className="news-page__main article-page__main">
        <article className="article-detail">
          <div className="article-detail__layout">
            <div className="article-detail__content">
              <span className="article-detail__category">
                {article.category}
              </span>
              <h1 className="article-detail__title">{article.headline}</h1>
              <footer className="article-detail__meta">
                <time dateTime="2026-06-27">
                  {article.date} - {article.time}
                </time>
                <span className="article-detail__author">
                  <Link to="#">{article.author}</Link>
                </span>
              </footer>
            </div>
            <img
              className="article-detail__image"
              src={article.imageUrl}
              alt=""
            />
            <div className="article-detail__content">
              <div className="article-detail__body">
                <p className="article-detail__text">{article.bodyIntro}</p>
              </div>
            </div>
          </div>

          <section className="comments" aria-label="Comments">
            <h2 className="comments__title">COMMENTS</h2>
            <div className="comments__list">
              {ARTICLE_COMMENTS.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
            <CommentInput placeholder="Write a comment..." authorName="You" />
          </section>
        </article>

        <LatestNewsSidebar />
      </main>
    </NewsPageShell>
  );
}
