export const firstLevelFiles = [
];

const BASE_URL = "http://localhost:8000/api/file-system";

export const buildTree = (files) => {
  if (!files || !Array.isArray(files)) return [];

  const mapIdToFileNode = new Map();
  const rootLevelFileNodes = [];

  files.forEach((file) => {
    if (file && file.id) {
      mapIdToFileNode.set(file.id, { ...file, children: [] });
    }
  });

  files.forEach((file) => {
    if (!file || !file.id) return;

    const currentNode = mapIdToFileNode.get(file.id);
    if (!file.parent_id) { 
      rootLevelFileNodes.push(currentNode);
    } else {
      const parentNode = mapIdToFileNode.get(file.parent_id);
      if (parentNode) {
        parentNode.children.push(currentNode);
      } else {
        rootLevelFileNodes.push(currentNode);
      }
    }
  });
  return rootLevelFileNodes;
};

export const getRecursiveChildIds = (parentId, allFiles) => {
  const children = allFiles.filter((f) => f.parent_id === parentId);
  let ids = children.map((c) => c.id);
  children.forEach((c) => {
    ids = [...ids, ...getRecursiveChildIds(c.id, allFiles)];
  });
  return ids;
};

export const fetchNodesAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}`);
    
    if (!response.ok) {
      console.warn(`Nodes not found or server error: ${response.status}`);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Backend is unreachable:", error);
    return [];
  }
};

export const createNodeAPI = async (nodeData) => {
  try {
    let response;
    console.log(nodeData);

    // check if uploading physical file or creating folder
    if (nodeData.fileObj) {
      const formData = new FormData();
      formData.append("name", nodeData.name);
      formData.append("type", "file");
      if (nodeData.parent) formData.append("parent_id", nodeData.parent);
      formData.append("file", nodeData.fileObj);

      response = await fetch(`${BASE_URL}/files`, {
        method: "POST",
        body: formData
      });
    } else {
      response = await fetch(`${BASE_URL}/folders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nodeData.name,
          type: "folder",
          parent_id: nodeData.parent,
        }),
      });
    }

    if (!response.ok) {
      console.warn(`Failed to create node: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating node:", error);
    throw error;
  }
};

export const deleteNodeAPI = async (nodeId) => {
  try {
    const response = await fetch(`${BASE_URL}/${nodeId}`, {
      method: "DELETE"
    });

    if (response.status === 204 || response.ok) {
      return nodeId; // so reducer knows which to remove
    }
    return null;
  } catch (error) {
    console.error("Error deleting node:", error);
    throw error;
  }
};
