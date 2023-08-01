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
import AddIcon from "@mui/icons-material/Add";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import { useSelector } from 'react-redux';


export default function AddBtn({ fetchData, userId, setTask}) {
    const [open, setOpen] = React.useState(false);
    const [task_description, setTaskDescription] = React.useState("");
    const [client_assigned, setClient] = React.useState("");
    const [product, setProduct] = React.useState("");
    const [product_quantity, setProductQuantity] = React.useState("");
    const [priority, setPriority] = React.useState("");
    const [due_date, setDueDate] = React.useState("");
    const [staff_member_assigned, setStaffMemberAssigned] = React.useState("");
    const [complete, setStatus] = React.useState("Not Started");
    const [products, setProducts] = React.useState([]);
    const [staff_members, setStaffMembers] = React.useState([]);
    const [clients, setClients] = React.useState([]);

    const _id = useSelector((state) => state.user);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchStaffMembers();
    }, []);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchStaffMembers = async () => {
        try {
            console.log("fetchStaffMembers: fetching staff members.... ")
            const response = await fetch(`${BACKEND_API}/auth/${_id}`, {method: "GET"});
            const data = await response.json();
            setStaffMembers(data);
        } catch (error) {
            console.error("Error fetching staff members: ", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${BACKEND_API}/products/${_id}`, {method: "GET"});
            const data = await response.json();;
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products: ", error);
        }
    };
    const fetchClients = async () => {
        try {
            const response = await fetch(`${BACKEND_API}/clients/${_id}`, {method: "GET"});
            const data = await response.json();;
            setClients(data);
        } catch (error) {
            console.error("Error fetching clients: ", error);
        }
    };

    const handleAdd = async () => {
        const task = {
            task_description,
            client_assigned,
            product,
            product_quantity,
            priority,
            due_date,
            staff_member_assigned,
            complete,
        };

        console.log("addTask: add request.... ");
        const response = await fetch(`${BACKEND_API}/tasks/create/${_id}`, {
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
            setTask([]);
        } else {
            console.log("task: did not add the task");
            const errorData = await response.json();
            console.error("Error adding task: ", errorData);
            alert("Error adding task: " + (errorData.message || "Unknown Error"));
        }
    };

    return (
        <div>
            <Button 
                variant="contained" 
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
            >
                Add task
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add task</DialogTitle>
                <DialogContent 
                    style={{ margin: "10px 0" }}
                >
                    <DialogContentText>
                        Please add in the details of a new task below.
                    </DialogContentText>
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
                    <FormControl fullWidth style={{ margin: '10px 0' }}>
                        <InputLabel id="client_assigned">Choose Client</InputLabel>
                        <Select
                            labelId="client_assigned"
                            id="client_assigned"
                            value={client_assigned}
                            onChange={(e) => setClient(e.target.value)}
                            name="client_assigned"
                            autoWidth
                        >
                            {clients.map((client) => (
                                <MenuItem key={client._id} value={client.client}>
                                    {client.client}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth style={{ margin: '10px 0' }}>
                        <InputLabel id="complete">Priority</InputLabel>
                        <Select
                            labelId="priority"
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            name="priority"
                            autoWidth
                        >
                            <MenuItem value="High Priority">High Priority</MenuItem>
                            <MenuItem value="Low Priority">Low Priority</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="due_date"
                        label="Due Date"
                        type="date"
                        fullWidth
                        variant="standard"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={due_date}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl 
                                fullWidth
                                style={{ margin: '10px 0' }}
                            >
                                <InputLabel id="product">Product</InputLabel>
                                <Select
                                    labelId="product"
                                    id="product"
                                    value={product}
                                    onChange={(e) => setProduct(e.target.value)}
                                    autoWidth
                                >
                                    {products.map((productItem) => (
                                        <MenuItem key={productItem._id} value={productItem.name}>
                                            {productItem.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="product_quantity"
                                label="Qty"
                                type="number"
                                fullWidth
                                variant="standard"
                                value={product_quantity}
                                onChange={(e) => setProductQuantity(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <FormControl fullWidth>
                        <InputLabel id="staff_member_assigned">Assign Staff</InputLabel>
                        <Select
                            labelId="staff_member_assigned"
                            id="staff_member_assigned"
                            value={staff_member_assigned}
                            onChange={(e) => setStaffMemberAssigned(e.target.value)}
                            autoWidth
                        >
                            {staff_members.map((staffMember) => (
                                <MenuItem key={staffMember._id} value={staffMember.full_name}>
                                    {staffMember.first_name} {staffMember.last_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAdd}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
