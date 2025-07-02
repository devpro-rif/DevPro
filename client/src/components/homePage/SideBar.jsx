import { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
import { api } from "../../api"; // This is your axios instance with baseURL

export default function Sidebar({ onSelectCommunity, selectedCommunityId, communities: propCommunities }) {
  const [communities, setCommunities] = useState(propCommunities || []);

  useEffect(() => {
    if (propCommunities) {
      setCommunities(propCommunities);
      return;
    }
    api
      .get("/communities")
      .then((res) => setCommunities(res.data))
      .catch((err) => console.error("Sidebar fetch error:", err));
  }, [propCommunities]);

  // Always render the sidebar
  return (
    <nav className="sidebar">
      {/* Home Button */}
      <button
        className={`sidebar-logo${selectedCommunityId == null ? " active" : ""}`}
        title="Home"
        onClick={() => onSelectCommunity(null)}
        style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
      >
        🌐
      </button>

      {/* All Communities */}
      <div className="sidebar-list">
        {communities.map((c) => {
          const active = selectedCommunityId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCommunity(c.id)}
              className={`sidebar-item${active ? " active" : ""}`}
              title={c.name}
              style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
            >
              <img src={c.image} alt={c.name} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
