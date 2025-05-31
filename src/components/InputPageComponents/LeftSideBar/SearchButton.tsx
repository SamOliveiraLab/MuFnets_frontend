import { useContext, useState } from "react";

import { HighlightNodeContext } from "../../../pages/HomePage";

const SearchButton = () => {
  const { setHighlightedNode, setHighlightTrigger }: any =
    useContext(HighlightNodeContext);

  const [searchId, setSearchId] = useState("");

  const handleSearch = () => {
    setHighlightedNode(searchId);
    setHighlightTrigger(true); 
    setSearchId("");
  };
  return (
    <div
      style={{
        marginBottom: "0.75rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2 style={{ fontWeight: "bold" }}> Search Node</h2>
      <input
        type="text"
        placeholder="Search Node ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        style={{
          marginBottom: "0.75rem",
          padding: "0.75rem 0.25rem",

          border: "0.125rem solid light grey",
          textAlign: "center",
          fontSize: "15px",
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          backgroundColor: "#2196F3",
          padding: "0.5rem 0.5rem",
          color: "white",
          outline: "none",
          border: "0.125rem solid #2196F3",
          borderRadius: 30,
          marginBottom: "0.75rem",
          cursor: 'pointer',
        }}
      >
        Search
      </button>
    </div>
  );
};
export default SearchButton;
