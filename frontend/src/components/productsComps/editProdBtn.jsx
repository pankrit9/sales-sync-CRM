import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BACKEND_API } from "../../api";
import { useState, useEffect } from "react";

export default function EditBtn({fetchData}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [stock, setStock] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [_id, setId] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = async () => {
    const product = {
      _id,
      name,
      stock,
      price
    };
  
    const response = await fetch(`${BACKEND_API}/products/edit/${_id}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product),
    });
  
    if (response.ok) {
      // Call fetchData after a successful product creation
      fetchData();
      setOpen(false);
    } else {
      const errorData = await response.json();
      console.error("Error updating product: ", errorData);
      alert("Error updating product: " + (errorData.message || "Unknown Error"));
    }
  };
  
  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Edit Product
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please add in the new details for the product you want to update.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="_id"
            label="Product ID"
            type="text"
            fullWidth
            variant="standard"
            value={_id}
            onChange={(e) => setId(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="stock"
            label="Stock"
            type="text"
            fullWidth
            variant="standard"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="price"
            label="Price"
            type="text"
            fullWidth
            variant="standard"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEdit}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}