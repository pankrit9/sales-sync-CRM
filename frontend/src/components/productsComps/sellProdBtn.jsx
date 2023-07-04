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

export default function SellBtn({fetchData}) {
  const [open, setOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState("");
  const [_id, setId] = React.useState("");
  const [staff, setStaff] = React.useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = async () => {
    const product = {
      _id,
      quantity,
      staff
    };
  
    const response = await fetch(`${BACKEND_API}/products/sell/${_id}`, {
      method: "PUT",
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
      console.error("Error making sale: ", errorData);
      alert("Error making sale: " + (errorData.message || "Unknown Error"));
    }
  };
  
  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Make Sale
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Make Sale</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please add in a new sale.
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
            id="quantity"
            label="Quantity Sold"
            type="text"
            fullWidth
            variant="standard"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="staff"
            label="Sold by"
            type="text"
            fullWidth
            variant="standard"
            value={staff}
            onChange={(e) => setStaff(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEdit}>Sell</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}