import "./DeleteModal.css";

const DeleteModal = ({ isOpen, nodeName, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>Delete "{nodeName}"?</h4>
        <p>This action cannot be undone and will delete all nested items.</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>Keep Folder</button>
          <button className="confirm-btn delete" onClick={onConfirm}>Delete Everything</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;