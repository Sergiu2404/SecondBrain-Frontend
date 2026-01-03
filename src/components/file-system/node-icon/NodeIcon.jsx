import { FiChevronDown, FiChevronRight, FiFolder,
   FiFileText } from "react-icons/fi";
import {FaRegFilePdf, FaRegFileWord} from "react-icons/fa";
import "./NodeIcon.css";

const FILE_ICONS_EXTENSIONS = {
  pdf: <FaRegFilePdf/>,
  txt: <FiFileText/>,
  md: <FiFileText />,
  word: <FaRegFileWord/>
}

const DEFAULT_FILE_ICON = <FiFileText />;

export const NodeIcon = ({ node, isOpen }) => {

  const getFileExtension = (name = "") => {
    const parts = name.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : null;
  }

  if (node.isFolder) {
    return (
      <>
        <span className="node-icon">
          {isOpen ? <FiChevronDown /> : <FiChevronRight />}
        </span>
        <span className="node-icon">
          <FiFolder />
        </span>
      </>
    );
  }

  const extension = getFileExtension(node.name);
  const fileIcon = FILE_ICONS_EXTENSIONS[extension] ?? DEFAULT_FILE_ICON;

  return (
    <>
      <span className="node-icon spacer" />
      <span className="node-icon">
        {fileIcon}
      </span>
    </>
  );
};