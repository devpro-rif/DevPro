import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import CampaignCard from "../components/homePage/CampaignCard";
import AddCampaignModal from "../components/homePage/AddCampaignModal";

export default function CommunityDetailPage() {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // load community meta
  useEffect(() => {
    api.get(`/communities/${id}`)              // GET -> router.get('/:id')
       .then(({ data }) => setCommunity(data))
       .catch(console.error);
  }, [id]);

  // load campaigns in that community
  useEffect(() => {
    api.get(`/campaigns/campaigns/community/${id}`)
       .then(({ data }) => setCampaigns(data))
       .catch(console.error);
  }, [id]);

  const handleCreate = async (formData) => {
    const { data: newCampaign } = await api.post("/campaign/create", {
      ...formData,
      id_community: id,        // back‑end expects this field
    });
    setCampaigns((prev) => [...prev, newCampaign]);
    setShowModal(false);
  };

  if (!community) return <p className="center">Loading...</p>;

  return (
    <main className="wrapper">
      <header className="page-header">
        <h1>{community.name}</h1>
        <button className="primary" onClick={() => setShowModal(true)}>
          ➕ Add Campaign
        </button>
      </header>

      {campaigns.length ? (
        <section className="card-grid">
          {campaigns.map((camp) => (
            <CampaignCard key={camp.id_campaign} {...camp} />
          ))}
        </section>
      ) : (
        <p className="center">No campaigns yet.</p>
      )}

      {showModal && (
        <AddCampaignModal onClose={() => setShowModal(false)} onSubmit={handleCreate} />
      )}
    </main>
  );
}
