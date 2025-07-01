import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../../api";

/* Optional: if you have an AuthContext already */
import { useAuth } from "../../context/AuthProvider";

export default function Sidebar() {
    const { token } = useAuth();
//   const { token } = useAuth?.() ?? { token: localStorage.getItem("token") };
  const [communities, setCommunities] = useState([]);
  const location = useLocation();

  /* Fetch communities the user has joined */
  useEffect(() => {
    if (!token) return;
    api
      .get("/communities/user/communities") // router.get("/user/communities")
      .then(({ data }) => setCommunities(data))
      .catch(console.error);
  }, [token]);

  /* Hide sidebar until the user is authenticated */
  if (!token) return null;

  return (
    <nav className="sidebar">
      {/* Home button at the top */}
      <Link to="/" className="sidebar-logo" title="Home">
        🌐
      </Link>

      {/* User’s communities */}
      <div className="sidebar-list">
        {communities.map((c) => {
          const active = location.pathname.includes(`/community/${c.id}`);
          return (
            <Link
              key={c.id}
              to={`/community/${c.id}`}
              className={`sidebar-item ${active ? "active" : ""}`}
              title={c.name}
            >
              <img src={c.image} alt={c.name} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
