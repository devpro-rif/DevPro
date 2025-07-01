import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './campaignPage.module.css';

const API_BASE = 'http://localhost:4000';

const ContributionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    amount: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Fetch campaign details
    fetch(`${API_BASE}/campaigns/campaigns/all`, { credentials: 'include' })
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

          try {
        const response = await fetch(`${API_BASE}/contributions/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
                  body: JSON.stringify({
          campaignId: parseInt(id),
          amount: parseFloat(formData.amount)
        }),
        });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit contribution');
      }

      setSuccess('Contribution submitted successfully!');
      setTimeout(() => {
        navigate(`/campaigns/${id}`);
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className={styles.container}><p>Loading...</p></div>;
  if (error && !campaign) return <div className={styles.container}><p className={styles.error}>{error}</p></div>;
  if (!campaign) return <div className={styles.container}><p className={styles.error}>Campaign not found.</p></div>;

  return (
    <div className={styles.container}>
      <Link to={`/campaigns/${id}`} style={{ textDecoration: 'none', color: '#6366f1', fontWeight: 500 }}>
        &larr; Back to campaign
      </Link>
      
      <div style={{ margin: '32px auto', maxWidth: 500 }}>
        <h2 className={styles.subheading}>Contribute to Campaign</h2>
        
        <div className={styles.campaignCard} style={{ marginBottom: 24 }}>
          <div className={styles.campaignInfo}>
            <h3 className={styles.campaignTitle}>{campaign.title}</h3>
            <p className={styles.campaignDescription}>{campaign.description}</p>
            <div className={styles.campaignMeta}>
              <span>Goal: <b>${campaign.goalAmount}</b></span>
              <span>Current: <b>${campaign.currentAmount || 0}</b></span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="amount">Contribution Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              required
              className={styles.input}
            />
          </div>
          

          
          <button type="submit" className={styles.contributeButton}>
            Submit Contribution
          </button>
          
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default ContributionForm; 