import { useEffect, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const emptyForm = { title: "", imageUrl: "", content: "" };

function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingPostId, setEditingPostId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const requests = [api.get("/posts/mine")];
      if (user?.role === "admin") {
        requests.push(api.get("/admin/users"));
        requests.push(api.get("/posts"));
      }

      const responses = await Promise.all(requests);
      setPosts(responses[0].data);
      setUsers(user?.role === "admin" ? responses[1].data : []);
      setAllPosts(user?.role === "admin" ? responses[2].data : []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingPostId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingPostId) {
        await api.put(`/posts/${editingPostId}`, formData);
        setMessage("Post updated successfully");
      } else {
        await api.post("/posts", formData);
        setMessage("Post created successfully");
      }
      resetForm();
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save post");
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setFormData({
      title: post.title,
      imageUrl: post.imageUrl || "",
      content: post.content,
    });
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setMessage("Post deleted successfully");
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete post");
    }
  };

  const handleAdminDeletePost = async (postId) => {
    try {
      await api.delete(`/admin/posts/${postId}`);
      setMessage("Post removed by admin");
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete post");
    }
  };

  const handleAdminDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      setMessage("User removed by admin");
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete user");
    }
  };

  return (
    <section className="dashboard-grid">
      <div className="card">
        <h2>{editingPostId ? "Edit Post" : "Create Post"}</h2>
        <form onSubmit={handleSubmit} className="form-stack">
          <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
          <input
            name="imageUrl"
            placeholder="Image URL (optional)"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          {formData.imageUrl ? (
            <img src={formData.imageUrl} alt="Post preview" className="editor-image-preview" />
          ) : null}
          <textarea
            name="content"
            rows="8"
            placeholder="Write your blog content here..."
            value={formData.content}
            onChange={handleChange}
          />
          <div className="button-row">
            <button type="submit">{editingPostId ? "Update Post" : "Publish Post"}</button>
            {editingPostId ? (
              <button type="button" className="ghost-button" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="card">
        <h2>My Posts</h2>
        {loading ? <p>Loading...</p> : null}
        {!loading && posts.length === 0 ? <p>You have not written any posts yet.</p> : null}
        <div className="stack-list">
          {posts.map((post) => (
            <div key={post._id} className="list-item list-item-post">
              <div className="list-item-copy">
                <strong>{post.title}</strong>
                <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
              {post.imageUrl ? <img src={post.imageUrl} alt={post.title} className="list-thumb" /> : null}
              <div className="button-row">
                <button type="button" className="ghost-button" onClick={() => handleEdit(post)}>
                  Edit
                </button>
                <button type="button" className="danger-button" onClick={() => handleDelete(post._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {user?.role === "admin" ? (
        <div className="card admin-panel">
          <h2>Admin Controls</h2>
          <h3>All Users</h3>
          <div className="stack-list">
            {users.map((item) => (
              <div key={item._id} className="list-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>
                    {item.email} | {item.role}
                  </p>
                </div>
                {item._id !== user._id ? (
                  <button type="button" className="danger-button" onClick={() => handleAdminDeleteUser(item._id)}>
                    Delete User
                  </button>
                ) : (
                  <span className="badge">Current Admin</span>
                )}
              </div>
            ))}
          </div>

          <h3>Delete Any Post</h3>
          <div className="stack-list">
            {allPosts.map((post) => (
              <div key={post._id} className="list-item list-item-post">
                <div className="list-item-copy">
                  <strong>{post.title}</strong>
                  <p>{post.author?.name}</p>
                </div>
                {post.imageUrl ? <img src={post.imageUrl} alt={post.title} className="list-thumb" /> : null}
                <button type="button" className="danger-button" onClick={() => handleAdminDeletePost(post._id)}>
                  Delete Post
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default Dashboard;
