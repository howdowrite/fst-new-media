import { useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import InitialAvatar from "./components/InitialAvatar";
import FormMessage from "./components/FormMessage";
import { LatestNewsSidebar, NewsPageShell } from "./components/NewsLayout";
import { getPostById } from "../services/ArticleService";
import { getCommentsByArticleId, addComment } from "../services/CommentService";
import { getCurrentUser, doOnAuthStateChange } from "../services/AuthService";
import { getUserById } from "../services/UserService";
import type { ArticleProps } from "../models/Article";
import type { CommentProps } from "../models/Comment";
import "./ArticlePage.css";

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

function CommentItem({
  comment,
  depth = 0,
}: {
  comment: CommentProps & { id: string };
  depth?: number;
}) {
  return (
    <div className={`comment ${depth > 0 ? "comment--nested" : ""}`}>
      <div className="comment__row">
        <InitialAvatar name={comment.creatorDisplayName} />
        <div className="comment__content">
          <header className="comment__header">
            <span className="comment__author">
              {comment.creatorDisplayName}
            </span>
            <time className="comment__time">
              {formatDate(comment.createdAt)}
            </time>
          </header>
          <p className="comment__text">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleProps | null>(null);
  const [comments, setComments] = useState<(CommentProps & { id: string })[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentDisplayName, setCurrentDisplayName] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [commentMsg, setCommentMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const unsub = doOnAuthStateChange(async (user) => {
      if (!user) {
        setCurrentUserId("");
        setCurrentDisplayName("");
        return;
      }
      setCurrentUserId(getCurrentUser()?.uid || "");
      try {
        const userData = await getUserById(user.uid);
        setCurrentDisplayName(userData.displayName || "User");
      } catch {
        setCurrentDisplayName(getCurrentUser()?.email?.split("@")[0] || "User");
      }
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const articleData = await getPostById(id);
        setArticle(articleData);

        try {
          const stored = localStorage.getItem("recentlyViewed");
          let recent: Array<{
            id: string;
            title: string;
            content: string;
            creatorDisplayName: string;
            imageURL?: string;
          }> = stored ? JSON.parse(stored) : [];
          recent = recent.filter((item) => item.id !== id);
          recent.unshift({
            id: articleData.id,
            title: articleData.title,
            content: articleData.content,
            creatorDisplayName: articleData.creatorDisplayName,
            imageURL: articleData.imageURL,
          });
          recent = recent.slice(0, 5);
          localStorage.setItem("recentlyViewed", JSON.stringify(recent));
          window.dispatchEvent(new CustomEvent("recentlyViewedUpdated"));
        } catch {
          /* ignore localStorage errors */
        }

        const commentData = await getCommentsByArticleId(id);
        const mapped = commentData.map(
          (c) =>
            ({
              ...c,
              id: c.id,
            }) as CommentProps & { id: string },
        );
        setComments(mapped);
      } catch {
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCommentMsg(null);
    if (!commentInput.trim() || !currentUserId || !id) {
      setCommentMsg({
        text: "You must be logged in to comment.",
        type: "error",
      });
      return;
    }
    setSubmittingComment(true);
    try {
      await addComment({
        articleId: id,
        userId: currentUserId,
        creatorDisplayName: currentDisplayName,
        content: commentInput.trim(),
      });
      setCommentInput("");
      setCommentMsg({ text: "Comment posted.", type: "success" });
      const commentData = await getCommentsByArticleId(id);
      const mapped = commentData.map(
        (c) =>
          ({
            ...c,
            id: c.id,
          }) as CommentProps & { id: string },
      );
      setComments(mapped);
    } catch (e) {
      setCommentMsg({
        text:
          e instanceof Error
            ? e.message
            : "Failed to post comment. Please try again.",
        type: "error",
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <NewsPageShell>
        <main className="news-page__main article-page__main">
          <p className="article-status">Loading...</p>
        </main>
      </NewsPageShell>
    );
  }

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
                {article.tags?.[0] || "GENERAL"}
              </span>
              <h1 className="article-detail__title">{article.title}</h1>
              <footer className="article-detail__meta">
                <time>{formatDate(article.createdAt)}</time>
                <span className="article-detail__author">
                  {article.creatorDisplayName}
                </span>
              </footer>
            </div>
            {article.imageURL && (
              <img
                className="article-detail__image"
                src={article.imageURL}
                alt=""
              />
            )}
            <div className="article-detail__content">
              <div className="article-detail__body">
                <p className="article-detail__text">{article.content}</p>
              </div>
            </div>
          </div>

          <section className="comments" aria-label="Comments">
            <h2 className="comments__title">COMMENTS</h2>
            <div className="comments__list">
              {comments.length === 0 ? (
                <p className="article-status">No comments yet.</p>
              ) : (
                comments
                  .filter((c) => !c.replyTargetId || c.replyTargetId === id)
                  .map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))
              )}
            </div>
            {commentMsg && (
              <FormMessage text={commentMsg.text} type={commentMsg.type} />
            )}
            <form className="comment-input" onSubmit={handleCommentSubmit}>
              <InitialAvatar name={currentDisplayName || "?"} size="sm" />
              <input
                type="text"
                className="comment-input__field"
                placeholder={
                  currentUserId ? "Write a comment..." : "Log in to comment"
                }
                aria-label="Write a comment"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                disabled={!currentUserId || submittingComment}
              />
            </form>
          </section>
        </article>

        <LatestNewsSidebar />
      </main>
    </NewsPageShell>
  );
}
