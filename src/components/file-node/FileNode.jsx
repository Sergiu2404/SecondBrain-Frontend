import React, { useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiFolder,
  FiFileText,
} from "react-icons/fi";

const FileNode = ({
  node,
  openPathIds,
  foundNodeId,
  searchTrigger,
  onRightClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastTrigger, setLastTrigger] = useState(0);

  // if searchTrigger changes, it means the user clicked Search
  if (searchTrigger !== lastTrigger) {
    setLastTrigger(searchTrigger);

    // if current node in the path, force it to open
    if (openPathIds?.includes(node.id)) {
      setIsOpen(true);
    }
  }

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (node.isFolder) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <li className="file-node" style={{ listStyleType: "none" }}>
      <div
        className={`file-node-label ${node.id === foundNodeId ? "found-node-highlight" : ""}`}
        onClick={handleToggle}
        onContextMenu={(e) => onRightClick(e, node.id)}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          padding: "4px",
        }}
      >
        <span className="node-icon" style={{ display: "flex", marginRight: "8px" }}>
          {node.isFolder ? (
            isOpen ? <FiChevronDown /> : <FiChevronRight />
          ) : (
            <span style={{ width: "16px" }} />
          )}
        </span>
        <span className="node-icon" style={{ display: "flex", marginRight: "8px" }}>
          {node.isFolder ? <FiFolder /> : <FiFileText />}
        </span>
        <span className="node-name">{node.name}</span>
      </div>

      {isOpen && node.children?.length >= 0 && (
        <ul className="child-list" style={{ marginLeft: "20px", paddingLeft: "10px", listStyleType: "none" }}>
          {node.children.map((child) => (
            <FileNode 
              key={child.id} 
              node={child} 
              onRightClick={onRightClick} 
              {...{ openPathIds, foundNodeId, searchTrigger }} 
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default FileNode;
