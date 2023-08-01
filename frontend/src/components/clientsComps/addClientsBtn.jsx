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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { fontWeight } from '@mui/system';

export default function AddBtn({fetchData, handleClickSnack, setOpenSnackError}) {
  const [open, setOpen] = React.useState(false);

  const [client, setClient] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [lead_source, setLeadSource] = React.useState("");
  const [client_position, setClientPosition] = React.useState("");
  const [mobile_number, setMobileNumber] = React.useState("");
  const [address, setAddress] = React.useState("");


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleAdd = async () => {
    const new_client = {
      client,
      email,
      lead_source,
      client_position,
      mobile_number,
      address,
    };
  
    const response = await fetch(`${BACKEND_API}/clients/add`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(new_client),
    });
  
    if (response.ok) {
      // Call fetchData after a successful product creation
      fetchData();
      setOpen(false);
      handleClickSnack();
    } else {
      const errorData = await response.json();
      console.error("Error adding client: ", errorData);
      //alert("Error adding client: " + (errorData.message || "Unknown Error"));
      setOpenSnackError(true);
    }
  };
  
  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Add Client
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please add in the details of a new client below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="client"
            label="Client Name"
            type="text"
            fullWidth
            variant="standard"
            value={client}
            onChange={(e) => setClient(e.target.value)}
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
          <div style={{marginTop: '30px'}}></div>
          <FormControl fullWidth>
            <InputLabel id="complete">Lead Source</InputLabel>
            <Select
              labelId="Lead Source"
              id="lead_source"
              value={lead_source}
              onChange={(e) => setLeadSource(e.target.value)}
              name="lead_source"
              autoWidth
            >
              <MenuItem value="Google">Google</MenuItem>
              <MenuItem value="LinkedIn">LinkedIn</MenuItem>
              <MenuItem value="Cold Call/Email">Cold Call/Email</MenuItem>
              <MenuItem value="Referral">Referral</MenuItem>
              <MenuItem value="Paid Social Ads">Paid Social Ads</MenuItem>
              <MenuItem value=""></MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            id="client_position"
            label="Client Position"
            type="text"
            fullWidth
            variant="standard"
            value={client_position}
            onChange={(e) => setClientPosition(e.target.value)}
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
          onChange={(e) => setMobileNumber(e.target.value)}
          />
          <TextField
          autoFocus
          margin="dense"
          id="address"
          label="Address"
          type="text"
          fullWidth
          variant="standard"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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