import React, { useState } from "react";
import { NodeIcon } from "../file-system/node-icon/NodeIcon";
import { NodeChildren } from "../file-system/node-children/NodeChildren";

const FileNode = ({
  node,
  openPathIds,
  foundNodeId,
  searchTrigger,
  onRightClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prevTrigger, setPrevTrigger] = useState(searchTrigger);

  // if searchTrigger changes, it means the user clicked Search
  if (searchTrigger !== prevTrigger) {
    setPrevTrigger(searchTrigger);

    // if current node in the path, force it to open
    if (openPathIds?.includes(node.id)) {
      setIsOpen(true);
    }
  }

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (node.type === "folder") {
      setIsOpen(!isOpen);
    }
  };

  const isHighlighted = node.id === foundNodeId;

  return (
    <li className="file-node" style={{ listStyleType: "none" }}>
      <div
        className={`file-node-label ${isHighlighted ? "found-node-highlight" : ""}`}
        onClick={handleToggle}
        onContextMenu={(e) => onRightClick(e, node.id)}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          padding: "4px",
        }}
      >
        <NodeIcon node={node} type={node.type} isOpen={isOpen} />
        <span className="node-name">{node.name}</span>
      </div>

      <NodeChildren 
        node={node} 
        isOpen={isOpen} 
        onRightClick={onRightClick} 
        searchProps={{ openPathIds, foundNodeId, searchTrigger }} 
      />
    </li>
  );
};

export default FileNode;
