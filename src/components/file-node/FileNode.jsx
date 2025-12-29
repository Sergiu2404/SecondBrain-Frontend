import React, { useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiFolder,
  FiFileText,
} from "react-icons/fi";
import "./FileNode.css";

const FileNode = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenCloseChildren = (event) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <li className="file-node">
      <div onClick={handleOpenCloseChildren} className="file-node-label">
        <span className="node-icon">
          {node.isFolder ? (
            isOpen ? (
              <FiChevronDown />
            ) : (
              <FiChevronRight />
            )
          ) : (
            <span className="chevron-placeholder" />
          )}
        </span>

        <span className="node-icon">
          {node.isFolder ? <FiFolder /> : <FiFileText />}
        </span>

        <strong>{node.name}</strong>
      </div>

      {isOpen && node.children && node.children.length > 0 && (
        <ul style={{ marginLeft: "20px" }}>
          {node.children.map((child) => (
            <FileNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default FileNode;
