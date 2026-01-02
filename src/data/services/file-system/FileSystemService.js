export const firstLevelFiles = [
  { id: 1, isFolder: true, name: "folder1", parent: null },
  { id: 2, isFolder: true, name: "folder2", parent: null },
  { id: 3, isFolder: true, name: "folder3", parent: 1 },
  { id: 4, isFolder: true, name: "folder4", parent: 2 },
  { id: 5, isFolder: true, name: "folder5", parent: 2 },
  { id: 6, isFolder: true, name: "folder6", parent: 3 },
  { id: 7, isFolder: true, name: "folder7", parent: 3 },
];

export const buildTree = (files) => {
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
};

export const getRecursiveChildIds = (parentId, allFiles) => {
  const children = allFiles.filter((f) => f.parent === parentId);
  let ids = children.map((c) => c.id);
  children.forEach((c) => {
    ids = [...ids, ...getRecursiveChildIds(c.id, allFiles)];
  });
  return ids;
};