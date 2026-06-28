import { useState, useEffect } from 'react'
import { getAllPosts } from './services/ArticleService'
import { getCurrentUser, doOnAuthStateChange } from './services/AuthService'
import { addComment } from './services/CommentService'
import type { ArticleProps } from './models/Article'
import './App.css'

function ArticleViewer() {
  const [articles, setArticles] = useState<ArticleProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentUserId, setCurrentUserId] = useState('')
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})

  doOnAuthStateChange(() => setCurrentUserId(getCurrentUser()?.uid || ''))

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getAllPosts()
        setArticles(data as ArticleProps[])
      } catch (e) {
        setError(`Failed to load articles: ${e}`)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const formatDate = (ts: unknown) => {
    if (!ts) return '—'
    if (typeof (ts as any)?.toDate === 'function') {
      return (ts as any).toDate().toLocaleDateString()
    }
    if (typeof (ts as any)?.seconds === 'number') {
      return new Date((ts as any).seconds * 1000).toLocaleDateString()
    }
    return '—'
  }

  const handleCommentSubmit = async (articleId: string) => {
    const content = commentInputs[articleId]?.trim()
    if (!content || !currentUserId) return
    try {
      await addComment({ articleId, userId: currentUserId, content })
      console.log(`Comment added to article ${articleId}`)
      setCommentInputs(prev => ({ ...prev, [articleId]: '' }))
    } catch (e) {
      console.error(`Failed to add comment: ${e}`)
    }
  }

  if (loading) return (
    <div className="article-viewer">
      <h2>Articles:</h2>
      <p className="article-status">Loading...</p>
    </div>
  )

  if (error) return (
    <div className="article-viewer">
      <h2>Articles:</h2>
      <p className="article-status error">{error}</p>
    </div>
  )

  return (
    <div className="article-viewer">
      <h2>Articles:</h2>
      {articles.length === 0 && <p className="article-status">No articles found.</p>}
      {articles.map(article => (
        <div key={article.id} className="article-card">
          <h3>{article.title}</h3>
          <p className="article-meta">
            Status: {article.status} | Creator: {article.creatorId} | {formatDate(article.createdAt)}
          </p>
          <div className="article-scroll">
            <p className="article-content">{article.content}</p>
          </div>
          {article.tags?.length > 0 && (
            <p className="article-tags">Tags: {article.tags.join(', ')}</p>
          )}
          <div className="comment-box">
            <textarea
              placeholder={currentUserId ? "Write a comment..." : "Log in to comment"}
              disabled={!currentUserId}
              value={commentInputs[article.id] || ''}
              onChange={e => setCommentInputs(prev => ({ ...prev, [article.id]: e.target.value }))}
            />
            <button
              disabled={!currentUserId || !commentInputs[article.id]?.trim()}
              onClick={() => handleCommentSubmit(article.id)}
            >
              Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ArticleViewer
