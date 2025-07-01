import { useRef, useEffect } from "react";

export default function AddCampaignModal({ onClose, onSubmit }) {
  const formRef = useRef();

  useEffect(() => {
    formRef.current?.querySelector("input")?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(formRef.current));
    onSubmit(formData);               // { title, description, objective, goalAmount, image, deadline }
  };

  return (
    <dialog open className="modal">
      <form ref={formRef} onSubmit={handleSubmit} className="modal-body">
        <h2>New Campaign</h2>

        <label>
          Title
          <input name="title" required />
        </label>

        <label>
          Description
          <textarea name="description" required />
        </label>

        <label>
          Objective
          <textarea name="objective" required />
        </label>

        <label>
          Goal amount (USD)
          <input name="goalAmount" type="number" min="1" required />
        </label>

        <label>
          Image URL
          <input name="image" type="url" required />
        </label>

        <label>
          Deadline
          <input name="deadline" type="date" required />
        </label>

        <div className="modal-actions">
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="primary">Create</button>
        </div>
      </form>
    </dialog>
  );
}
