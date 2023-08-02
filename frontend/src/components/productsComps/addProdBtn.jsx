import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BACKEND_API } from "../../api";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useSelector } from 'react-redux';
import AddIcon from "@mui/icons-material/Add";

export default function AddBtn({fetchData, setProducts}) {
  // The following useStates are used to manage the local state of this component.
  const _id = useSelector((state) => state.user);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [stock, setStock] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [is_electronic, setIsElectronic] = React.useState(false);

  // Handles opening and closing the dialog box
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Handles adding new product
  const handleAdd = async () => {
    const product = {
      name,
      stock,
      price,
      is_electronic,
    };
    
    // POST request to backend to add new product
    const response = await fetch(`${BACKEND_API}/products/add/${_id}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product),
    });
  
    if (response.ok) {
      // Call fetchData after a successful product creation
      fetchData();
      setProducts([])
      setOpen(false);
    } else {
      const errorData = await response.json();
      console.error("Error adding product: ", errorData);
      alert("Error adding product: " + (errorData.message || "Unknown Error"));
    }
  };
  
  // Render the Add Product button and the dialog box for adding product
  return (
    <div>
      {/* Button to open dialog box */}
      <Button variant="contained" onClick={handleClickOpen} endIcon={<AddIcon/>}>
        Add Product
      </Button>

      {/* Dialog box with form for adding product */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please add in the details of a new product below.
          </DialogContentText>

          {/* Form fields for client details */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Product Name"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <div style={{marginTop: '30px'}}></div>
          <FormControl fullWidth>
            <InputLabel id="is_electronic">Electronic Product?</InputLabel>
            <Select
              labelId="is_electronic"
              id="is_electronic"
              value={is_electronic}
              label="Electronic Product?"
              onChange={(e) => {setIsElectronic(e.target.value)
                if(e.target.value) {
                  setStock("0")
                }}
              }
            >
              <MenuItem value={true}>True</MenuItem>
              <MenuItem value={false}>False</MenuItem>
            </Select>
          </FormControl>
          
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
            disabled={is_electronic}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}