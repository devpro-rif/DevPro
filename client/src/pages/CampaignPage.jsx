import React, { useEffect, useState } from 'react';
import styles from './campaignPage.module.css';

const API_BASE = 'http://localhost:4000/campaigns'; // Updated to match correct API base

const CampaignPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    objective: '',
    goalAmount: '',
    image: '',
    deadline: '',
    communityIds: '', // comma separated for now
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Fetch campaigns
  useEffect(() => {
    fetch(`${API_BASE}/campaigns/all`)
      .then(res => res.json())
      .then(data => {
        if (data.campaigns) setCampaigns(data.campaigns);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch campaigns');
        setLoading(false);
      });
  }, []);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    // Prepare data
    const payload = {
      ...form,
      goalAmount: Number(form.goalAmount),
      communityIds: form.communityIds
        ? form.communityIds.split(',').map(id => id.trim())
        : [],
    };
    try {
      const res = await fetch(`${API_BASE}/campaign/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer ...' // Add if needed
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error creating campaign');
      setFormSuccess('Campaign created!');
      setCampaigns(prev => [...prev, data.campaign]);
      setForm({
        title: '',
        description: '',
        objective: '',
        goalAmount: '',
        image: '',
        deadline: '',
        communityIds: '',
      });
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Campaigns</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <ul className={styles.campaignList}>
          {campaigns.map(c => (
            <li key={c.id} className={styles.campaignCard}>
              <div className={styles.campaignImageWrapper}>
                <img src={c.image} alt={c.title} className={styles.campaignImage} />
              </div>
              <div className={styles.campaignInfo}>
                <strong className={styles.campaignTitle}>{c.title}</strong>
                <p className={styles.campaignDescription}>{c.description}</p>
                <div className={styles.campaignMeta}>
                  <span>Goal: <b>{c.goalAmount}</b></span>
                  <span>Deadline: <b>{new Date(c.deadline).toLocaleDateString()}</b></span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <h2 className={styles.subheading}>Create Campaign</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required className={styles.input} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className={styles.textarea} />
        <input name="objective" placeholder="Objective" value={form.objective} onChange={handleChange} required className={styles.input} />
        <input name="goalAmount" type="number" placeholder="Goal Amount" value={form.goalAmount} onChange={handleChange} required className={styles.input} />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required className={styles.input} />
        <input name="deadline" type="date" placeholder="Deadline" value={form.deadline} onChange={handleChange} required className={styles.input} />
        <input name="communityIds" placeholder="Community IDs (comma separated)" value={form.communityIds} onChange={handleChange} className={styles.input} />
        <button type="submit" className={styles.button}>Create</button>
        {formError && <p className={styles.error}>{formError}</p>}
        {formSuccess && <p className={styles.success}>{formSuccess}</p>}
      </form>
    </div>
  );
};

export default CampaignPage;
