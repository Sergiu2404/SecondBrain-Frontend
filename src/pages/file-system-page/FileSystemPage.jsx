import { useEffect, useMemo, useState } from "react";
import "./FileSystemPage.css";
import FileNode from "../../components/file-node/FileNode";

const firstLevelFiles = [
  { id: 1, isFolder: true, name: "folder1", parent: null },
  { id: 2, isFolder: true, name: "folder2", parent: null },
  { id: 3, isFolder: true, name: "folder3", parent: 1 },
  { id: 4, isFolder: true, name: "folder4", parent: 2 },
  { id: 5, isFolder: true, name: "folder5", parent: 2 },
  { id: 6, isFolder: true, name: "folder6", parent: 3 },
  { id: 7, isFolder: true, name: "folder7", parent: 3 },
];

const FileSystemPage = () => {
  const [files, setFiles] = useState(firstLevelFiles);
  const [searchPath, setSearchPath] = useState("");

  const [openPathIds, setOpenPathIds] = useState([]);
  const [foundNodeId, setFoundNodeId] = useState(null);

  const [searchTrigger, setSearchTrigger] = useState(0);

  // state of context menu
  const [menuConfig, setMenuConfig] = useState({
    visible: false,
    x: 0,
    y: 0,
    nodeId: null,
  });

  // close menu at any left click
  useEffect(() => {
    const closeMenu = () =>
      setMenuConfig((prev) => ({ ...prev, visible: false }));
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const treeData = useMemo(() => {
    const mapIdToFileNode = new Map();
    const rootLevelFileNodes = [];

    // create files tree for efficient search in O(1)
    files.forEach((file) => {
      mapIdToFileNode.set(file.id, { ...file, children: [] });
    });

    // bind children to each parent and find the roots
    files.forEach((file) => {
      const currentNode = mapIdToFileNode.get(file.id);

      if (file.parent === null) {
        rootLevelFileNodes.push(currentNode);
      } else {
        const parentOfNode = mapIdToFileNode.get(file.parent);
        if (parentOfNode) {
          parentOfNode.children.push(currentNode);
        }
      }
    });
    return rootLevelFileNodes;
  }, [files]); //recompute when file state changes

  const handleRightClick = (e, nodeId) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuConfig({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      nodeId: nodeId,
    });
  };

  const handleAddFolder = () => {
    const name = prompt("New folder name:");
    if (!name) return;
    const newFolder = {
      id: Date.now(),
      isFolder: true,
      name,
      parent: menuConfig.nodeId,
    };
    setFiles((prev) => [...prev, newFolder]);
  };

  const handleDelete = () => {
    const idToDelete = menuConfig.nodeId;
    // delete node and all children
    const getChildIds = (parentId, allFiles) => {
      const children = allFiles.filter((f) => f.parent === parentId);
      let ids = children.map((c) => c.id);
      children.forEach((c) => {
        ids = [...ids, ...getChildIds(c.id, allFiles)];
      });
      return ids;
    };

    const allRelatedIds = [idToDelete, ...getChildIds(idToDelete, files)];
    setFiles((prev) => prev.filter((file) => !allRelatedIds.includes(file.id)));
  };

  const handleSearch = (roots) => {
    const parts = searchPath.toLowerCase().split("/").filter(Boolean);

    let currentNodes = roots;
    const pathIds = [];
    let lastFoundNode = null;

    for (let i = 1; i < parts.length; i++) {
      const targetName = parts[i];
      const found = currentNodes.find((node) => node.name === targetName);
      if (!found) {
        // error
        return;
      }
      pathIds.push(found.id);
      lastFoundNode = found;
      currentNodes = found.children || [];
    }

    setFoundNodeId(lastFoundNode.id);
    setOpenPathIds([...pathIds]);
    setSearchTrigger((prev) => prev + 1); // incrementing every time search is successful
  };

  return (
    <div className="file-system-page">
      <h3>Your documents</h3>
      <div
        className="search-container"
        style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
      >
        <input
          className="search-path-input"
          value={searchPath}
          onChange={(e) => setSearchPath(e.target.value)}
          placeholder="root/folder1/folder3"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <div className="file-system-container">
        <ul className="root-list" style={{ padding: 0 }}>
          {treeData.map((node) => (
            <FileNode
              key={node.id}
              node={node}
              onRightClick={handleRightClick}
              {...{ openPathIds, foundNodeId, searchTrigger }}
            />
          ))}
        </ul>
      </div>

      {menuConfig.visible && (
        <div
          className="custom-context-menu"
          style={{ top: menuConfig.y, left: menuConfig.x }}
        >
          <div className="menu-item" onClick={handleAddFolder}>
            Add Folder
          </div>
          <div className="menu-item delete" onClick={handleDelete}>
            Delete
          </div>
        </div>
      )}
    </div>
  );
};

export default FileSystemPage;
