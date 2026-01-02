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
    if (node.isFolder) {
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
        <NodeIcon isFolder={node.isFolder} isOpen={isOpen} />
        {/* <span className="node-icon" style={{ display: "flex", marginRight: "8px" }}>
          {node.isFolder ? (
            isOpen ? <FiChevronDown /> : <FiChevronRight />
          ) : (
            <span style={{ width: "16px" }} />
          )}
        </span>
        <span className="node-icon" style={{ display: "flex", marginRight: "8px" }}>
          {node.isFolder ? <FiFolder /> : <FiFileText />}
        </span> */}
        <span className="node-name">{node.name}</span>
      </div>

      <NodeChildren 
        node={node} 
        isOpen={isOpen} 
        onRightClick={onRightClick} 
        searchProps={{ openPathIds, foundNodeId, searchTrigger }} 
      />
        
      {/* {isOpen && node.children?.length >= 0 && (
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
      )} */}
    </li>
  );
};

export default FileNode;
