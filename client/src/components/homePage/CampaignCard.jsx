import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/currencyUtils";

export default function CampaignCard({
  title,
  description,
  objective,
  goalAmount,
  currentAmount,
  status,
  image,
  deadline,
}) {
  return (
    <article className="card">
      {image && <img src={image} alt={title} className="thumb" />}
      <h3>{title}</h3>

      <span className={`status ${status}`}>{status}</span>

      <p>{description}</p>
      <p><em>{objective}</em></p>

      <p>
        Raised&nbsp;<strong>{formatCurrency(currentAmount)}</strong> /{" "}
        <strong>{formatCurrency(goalAmount)}</strong>
      </p>

      <p className="small">
        Deadline: {new Date(deadline).toLocaleDateString()}
      </p>
    </article>
  );
}
