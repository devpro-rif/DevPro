import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './campaignPage.module.css';

const API_BASE = 'http://localhost:4000/campaigns';

const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/campaigns/all`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.campaigns) {
          const found = data.campaigns.find(c => String(c.id) === String(id));
          setCampaign(found);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch campaign');
        setLoading(false);
      });
  }, [id]);

  const handleContribute = () => {
    navigate(`/campaigns/${id}/contribute`);
  };

  if (loading) return <div className={styles.container}><p>Loading...</p></div>;
  if (error || !campaign) return <div className={styles.container}><p className={styles.error}>{error || 'Campaign not found.'}</p></div>;

  return (
    <div className={styles.container}>
      <Link to="/campaigns" style={{ textDecoration: 'none', color: '#6366f1', fontWeight: 500 }}>&larr; Back to campaigns</Link>
      <div className={styles.campaignCard} style={{ margin: '32px auto', maxWidth: 600 }}>
        <div className={styles.campaignImageWrapper}>
          <img src={campaign.image} alt={campaign.title} className={styles.campaignImage} />
        </div>
        <div className={styles.campaignInfo}>
          <h2 className={styles.campaignTitle}>{campaign.title}</h2>
          <p className={styles.campaignDescription}>{campaign.description}</p>
          <div className={styles.campaignMeta}>
            <span>Objective: <b>{campaign.objective}</b></span>
            <span>Goal: <b>{campaign.goalAmount}</b></span>
            <span>Deadline: <b>{new Date(campaign.deadline).toLocaleDateString()}</b></span>
          </div>
          <div style={{ marginTop: 16 }}>
            <span>Status: <b>{campaign.status}</b></span>
          </div>
          
          {/* Contribution Button - Only show for active campaigns */}
          {campaign.status?.toLowerCase() === 'active' && (
            <div style={{ marginTop: 24 }}>
              <button 
                onClick={handleContribute}
                className={styles.contributeButton}
              >
                Contribute to Campaign
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage; 