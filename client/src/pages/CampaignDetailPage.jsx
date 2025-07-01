import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './campaignPage.module.css';
import { formatCurrency } from '../utils/currencyUtils';

const API_BASE = 'http://localhost:4000/campaigns';

const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [totalStats, setTotalStats] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    title: '',
    description: '',
    objective: '',
    goalAmount: '',
    image: '',
    deadline: '',
  });
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const isOwner = user && campaign && (user.id === campaign?.UserId);

  useEffect(() => {
    fetch(`${API_BASE}/campaigns/all`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.campaigns) {
          const found = data.campaigns.find(c => String(c.id) === String(id));
          setCampaign(found);
          if (found) {
            setUpdateForm({
              title: found.title || '',
              description: found.description || '',
              objective: found.objective || '',
              goalAmount: found.goalAmount || '',
              image: found.image || '',
              deadline: found.deadline ? found.deadline.slice(0, 10) : '',
            });
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch campaign');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (isOwner && campaign) {
      fetch(`http://localhost:4000/contributions/campaign/${campaign.id}/total`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (data && data.campaignId) {
            setStats(data);
          }
        })
        .catch(() => setStats(null));
    }
  }, [isOwner, campaign]);

  const handleContribute = () => {
    navigate(`/campaigns/${id}/contribute`);
  };

  const handleUpdateChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(null);
    try {
      const res = await fetch(`http://localhost:4000/campaigns/campaign/update/${campaign.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error updating campaign');
      setUpdateSuccess('Campaign updated!');
      setShowUpdate(false);
      setCampaign(data.campaign);
    } catch (err) {
      setUpdateError(err.message);
    }
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      const res = await fetch(`http://localhost:4000/campaigns/campaign/delete/${campaign.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error deleting campaign');
      navigate('/campaigns');
    } catch (err) {
      alert(err.message);
    }
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
            <span>Goal: <b>{formatCurrency(campaign.goalAmount)}</b></span>
            <span>Deadline: <b>{new Date(campaign.deadline).toLocaleDateString()}</b></span>
          </div>
          <div style={{ marginTop: 16 }}>
            <span>Status: <b>{campaign.status}</b></span>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div style={{ marginTop: 24, display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ background: '#0a2342', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setShowUpdate(true)}>Update</button>
              </div>
              {showUpdate && (
                <div className={styles.updateModal}>
                  <h3>Update Campaign</h3>
                  <form onSubmit={handleUpdateSubmit} className={styles.updateForm}>
                    <input name="title" placeholder="Title" value={updateForm.title} onChange={handleUpdateChange} required className={styles.updateInput} />
                    <textarea name="description" placeholder="Description" value={updateForm.description} onChange={handleUpdateChange} required className={styles.updateTextarea} />
                    <input name="objective" placeholder="Objective" value={updateForm.objective} onChange={handleUpdateChange} required className={styles.updateInput} />
                    <input name="goalAmount" type="number" placeholder="Goal Amount" value={updateForm.goalAmount} onChange={handleUpdateChange} required className={styles.updateInput} />
                    <input name="image" placeholder="Image URL" value={updateForm.image} onChange={handleUpdateChange} required className={styles.updateInput} />
                    <input name="deadline" type="date" placeholder="Deadline" value={updateForm.deadline} onChange={handleUpdateChange} required className={styles.updateInput} />
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <button type="submit" className={styles.updateButton}>Save</button>
                      <button type="button" className={styles.cancelButton} onClick={() => setShowUpdate(false)}>Cancel</button>
                    </div>
                    {updateError && <p style={{ color: 'red' }}>{updateError}</p>}
                    {updateSuccess && <p style={{ color: 'green' }}>{updateSuccess}</p>}
                  </form>
                </div>
              )}
              {/* Stats Section */}
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f5f7fa', borderRadius: 8, color: '#222', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <h3 style={{ margin: 0, marginBottom: '0.5rem', color: '#0a2342' }}>Campaign Stats</h3>
                {stats ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li><b>Title:</b> {stats.title}</li>
                    <li><b>Goal Amount:</b> {formatCurrency(stats.goalAmount)}</li>
                    <li><b>Current Amount:</b> {formatCurrency(stats.currentAmount)}</li>
                    <li><b>Total Raised:</b> {formatCurrency(stats.totalAmount)}</li>
                    <li><b>Contributors:</b> {stats.totalContributors}</li>
                    <li><b>Progress:</b> {stats.progress}%</li>
                    <li><b>Days Left:</b> {stats.daysLeft}</li>
                    <li><b>Deadline:</b> {new Date(stats.deadline).toLocaleDateString()}</li>
                    <li><b>Created At:</b> {new Date(stats.createdAt).toLocaleDateString()}</li>
                    <li><b>Updated At:</b> {new Date(stats.updatedAt).toLocaleDateString()}</li>
                  </ul>
                ) : (
                  <p style={{ margin: 0, color: '#555' }}><i>Loading stats...</i></p>
                )}
              </div>
            </div>
          )}

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
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.15)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', maxWidth: 400, width: '100%', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ marginTop: 0, color: '#d32f2f', textAlign: 'center' }}>Delete Campaign</h3>
            <p style={{ textAlign: 'center' }}>Are you sure you want to delete this campaign? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' }}>
              <button className={styles.deleteButton} onClick={handleDelete}>Yes, Delete</button>
              <button className={styles.cancelButton} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetailPage; 