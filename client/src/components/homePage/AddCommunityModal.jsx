import { useRef, useEffect } from "react";

export default function AddCommunityModal({ onClose, onSubmit }) {
  const formRef = useRef();

  useEffect(() => {
    formRef.current?.querySelector("input")?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(formRef.current));
    onSubmit(formData);               // { name, description, image, category }
  };

  return (
    <dialog open className="modal">
      <form ref={formRef} onSubmit={handleSubmit} className="modal-body">
        <h2>New Community</h2>

        <label>
          Name
          <input name="name" required />
        </label>

        <label>
          Description
          <textarea name="description" required />
        </label>

        <label>
          Image URL
          <input name="image" type="url" required />
        </label>

        <label>
          Category
          <input name="category" required />
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
