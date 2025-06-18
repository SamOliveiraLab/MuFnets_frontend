import { useContext, useState } from "react";
import { Typography, TextField, Button } from "@mui/material";

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
        flex: 1,
        display: "flex",
        flexDirection: "column",
        width: "80%",
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        Search Node
      </Typography>

      <TextField
        variant="outlined"
        placeholder="Search Node ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Button
        onClick={handleSearch}
        variant="contained"
        color="secondary"
        type="submit"
        fullWidth
        style={{ borderRadius: 30, marginTop: 10, marginBottom: 10 }}
      >
        Search
      </Button>
    </div>
  );
};
export default SearchButton;
