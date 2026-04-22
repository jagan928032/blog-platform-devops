import { Link } from "react-router-dom";

function PostCard({ post }) {
  const excerpt = post.content.length > 180 ? `${post.content.slice(0, 180)}...` : post.content;

  return (
    <article className="card post-card">
      {post.imageUrl ? <img src={post.imageUrl} alt={post.title} className="post-card-image" /> : null}
      <div className="post-meta">
        <span className="meta-pill">{post.author?.name || "Unknown Author"}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <h3>{post.title}</h3>
      <p>{excerpt}</p>
      <Link to={`/posts/${post._id}`} className="link-button">
        Read article
      </Link>
    </article>
  );
}

export default PostCard;
