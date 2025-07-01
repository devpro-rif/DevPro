import React, { useEffect, useState } from 'react';
import styles from './campaignPage.module.css';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currencyUtils';

const API_BASE = 'http://localhost:4000';

const ContributionPage = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setError('You must be logged in to view your contributions.');
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/contributions/user/${user.id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.contributions) {
          setContributions(data.contributions);
        } else {
          setError(data.message || 'No contributions found.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch contributions.');
        setLoading(false);
      });
  }, [user]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>My Contributions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : contributions.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888', margin: '2rem 0' }}>No contributions found.</p>
      ) : (
        <ul className={styles.campaignList}>
          {contributions.map((c, idx) => (
            <li key={c.id || idx} className={styles.campaignCard}>
              <Link to={c.Campaign ? `/campaigns/${c.Campaign.id}` : '#'} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                <div className={styles.campaignInfo}>
                  <strong className={styles.campaignTitle}>{c.Campaign?.title || 'Unknown Campaign'}</strong>
                  <p className={styles.campaignDescription}>{c.Campaign?.description}</p>
                  <div className={styles.campaignMeta}>
                    <span>Amount: <b>{formatCurrency(c.amount)}</b></span>
                    <span>Date: <b>{new Date(c.createdAt).toLocaleDateString()}</b></span>
                    <span>Status: <b>{c.Campaign?.status}</b></span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContributionPage; 