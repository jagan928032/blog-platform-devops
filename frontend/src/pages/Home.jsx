import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import PostCard from "../components/PostCard.jsx";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get("/posts");
        setPosts(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="page-stack">
      <div className="hero hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Modern publishing for teams and creators</span>
          <h1>Share ideas that feel worth reading.</h1>
          <p>
            StoryBoard is a lightweight blogging platform where writers can publish posts, readers can join the
            conversation, and admins can keep everything under control.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="primary-link">
              Start writing
            </Link>
            <Link to="/login" className="secondary-link">
              Sign in
            </Link>
          </div>
        </div>

        <div className="hero-aside">
          <div className="hero-stat">
            <strong>{posts.length}</strong>
            <span>Published stories</span>
          </div>
          <div className="hero-stat">
            <strong>JWT</strong>
            <span>Secure auth flow</span>
          </div>
          <div className="hero-stat">
            <strong>MVC</strong>
            <span>Clean Express backend</span>
          </div>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">Latest posts</span>
          <h2>Fresh writing from the community</h2>
        </div>
        {loading ? <p>Loading posts...</p> : null}
      </div>

      {error ? <p className="error-text banner-error">{error}</p> : null}

      {!loading && posts.length === 0 ? (
        <div className="card empty-state">
          <h3>No posts yet</h3>
          <p>Create the first article from your dashboard and it will show up here for everyone.</p>
        </div>
      ) : null}

      <div className="grid">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default Home;
