import { useEffect, useMemo, useRef, useState } from "react";

import "./FileSystemPage.css";
import FileNode from "../../components/file-node/FileNode";
import {
  firstLevelFiles,
  buildTree,
} from "../../data/services/file-system/FileSystemService";
import FIleSystemContextMenu from "../../components/context-menu/file-system/FileSystemContextMenu";
import CreateFolderModal from "../../components/modals/folder-modals/create-folder/CreateFolderModal";
import DeleteModal from "../../components/modals/folder-modals/delete/DeleteModal";
import { useFIleSearch } from "../../helpers/hooks/useFileSearch";
import { useFileSystemActions } from "../../helpers/hooks/useFileSystemActions";
import SearchFileHeader from "../../components/search-files-header/SearchFileHeader";

const FileSystemPage = () => {
  const [files, setFiles] = useState(firstLevelFiles);

  const treeData = useMemo(() => {
    return buildTree(files);
  }, [files]); //recompute when files state changes

  const fileInputRef = useRef(null);

  const handleAddFile = () => {
    fileInputRef.current.click();
  };

  const {
    searchPath,
    setSearchPath,
    foundNodeId,
    openPathIds,
    searchTrigger,
    handleSearch,
  } = useFIleSearch(treeData);

  const {
    menuConfig,
    setMenuConfig,
    deleteModal,
    setDeleteModal,
    createModal,
    setCreateModal,
    handleRightClick,
    handleFileSelected,
    confirmCreateFolder,
    confirmDelete,
  } = useFileSystemActions(files, setFiles);

  // close menu at any left click
  useEffect(() => {
    const closeMenu = () =>
      setMenuConfig((prev) => ({ ...prev, visible: false }));
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [setMenuConfig]);

  return (
    <div className="file-system-page">
      <h3>Your documents</h3>
      <SearchFileHeader
        searchPath={searchPath}
        setSearchPath={setSearchPath}
        onSearch={handleSearch}
      />

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

      <FIleSystemContextMenu
        config={menuConfig}
        onAddFolder={() =>
          setCreateModal({ visible: true, parentId: menuConfig.nodeId })
        }
        onAddFile={handleAddFile}
        onDelete={() => {
          const target = files.find((f) => f.id === menuConfig.nodeId);
          setDeleteModal({
            visible: true,
            nodeId: target.id,
            nodeName: target.name,
          });
        }}
      />

      <CreateFolderModal
        isOpen={createModal.visible}
        onCancel={() => setCreateModal({ visible: false })}
        onConfirm={confirmCreateFolder}
      />

      <DeleteModal
        isOpen={deleteModal.visible}
        nodeName={deleteModal.nodeName}
        onCancel={() => setDeleteModal({ visible: false })}
        onConfirm={confirmDelete}
      />

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelected}
      />
    </div>
  );
};

export default FileSystemPage;
