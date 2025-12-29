import { useMemo, useState } from "react";
import "./FileSystemPage.css";
import FileNode from "../../components/file-node/FileNode";

const firstLevelFiles = [
  {
    id: 1,
    isFolder: true,
    name: "folder1",
    parent: null,
  },
  {
    id: 2,
    isFolder: true,
    name: "folder2",
    parent: null,
  },
  {
    id: 3,
    isFolder: true,
    name: "folder3",
    parent: 1,
  },
  {
    id: 4,
    isFolder: true,
    name: "folder4",
    parent: 2,
  },
  {
    id: 5,
    isFolder: true,
    name: "folder5",
    parent: 2,
  },
  {
    id: 6,
    isFolder: true,
    name: "folder6",
    parent: 3,
  },
  {
    id: 7,
    isFolder: true,
    name: "folder7",
    parent: 3,
  },
];

const FileSystemPage = () => {
  const [searchPath, setSearchPath] = useState("");
  const [foundNode, setFoundNode] = useState(null);

  const treeData = useMemo(() => {
    const mapIdToFileNode = new Map();
    const rootLevelFileNodes = [];

    // create files tree for efficient search in O(1)
    firstLevelFiles.forEach((file) => {
      mapIdToFileNode.set(file.id, { ...file, children: [] });
    });

    // bind children to each parent and find the roots
    firstLevelFiles.forEach((file) => {
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
  }, []);

  const handleSearch = (roots) => {
    const parts = searchPath.trim().split("/").filter(Boolean); // remove falsy vals

    if (parts[0] !== "root") {
      setFoundNode(null);
      return;
    }

    let currentNodes = roots;
    let currentNode = null;

    for (let i = 1; i < parts.length; i++) {
      currentNode = currentNodes.find((node) => node.name === parts[i]);

      if (!currentNode) {
        setFoundNode(null);
        return;
      }

      // search in the child nodes of current node to
      currentNodes = currentNode.children || [];
    }

    setFoundNode(currentNode);
  };

  return (
    <div className="file-system-page">
      <h3>Your documents</h3>

      <input
        type="text"
        placeholder="Search by the path (ex: root/folderAtLevel1/folderAtLevel2)"
        value={searchPath}
        onChange={(event) => setSearchPath(event.target.value)}
        className="search-path-input"
      />
      <button onClick={() => handleSearch(treeData)} className="search-button">
        Search
      </button>

      <div className="file-system-container">
        <ul className="root-list">
          {treeData.map((node) => {
            return <FileNode node={node} />;
          })}
        </ul>
      </div>

      {foundNode === null && searchPath && (
        <p className="search-error">Path not found</p>
      )}

      {foundNode && <p className="search-success">Found: {foundNode.name}</p>}
    </div>
  );
};

export default FileSystemPage;
