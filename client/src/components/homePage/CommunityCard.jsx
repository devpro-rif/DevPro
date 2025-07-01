import { Link } from "react-router-dom";

export default function CommunityCard({
  id,
  name,
  description,
  image,
  category,
}) {
  return (
    <Link to={`/community/${id}`} className="card">
      {image && <img src={image} alt={name} className="thumb" />}
      <h2>{name}</h2>
      <p className="category">{category}</p>
      <p>{description}</p>
      <span className="link-hint">View campaigns →</span>
    </Link>
  );
}
