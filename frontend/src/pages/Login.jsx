import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const redirectPath = location.state?.from?.pathname || "/dashboard";

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const result = await login(formData);
    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setMessage(result.message);
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-panel auth-panel-info">
        <span className="eyebrow">Welcome back</span>
        <h1>Pick up the conversation where you left off.</h1>
        <p>
          Login to publish new stories, manage your dashboard, and take part in the comments around every post.
        </p>
        <ul className="feature-list">
          <li>Write and edit posts from one dashboard</li>
          <li>Join public discussions on every article</li>
          <li>Use admin controls when your account has elevated access</li>
        </ul>
      </div>

      <div className="auth-panel auth-card">
        <span className="eyebrow">Account access</span>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="form-stack">
          <label className="field-label">
            Email
            <input name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
          </label>
          <label className="field-label">
            Password
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        {message ? <p className="error-text banner-error">{message}</p> : null}
        <p className="auth-switch">
          Need an account? <Link to="/register">Create one here</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
