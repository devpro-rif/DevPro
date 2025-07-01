import React from "react";
import CampaignCard from "./CampaignCard";
import "./styles.css/campaign.css";

const CampaignList = ({ campaigns }) => (
  <div className="campaign-list">
    {campaigns.length === 0 ? (
      <p className="placeholder small">No campaigns for this community.</p>
    ) : (
      campaigns.map((campaign) => <CampaignCard key={campaign.id_campaign} campaign={campaign} />)
    )}
  </div>
);

export default CampaignList;