import React from 'react'
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import "../Searchbar.css"

export const SearchBar = ({setSearchQuery, setProducts}) => (
    <form>
      <TextField id="search-bar" className="search-bar"
        onInput={(e) => {
          setSearchQuery(e.target.value);
          setProducts([]);
        }}
        label="Enter product name"
        variant="outlined"
        placeholder="Search..."
        size="small"
      />
      <IconButton id="search-icon" className="search-icon" type="submit" aria-label="search">
        <SearchIcon style={{ fill: "blue" }} />
      </IconButton>
    </form>
  );