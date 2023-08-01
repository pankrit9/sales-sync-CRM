import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { BACKEND_API } from "../../api";
import * as BsIcons from "react-icons/bs";
import { Typography } from "@mui/material";

export default function DownloadBtn({ fetchData, userId }) {
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

    const handeDwn = async () => {
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
        const response = await fetch(`${BACKEND_API}/records/download`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
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
    
    // The return statement renders the component
    return (
        <div>
            <Button 
                variant="contained" 
                color="primary"
                startIcon={<BsIcons.BsCloudDownload />}
                onClick={handeDwn}
                
            >
                <Typography>Download Report</Typography>
            </Button>
            <Dialog   >
                <DialogTitle>Download PDF version</DialogTitle>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button >Download</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
