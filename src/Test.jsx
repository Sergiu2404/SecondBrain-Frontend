import React from "react";

const Test = () => {
  const handleFileSelected = (e) => {
    let file = e.target.files[0];

    if (!file) return;

    console.log("File object:", file);
    console.log("Name:", file.name);
    console.log("Size (bytes):", file.size);
    console.log("Type (MIME):", file.type);
    console.log("Last modified:", new Date(file.lastModified));
    // console.log("FILE LOCAL PATH: ", file.webkitRelativePath)

    const reader = new FileReader();
    reader.onload = (event) => {
      console.log("📂 File content:", event.target.result);
    };

    reader.onerror = () => {
      console.error("error reading file");
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <label style={{ cursor: "pointer" }}>
        Select file
        <input
          type="file"
        //   webkitRelativePath
          style={{ display: "none" }}
          onChange={handleFileSelected}
        />
      </label>
    </div>
  );
};

export default Test;
