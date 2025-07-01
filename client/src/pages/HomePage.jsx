import { useEffect, useState } from "react";
import { api } from "../api";
import CommunityCard from "../components/homePage/CommunityCard";
import AddCommunityModal from "../components/homePage/AddCommunityModal";
import "../components/homePage/styles.css";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [communities, setCommunities] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get("/communities")               
       .then(({ data }) => setCommunities(data))
       .catch(console.error);
  }, []);

  const handleCreate = async (formData) => {
    const { data: newCommunity } = await api.post("/communities", formData); // POST -> router.post('/')
    setCommunities((prev) => [...prev, newCommunity]);
    setShowModal(false);
  };

  return (
    <div className="app-shell">
      <nav className="sidebar">
        <Link to="/" className="sidebar-logo" title="Home">
          🌐
        </Link>
        <div className="sidebar-list">
          {communities.map((c) => (
            <Link
              key={c.id}
              to={`/community/${c.id}`}
              className="sidebar-item"
              title={c.name}
            >
              <img src={c.image} alt={c.name} />
            </Link>
          ))}
        </div>
      </nav>
      <main className="main-area">
        <header className="page-header">
          <h1 className="heading">Crowdfunding Communities</h1>
          <button className="primary" onClick={() => setShowModal(true)}>
            ➕ Add Community
          </button>
        </header>
        <section className="card-grid">
          {communities.length === 0 ? (
            <p className="center">No communities yet. Be the first to add one!</p>
          ) : (
            communities.map((c) => <CommunityCard key={c.id} {...c} />)
          )}
        </section>
        {showModal && (
          <AddCommunityModal
            onClose={() => setShowModal(false)}
            onSubmit={handleCreate}
          />
        )}
      </main>
    </div>
  );
}
