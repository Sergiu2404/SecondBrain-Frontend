import { useState } from "react";
import "./CreateFolderModal.css";

const CreateFolderModal = ({ isOpen, onCancel, onConfirm }) => {
  const [folderName, setFolderName] = useState("");

  const handleConfirm = () => {
    if (!folderName) return;
    onConfirm(folderName);
    setFolderName("");
  }

  const handleCancel = () => {
    setFolderName("");
    onCancel();
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>New Folder</h4>
        <input
          className="modal-input"
          autoFocus
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Folder name"
          onKeyDown={(e) => e.key === "Enter" && onConfirm(folderName)}
        />
        <div className="modal-actions">
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          <button className="confirm-btn create" onClick={handleConfirm}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;