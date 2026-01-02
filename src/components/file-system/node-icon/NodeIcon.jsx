import { FiChevronDown, FiChevronRight, FiFolder, FiFileText } from "react-icons/fi";
import "./NodeIcon.css";

export const NodeIcon = ({ isFolder, isOpen }) => {
  return (
    <>
      <span className="node-icon" style={{ display: "flex", marginRight: "8px" }}>
        {isFolder ? (isOpen ? <FiChevronDown /> : <FiChevronRight />) : <span style={{ width: "16px" }} />}
      </span>
      <span className="node-icon" style={{ display: "flex", marginRight: "8px" }}>
        {isFolder ? <FiFolder /> : <FiFileText />}
      </span>
    </>
  );
};