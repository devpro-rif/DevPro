import { useEffect, useState } from "react";
import { api } from "../api";
import CommunityCard from "../components/homePage/CommunityCard";
import AddCommunityModal from "../components/homePage/AddCommunityModal";
import Sidebar from "../components/homePage/SideBar";
import "../components/homePage/styles.css";

export default function HomePage() {
  const [communities, setCommunities] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);

  // Fetch all communities for the sidebar
  useEffect(() => {
    api.get("/communities")
      .then(({ data }) => setCommunities(data))
      .catch(console.error);
  }, []);

  // Fetch campaigns (all or by community)
  useEffect(() => {
    if (selectedCommunityId) {
      api.get(`/campaigns/campaigns/community/${selectedCommunityId}`)
        .then(({ data }) => setCampaigns(data))
        .catch(console.error);
    } else {
      api.get("/campaigns/campaigns/all")
        .then(({ data }) => setCampaigns(data.campaigns || data))
        .catch(console.error);
    }
  }, [selectedCommunityId]);

  const handleCreate = async (formData) => {
    const { data: newCommunity } = await api.post("/communities", formData);
    setCommunities((prev) => [...prev, newCommunity]);
    setShowModal(false);
  };

  return (
    <div className="app-shell">
      <Sidebar
        onSelectCommunity={setSelectedCommunityId}
        selectedCommunityId={selectedCommunityId}
      />
      <main className="main-area">
        <header className="page-header">
          <h1 className="heading">
            {selectedCommunityId
              ? communities.find((c) => c.id === selectedCommunityId)?.name || "Community"
              : "Crowdfunding Communities"}
          </h1>
          <button className="primary" onClick={() => setShowModal(true)}>
            ➕ Add Community
          </button>
        </header>
        <section className="card-grid">
          {campaigns.length === 0 ? (
            <p className="center">No campaigns yet. {selectedCommunityId ? "Be the first to add one!" : ""}</p>
          ) : (
            campaigns.map((camp) => <CommunityCard key={camp.id || camp.id_campaign} {...camp} />)
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
