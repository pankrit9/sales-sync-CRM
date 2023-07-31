import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BACKEND_API } from "../../api";

export default function EditBtn({fetchData}) {
  // The following useStates are used to manage the local state of this component.
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [stock, setStock] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [_id, setId] = React.useState("");

  // Handles the open and close for the dialog for editing
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Handles editing client
  const handleEdit = async () => {
    const product = {
      _id,
      name,
      stock,
      price
    };
    
    // Send POST request to backend with product object in body
    const response = await fetch(`${BACKEND_API}/products/clients/${_id}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product),
    });
  
    if (response.ok) {
      // Call fetchData after a successful client creation
      fetchData();
      setOpen(false);
    } else {
      const errorData = await response.json();
      console.error("Error updating client: ", errorData);
      alert("Error updating client: " + (errorData.message || "Unknown Error"));
    }
  };
  
  // The return statement redners the component and contains a button to open the dialog
  // and the dialog itself with the form fields for editing a client
  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Edit Client
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please add in the new details for the client you want to update.
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