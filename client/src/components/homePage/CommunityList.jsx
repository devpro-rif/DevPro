import React from "react";
import CommunityCard from "./CommunityCard";
import "./styles.css/community.css";

const CommunityList = ({ communities }) => (
  <section className="community-grid">
    {communities.length === 0 ? (
      <p className="placeholder">No communities yet.</p>
    ) : (
      communities.map((community) => <CommunityCard key={community.id} community={community} />)
    )}
  </section>
);

export default CommunityList;

