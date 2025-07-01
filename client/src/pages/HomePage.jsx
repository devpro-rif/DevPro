import { useEffect, useState } from "react";
import { api } from "../api";
import CommunityCard from "../components/homePage/CommunityCard";
import AddCommunityModal from "../components/homePage/AddCommunityModal";

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
    <main className="wrapper">
      <header className="page-header">
        <h1>Crowdfunding Communities</h1>
        <button className="primary" onClick={() => setShowModal(true)}>
          ➕ Add Community
        </button>
      </header>

      <section className="card-grid">
        {communities.map((c) => (
          <CommunityCard key={c.id} {...c} />
        ))}
      </section>

      {showModal && (
        <AddCommunityModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
        />
      )}
    </main>
  );
}
