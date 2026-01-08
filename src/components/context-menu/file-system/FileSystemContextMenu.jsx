import "./FIleSystemContextMenu.css";

const FIleSystemContextMenu = ({
  config,
  onAddFolder,
  onAddFile,
  onDelete,
  isRootClick,
}) => {
  if (!config.visible) {
    return null;
  }

  return (
    <div
      className="custom-context-menu"
      style={{ top: config.y, left: config.x }}
    >
      <div className="menu-item" onClick={onAddFolder}>
        Add Folder
      </div>
      <div className="menu-item" onClick={onAddFile}>
        Add File
      </div>

      {!isRootClick && (
        <div className="menu-item delete" onClick={onDelete}>
          Delete
        </div>
      )}
    </div>
  );
};

export default FIleSystemContextMenu;
