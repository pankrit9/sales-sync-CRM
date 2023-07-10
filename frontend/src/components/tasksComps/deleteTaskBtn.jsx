import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { BACKEND_API } from "../../api";
import { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// if manager is Deleteting
    // can only Delete the following fields:
        // task_description
        // due_date
        // staff_member_assigned

// if staff is Deleteting
    // can only Delete the following fields:
        // task status
export default function DeleteBtn({ task_id }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpenDeleteBtn = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        const response = await fetch(`${BACKEND_API}/tasks/delete/${task_id}`, {method: 'DELETE'});

        if (response.ok) {
            setOpen(false);
        } else {
            const errorData = await response.json();
            console.error("Error Deleteing task: ", errorData);
            alert("Error Deleteing task: " + (errorData.message || "Unknown Error"));
        }
    };

    return (
        <div>
            {/* if role is manager, show delete button */}
            <IconButton onClick={handleClickOpenDeleteBtn} >
                <DeleteIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    )

}