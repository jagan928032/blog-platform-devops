import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">Ink</span>
          <span className="brand-copy">
            <strong>StoryBoard</strong>
            <small>Write. Publish. Discuss.</small>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          {user ? <NavLink to="/dashboard">Dashboard</NavLink> : null}
          {user ? <span className="nav-user">{user.name}</span> : null}
          {user ? (
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="nav-cta">
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
