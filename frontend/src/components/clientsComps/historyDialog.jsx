
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
import { fontWeight, padding } from '@mui/system';
import * as FaIcons6 from "react-icons/fa6";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent, { timelineContentClasses } from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import { Typography } from '@mui/material';

export default function History({id, name, _email, c_date, joined_date}) {
  const [open, setOpen] = React.useState(false);
  const [client, setClient] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [lead_source, setLeadSource] = React.useState("");
  const [client_position, setClientPosition] = React.useState("");
  const [mobile_number, setMobileNumber] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [records, setRecords] = React.useState([])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getHistory = async () => {
    const new_client = {
      client,
      email,
      lead_source,
      client_position,
      mobile_number,
      address,
    };
  
    const response = await fetch(`${BACKEND_API}/clients/history/${id}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
    });
  
    if (response.ok) {
      setOpen(false);
      setRecords(await response.json())
    } else {
      const errorData = await response.json();
      console.error("Error adding client: ", errorData);
      alert("Error adding client: " + (errorData.message || "Unknown Error"));
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div>
      <Button size="medium" onClick={handleClickOpen}>
        <FaIcons6.FaAddressBook/><div className='span2'>See History</div >
        </Button>
      <Dialog open={open} onClose={handleClose} >
        <DialogTitle>
          <Typography fontWeight={400}>
            Interaction History
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          </DialogContentText>

          <Timeline >
            <TimelineItem>
              <TimelineOppositeContent color="textSecondary">
                {joined_date}
              </TimelineOppositeContent>
              <TimelineSeparator >
                <TimelineDot color='primary' >
                  <AddReactionOutlinedIcon/>

                </TimelineDot>
                <TimelineConnector color='secondary' position="center"/>
              </TimelineSeparator>
              <TimelineContent>{name} was registered.</TimelineContent>
            </TimelineItem>

            {records.map((records) => (
            <TimelineItem>
              <TimelineOppositeContent color="textSecondary">
                {records.completed_date}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color='primary' >
                  <ShoppingCartTwoToneIcon/>

                </TimelineDot>
                <TimelineConnector color='secondary' position='right'/>
              </TimelineSeparator>
              <TimelineContent>{name} Purchased x{records.qty} {records.product_name}.</TimelineContent>
            </TimelineItem>))}
          </Timeline>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}