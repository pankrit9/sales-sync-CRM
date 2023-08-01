import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BACKEND_API } from "../../api";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

export default function EditBtn({fetchData}) {
  // The following useStates are used to manage the local state of this component.
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [stock, setStock] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [_id, setId] = React.useState("");
  const [productIds, setProductIds] = useState([]);
  const id = useSelector((state) => state.user);


  useEffect(() => {
    const getProductIds = async () => {
      const response = await fetch(`${BACKEND_API}/products/${id}`); 
      const products = await response.json();
      setProductIds(products.map(product => product._id));
    };
    getProductIds();
  }, []);

  // Handles the open and close for the dialog for editing
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Handles editing button
  const handleEdit = async () => {
    const product = {
      _id,
    };
    if (name !== "") {
      product.name = name;
    }
    if (stock !== "") {
      product.stock = stock;
    }
    if (price !== "") {
      product.price = price;
    }
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
  
  // The return statement renders the component
  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Edit Product
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please add in the new details for the product you want to update.
          </DialogContentText>
          <div style={{marginTop: '30px'}}></div>
          <FormControl fullWidth>
            <InputLabel id="_id">Product ID</InputLabel>
            <Select
              labelId="_id"
              id="_id"
              autoFocus
              value={_id}
              label="Product ID"
              onChange={(e) => setId(e.target.value)}
            >
              {productIds.map((id) => (
                <MenuItem value={id} key={id}>{id}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New Name"
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
            label="New Stock"
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
            label="New Price"
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