import FileNode from "../../file-node/FileNode";
import "./NodeChildren.css";

export const NodeChildren = ({ node, isOpen, onRightClick, searchProps }) => {
  if (!isOpen || !node.children) return null;

  return (
    <ul className="child-list" style={{ marginLeft: "20px", paddingLeft: "10px", listStyleType: "none" }}>
      {node.children.map((child) => (
        <FileNode 
          key={child.id} 
          node={child} 
          onRightClick={onRightClick} 
          {...searchProps} 
        />
      ))}
    </ul>
  );
};