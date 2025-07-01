import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './campaignPage.module.css';

const API_BASE = 'http://localhost:4000/campaigns'; // Updated to match correct API base

const CampaignPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
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
  const [showMyCampaigns, setShowMyCampaigns] = useState(false);
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }, []);
  const createFormRef = useRef(null);

  // Fetch campaigns
  useEffect(() => {
    fetch(`${API_BASE}/campaigns/all`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.campaigns) {
          setCampaigns(data.campaigns);
          setFilteredCampaigns(data.campaigns);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch campaigns');
        setLoading(false);
      });
  }, []);

  // Filter campaigns based on search term, status, and ownership
  useEffect(() => {
    let filtered = campaigns;

    // Filter by ownership if 'My Campaigns' is active
    if (showMyCampaigns && user) {
      filtered = filtered.filter(campaign => campaign.UserId === user.id);
    }

    // Filter by status first
    if (statusFilter !== 'all') {
      filtered = filtered.filter(campaign => 
        campaign.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Then filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(campaign =>
        campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.objective?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCampaigns(filtered);
  }, [searchTerm, statusFilter, campaigns, showMyCampaigns]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

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
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error creating campaign');
      setFormSuccess('Campaign created!');
      const newCampaigns = [...campaigns, data.campaign];
      setCampaigns(newCampaigns);
      setFilteredCampaigns(newCampaigns);
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
      <button
        style={{ marginBottom: '1rem', padding: '0.4rem 1.2rem', background: '#0a2342', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        onClick={() => setShowMyCampaigns(v => !v)}
      >
        {showMyCampaigns ? 'Show All Campaigns' : 'My Campaigns'}
      </button>
      {showMyCampaigns && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button
            style={{ padding: '0.4rem 1.2rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => {
              if (createFormRef.current) {
                createFormRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Create Campaign
          </button>
        </div>
      )}
      
      {/* Search and Filter Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search campaigns by title, description, or objective..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterContainer}>
          <select 
            value={statusFilter} 
            onChange={handleStatusFilterChange}
            className={styles.statusFilter}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {(searchTerm || statusFilter !== 'active') && (
          <span className={styles.searchResults}>
            {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : filteredCampaigns.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888', margin: '2rem 0' }}>No campaigns can be found.</p>
      ) : (
        <ul className={styles.campaignList}>
          {filteredCampaigns.map(c => (
            <li key={c.id} className={styles.campaignCard}>
              <Link to={`/campaigns/${c.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
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
                  <div className={styles.campaignStatus}>
                    <span className={`${styles.statusBadge} ${styles[`status-${c.status?.toLowerCase()}`]}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      
      {showMyCampaigns && (
        <>
          <h2 className={styles.subheading} ref={createFormRef}>Create Campaign</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required className={styles.input} />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className={styles.textarea} />
            <input name="objective" placeholder="Objective" value={form.objective} onChange={handleChange} required className={styles.input} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button type="button" style={{ padding: '0.3rem 0.8rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: 4, border: '1px solid #ccc', background: '#f3f4f6', cursor: 'pointer' }} onClick={() => setForm(f => ({ ...f, goalAmount: Math.max(1, Number(f.goalAmount) - 1) }))}>-</button>
              <input name="goalAmount" type="number" placeholder="Goal Amount" value={form.goalAmount} onChange={handleChange} required className={styles.input} min={1} style={{ width: 120, textAlign: 'center' }} />
              <button type="button" style={{ padding: '0.3rem 0.8rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: 4, border: '1px solid #ccc', background: '#f3f4f6', cursor: 'pointer' }} onClick={() => setForm(f => ({ ...f, goalAmount: Number(f.goalAmount) + 1 }))}>+</button>
              <span style={{ marginLeft: 8 }}>$</span>
            </div>
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required className={styles.input} />
            <input name="deadline" type="date" placeholder="Deadline" value={form.deadline} onChange={handleChange} required className={styles.input} />
            <input name="communityIds" placeholder="Community IDs (comma separated)" value={form.communityIds} onChange={handleChange} className={styles.input} />
            <button type="submit" className={styles.button}>Create</button>
            {formError && <p className={styles.error}>{formError}</p>}
            {formSuccess && <p className={styles.success}>{formSuccess}</p>}
          </form>
        </>
      )}
    </div>
  );
};

export default CampaignPage;
