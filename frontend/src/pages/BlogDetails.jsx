import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

function BlogDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/posts/${id}`);
      setPost(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const submitComment = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post(`/comments/post/${id}`, { content: commentText });
      setCommentText("");
      setMessage("Comment added");
      fetchPost();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add comment");
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setMessage("Comment deleted");
      fetchPost();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete comment");
    }
  };

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (!post) {
    return <p className="error-text">{error || "Post not found"}</p>;
  }

  return (
    <section className="detail-layout">
      <article className="card post-detail-card">
        {post.imageUrl ? <img src={post.imageUrl} alt={post.title} className="post-detail-image" /> : null}
        <div className="post-meta">
          <span>{post.author?.name}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <h1>{post.title}</h1>
        <p className="post-content">{post.content}</p>
      </article>

      <section className="card">
        <h2>Comments</h2>
        {user ? (
          <form onSubmit={submitComment} className="form-stack">
            <textarea
              rows="4"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
            />
            <button type="submit">Add Comment</button>
          </form>
        ) : (
          <p>Login to join the discussion.</p>
        )}
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="stack-list">
          {post.comments?.length === 0 ? <p>No comments yet.</p> : null}
          {post.comments?.map((comment) => {
            const canDelete = user && (user._id === comment.author?._id || user.role === "admin");

            return (
              <div key={comment._id} className="comment-item">
                <div>
                  <strong>{comment.author?.name}</strong>
                  <p>{comment.content}</p>
                </div>
                {canDelete ? (
                  <button type="button" className="ghost-button" onClick={() => deleteComment(comment._id)}>
                    Delete
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}

export default BlogDetails;
