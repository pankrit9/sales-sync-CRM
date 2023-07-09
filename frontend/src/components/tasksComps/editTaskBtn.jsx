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
import EditIcon from '@mui/icons-material/Edit';

// if manager is editting
    // can only edit the following fields:
        // task_description
        // due_date
        // staff_member_assigned

// if staff is editting
    // can only edit the following fields:
        // task status
export default function EditBtn({ fetchData, task_id, initialData, staff_members }) {
    const [formData, setFormData] = useState(initialData);
    const [open, setOpen] = React.useState(false);

    // const [staff_members, setStaffMembers] = React.useState([]);

    const _id = useSelector((state) => state.user);
    const role = useSelector((state) => state.role);

    const handleClickOpenEditBtn = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Update formData when initialData changes
    useEffect(() => {
        setFormData(initialData);
    }, []);

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };


    // useEffect(() => {
    //     if (role === "manager") {
    //         console.log("calling ffetchstaffmembers edit")
    //         fetchStaffMembers();
    //     }
    // }, []);

    // const fetchStaffMembers = async () => {
    //     try {
    //         console.log("fetchStaffMembers edit: fetching staff members.... ")
    //         const response = await fetch(`${BACKEND_API}/auth`, {method: "GET"});
    //         const data = await response.json();
    //         setStaffMembers(data);
    //     } catch (error) {
    //         console.error("Error fetching staff members: ", error);
    //     }
    // };

    const handleEdit = async () => {
        console.log("editTask: edit requested... ", formData);
        const response = await fetch(`${BACKEND_API}/tasks/edit/${_id}/${task_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            // fetchData();
            setOpen(false);
        } else {
            const errorData = await response.json();
            console.error("Error editing task: ", errorData);
            alert("Error editing task: " + (errorData.message || "Unknown Error"));
        }
    };

    return (
        <div>
            <IconButton onClick={handleClickOpenEditBtn} >
                <EditIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent 
                    style={{ margin: "10px 0" }}
                >
                    <DialogContentText>
                        Please add in the details of the task you would like to edit.
                    </DialogContentText>
                    {role === "manager" && (
                        <>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="priority"
                                label="Priority"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={formData.priority}
                                onChange={handleInputChange}
                                name="priority"
                            />
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
                                value={formData.due_date}
                                onChange={handleInputChange}
                                name="due_date"
                            />
                            <FormControl fullWidth>
                                <InputLabel id="staff_member_assigned">Assign Staff</InputLabel>
                                <Select
                                    labelId="staff_member_assigned"
                                    id="staff_member_assigned"
                                    value={formData.staff_member_assigned}
                                    onChange={handleInputChange}
                                    name="staff_member_assigned"
                                    autoWidth
                                >
                                    {staff_members.map((staffMember) => (
                                        <MenuItem key={staffMember._id} value={staffMember.first_name}>
                                            {staffMember.first_name} {staffMember.last_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    )}
                    {role === "staff" && (
                        <>
                            <FormControl fullWidth>
                                <InputLabel id="complete">Task Status</InputLabel>
                                <Select
                                    labelId="complete"
                                    id="complete"
                                    value={formData.complete}
                                    onChange={handleInputChange}
                                    name="complete"
                                    autoWidth
                                >
                                    <MenuItem value="Not Started">Not Started</MenuItem>
                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleEdit}>Edit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )

}