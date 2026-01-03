import { useState } from "react";
import { getRecursiveChildIds } from "../../data/services/file-system/FileSystemService";

export const useFileSystemActions = (files, setFiles) => {
  const [menuConfig, setMenuConfig] = useState({
    visible: false,
    x: 0,
    y: 0,
    nodeId: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    nodeId: null,
    nodeName: "",
  });
  const [createModal, setCreateModal] = useState({
    visible: false,
    parentId: null,
  });

  const handleRightClick = (e, nodeId) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuConfig({ visible: true, x: e.pageX, y: e.pageY, nodeId });
  };

  const handleFileSelected = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setFiles(prev => [
    ...prev,
    {
      id: Date.now(),
      isFolder: false,
      name: file.name,
      parent: menuConfig.nodeId,
      file,
      type: file.type,
      size: file.size
    }
  ]);

  e.target.value = ""; // reset input
};


  const confirmCreateFolder = (name) => {
    const newFolder = {
      id: Date.now(),
      isFolder: true,
      name,
      parent: createModal.parentId,
    };
    setFiles((prev) => [...prev, newFolder]);
    setCreateModal({ visible: false, parentId: null });
  };

  const confirmDelete = () => {
    const idToDelete = deleteModal.nodeId;
    const allRelatedIds = [
      idToDelete,
      ...getRecursiveChildIds(idToDelete, files),
    ];
    setFiles((prev) => prev.filter((file) => !allRelatedIds.includes(file.id)));
    setDeleteModal({ visible: false, nodeId: null, nodeName: "" });
  };

  return {
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
  };
};
