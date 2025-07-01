import { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider"; // Adjust path
import { api } from "../../api"; // This is your axios instance with baseURL

export default function Sidebar() {
  const location = useLocation();
  const { token } = useContext(AuthContext) || {};
  const [communities, setCommunities] = useState([]);

  const authToken = token || localStorage.getItem("token");

  useEffect(() => {
    if (!authToken) return;

    api
      .get("/communities/user/communities", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((res) => setCommunities(res.data))
      .catch((err) => console.error("Sidebar fetch error:", err));
  }, [authToken]);

  if (!authToken) return null;

  return (
    <nav className="sidebar">
      {/* Home Button */}
      <Link to="/" className="sidebar-logo" title="Home">
        🌐
      </Link>

      {/* Joined Communities */}
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
