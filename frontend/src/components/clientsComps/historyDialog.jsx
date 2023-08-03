
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BACKEND_API } from "../../api";
import { useEffect } from "react";
import * as FaIcons6 from "react-icons/fa6";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import { Typography } from '@mui/material';

// This is a functional component 'History'. It receives props id, name, _email, c_date, joined_date.
export default function History({id, name, joined_date}) {

  // The following useStates are used to manage the local state of this component.
  const [open, setOpen] = React.useState(false);
  const [records, setRecords] = React.useState([]);

  // Sets the open and close state for the dialog for viewing history.
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Sends a request to the server to get the history of a client
  const getHistory = async () => {
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

  // The return statement renders the component 
  // It contains a button to open the dialog, and the dialog itself with a timeline for the client's interaction history
  return (
    <div>
      <Button size="medium" onClick={handleClickOpen} startIcon={<FaIcons6.FaAddressBook/>}>
        See History
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
            {/* For each record in records, we create a timeline item that displays the completed date, 
            and a statement saying that the client purchased a certain quantity of a certain product. */}
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