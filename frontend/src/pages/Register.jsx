import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      navigate("/dashboard");
    } else {
      setMessage(result.message);
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-panel auth-panel-info warm-panel">
        <span className="eyebrow">Create your profile</span>
        <h1>Turn ideas into published stories in a few minutes.</h1>
        <p>
          Register once and you can create articles, manage your own posts, and join the comment threads under every
          blog entry.
        </p>
        <ul className="feature-list">
          <li>Secure JWT-based signup and login</li>
          <li>Personal dashboard for writing and editing</li>
          <li>Public blog feed with comments and moderation</li>
        </ul>
      </div>

      <div className="auth-panel auth-card">
        <span className="eyebrow">New account</span>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="form-stack">
          <label className="field-label">
            Name
            <input name="name" placeholder="Your name" value={formData.name} onChange={handleChange} />
          </label>
          <label className="field-label">
            Email
            <input name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
          </label>
          <label className="field-label">
            Password
            <input
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          <label className="field-label">
            Confirm password
            <input
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        {message ? <p className="error-text banner-error">{message}</p> : null}
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
