import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BACKEND_API } from "../../api";
import * as AiIcons from "react-icons/ai"
import EditIcon from '@mui/icons-material/Edit';
import { FaUserEdit } from "react-icons/fa";
import { LiaUserEditSolid } from "react-icons/lia";

export default function EditBtn({fetchData}) {
  // The following useStates are used to manage the local state of this component.
  const [open, setOpen] = React.useState(false);
  const [clientn, setClient] = React.useState("");
  const [client_position, setPosition] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mobile_number, setNumber] = React.useState("");
  const [address, setAddress] = React.useState("");

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
    const client = {
      _id,
    };
    if (clientn !== "") {
      client.client = clientn;
    }

    if (client_position !== "") {
      client.client_position = client_position;
    }
    if (email !== "") {
      client.email = email;
    }
    if (mobile_number !== "") {
      client.mobile_number = mobile_number;
    }
    if (address !== "") {
      client.address = address;
    }
    // Send POST request to backend with product object in body
    const response = await fetch(`${BACKEND_API}/clients/edit/${_id}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product),
      credentials: "include",
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
      <Button variant="contained" onClick={handleClickOpen} endIcon={<LiaUserEditSolid/>}>
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
            label="Client ID"
            type="text"
            fullWidth
            variant="standard"
            value={_id}
            onChange={(e) => setId(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="clientn"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={clientn}
            onChange={(e) => setClient(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="client_position"
            label="Client position"
            type="text"
            fullWidth
            variant="standard"
            value={client_position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email"
            type="text"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="mobile_number"
            label="Mobile Number"
            type="text"
            fullWidth
            variant="standard"
            value={mobile_number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Client Address"
            type="text"
            fullWidth
            variant="standard"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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