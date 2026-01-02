import "./SearchFileHeader.css";

const SearchFileHeader = ({ searchPath, setSearchPath, onSearch }) => {
  // allow enter submit searched path
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div
      className="search-container"
      style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
    >
      <input
        className="search-path-input"
        value={searchPath}
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearchPath(e.target.value)}
        placeholder="root/folder1/folder3"
      />
      <button onClick={onSearch} className="search-button">
        Search
      </button>
    </div>
  );
};

export default SearchFileHeader;
