import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNode, deleteNode } from "../../state/filesystem/filesystemSlice";

export const useFileSystemActions = () => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.fileSystem.nodes);

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
    isFolder: false
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

    const isDuplicate = files.some(
      (node) =>
        node.name.toLowerCase() === file.name.toLowerCase() &&
        node.parent_id === menuConfig.nodeId
    );
    if (isDuplicate) {
      alert(`A file or folder named "${file.name}" already exists in this location.`);
      e.target.value = "";
      return;
    }

    dispatch(createNode({
      name: file.name,
      type: "file",
      parent_id: menuConfig.nodeId,
      fileObj: file
    }));

    e.target.value = ""; // reset input
  };

  const confirmCreateFolder = (name) => {
    const isDuplicate = files.some(
      (file) =>
        file.name.toLowerCase() === name.toLowerCase() &&
        file.parent_id === createModal.parentId
    );
    if (isDuplicate) {
      alert(
        `A folder or file with the name "${name}" already exists in this location.`
      );
      return;
    }

    dispatch(createNode({
      name,
      type: "folder",
      parent_id: createModal.parentId
    }))

    setCreateModal({ visible: false, parentId: null });
  };

  const confirmDelete = () => {
    const idToDelete = deleteModal.nodeId;

    if (idToDelete) {
      dispatch(deleteNode(idToDelete));
    }

    setDeleteModal({ visible: false, nodeId: null, nodeName: "", isFolder: false });
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
