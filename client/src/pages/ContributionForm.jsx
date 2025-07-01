import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './campaignPage.module.css';
import { dollarsToCents, formatCurrency } from '../utils/currencyUtils';

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
      // Convert dollars to cents (integer) for the backend
      const amountInCents = dollarsToCents(formData.amount);
      
      const response = await fetch(`${API_BASE}/contributions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          campaignId: parseInt(id),
          amount: amountInCents
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
              <span>Goal: <b>{formatCurrency(campaign.goalAmount)}</b></span>
              <span>Current: <b>{formatCurrency(campaign.currentAmount || 0)}</b></span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="amount">Contribution Amount ($)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button type="button" style={{ padding: '0.3rem 0.8rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: 4, border: '1px solid #ccc', background: '#f3f4f6', cursor: 'pointer' }} onClick={() => setFormData(f => ({ ...f, amount: Math.max(0.01, parseFloat(f.amount || 0) - 1).toFixed(2) }))}>-</button>
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
                style={{ width: 120, textAlign: 'center' }}
              />
              <button type="button" style={{ padding: '0.3rem 0.8rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: 4, border: '1px solid #ccc', background: '#f3f4f6', cursor: 'pointer' }} onClick={() => setFormData(f => ({ ...f, amount: (parseFloat(f.amount || 0) + 1).toFixed(2) }))}>+</button>
              <span style={{ marginLeft: 8 }}>$</span>
            </div>
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