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
  // delete node confirmation modal
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    nodeId: null,
    nodeName: "",
  });

  // create folder modal state
  const [createModal, setCreateModal] = useState({
    visible: false,
    parentId: null,
  });
  const [newFolderName, setNewFolderName] = useState("");

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

  const openDeleteModal = () => {
    const targetNode = files.find((f) => f.id === menuConfig.nodeId);
    if (targetNode) {
      setDeleteModal({
        visible: true,
        nodeId: targetNode.id,
        nodeName: targetNode.name,
      });
    }
    setMenuConfig({ ...menuConfig, visible: false }); // Close context menu
  };

  const openCreateModal = () => {
    setCreateModal({ visible: true, parentId: menuConfig.nodeId });
    setNewFolderName("");
    setMenuConfig({ ...menuConfig, visible: false });
  };

  const confirmCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder = {
      id: Date.now(),
      isFolder: true,
      name: newFolderName,
      parent: createModal.parentId,
    };
    setFiles((prev) => [...prev, newFolder]);
    setCreateModal({ visible: false, parentId: null });
  };

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

  const confirmDelete = () => {
    const idToDelete = deleteModal.nodeId;

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

    // reset state of the modal
    setDeleteModal({ visible: false, nodeId: null, nodeName: "" });
  };

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
          <div className="menu-item" onClick={openCreateModal}>
            Add Folder
          </div>
          <div className="menu-item delete" onClick={openDeleteModal}>
            Delete
          </div>
        </div>
      )}

      {/* create folder modal */}
      {createModal.visible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>New Folder</h4>
            <input
              className="modal-input"
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              onKeyDown={(e) => e.key === "Enter" && confirmCreateFolder()}
            />
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setCreateModal({ visible: false })}
              >
                Cancel
              </button>
              <button
                className="confirm-btn create"
                onClick={confirmCreateFolder}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* delete confirmation modal */}
      {deleteModal.visible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Delete "{deleteModal.nodeName}"?</h4>
            <p>
              This action cannot be undone and will delete all nested items.
            </p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setDeleteModal({ visible: false })}
              >
                Keep Folder
              </button>
              <button className="confirm-btn delete" onClick={confirmDelete}>
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileSystemPage;
