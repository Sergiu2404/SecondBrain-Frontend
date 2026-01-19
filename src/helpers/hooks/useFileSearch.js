import { useState } from "react";

export const useFIleSearch = (treeData) => {
  const [searchPath, setSearchPath] = useState("");
  const [openPathIds, setOpenPathIds] = useState([]);
  const [foundNodeId, setFoundNodeId] = useState(null);

  const [searchTrigger, setSearchTrigger] = useState(0);

  const handleSearch = () => {
    const parts = searchPath.toLowerCase().split("/").filter(Boolean);
    if (parts.length < 2 || parts[0] !== "root") return;

    let currentNodes = treeData;
    const pathIds = [];
    let lastFoundNode = null;

    for (let i = 1; i < parts.length; i++) {
      const targetName = parts[i];
      const found = currentNodes.find(
        (node) => node.name.toLowerCase() === targetName
      );
      if (!found) return;
      pathIds.push(found.id);
      lastFoundNode = found;
      currentNodes = found.children || [];
    }

    if (lastFoundNode) {
      setFoundNodeId(lastFoundNode.id);
      setOpenPathIds([...pathIds]);
      setSearchTrigger((prev) => prev + 1);
    }
  };

  return {
    foundNodeId,
    openPathIds,
    searchTrigger,
    searchPath,
    setSearchPath,
    handleSearch,
  };
};
