import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { BACKEND_API } from "../api";
import { useState, useEffect } from "react";

export default function AddBtn({ fetchData }) {
    const [open, setOpen] = React.useState(false);
    const [manager_assigned, setManager] = React.useState("");
    const [task_description, setTaskDescription] = React.useState("");
    const [client_assigned, setClient] = React.useState("");
    const [product, setProduct] = React.useState("");
    const [product_quantity, setProductQuantity] = React.useState("");
    const [priority, setPriority] = React.useState("");
    const [due_date, setDueDate] = React.useState("");
    const [staff_member_assigned, setStaffMember] = React.useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAdd = async () => {
        const task = {
            manager_assigned,
            task_description,
            client_assigned,
            product,
            product_quantity,
            priority,
            due_date,
            staff_member_assigned,
        };

        console.log("task: add request.... ");
        const response = await fetch(`${BACKEND_API}/manager/tasks/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        });

        if (response.ok) {
            console.log("task: adding new task");
            // Call fetchData after a successful task creation
            fetchData();
            setOpen(false);
        } else {
            console.log("task: did not add the task");
            const errorData = await response.json();
            console.error("Error adding task: ", errorData);
            alert("Error adding task: " + (errorData.message || "Unknown Error"));
        }
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Add task
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add task</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please add in the details of a new task below.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="manager_assigned"
                        label="Manager"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={manager_assigned}
                        onChange={(e) => setManager(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="task_description"
                        label="Task Description"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={task_description}
                        onChange={(e) => setTaskDescription(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="client_assigned"
                        label="Attach Client"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={client_assigned}
                        onChange={(e) => setClient(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="product"
                        label="Attach Product"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="product_quantity"
                        label="Qty"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={product_quantity}
                        onChange={(e) => setProductQuantity(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="priority"
                        label="Priority"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="due_date"
                        label="Due Date"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={due_date}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="staff_member_assigned"
                        label="Assign Staff"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={staff_member_assigned}
                        onChange={(e) => setStaffMember(e.target.value)}
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
