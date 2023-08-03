import React, { useState, useEffect, useCallback } from 'react';
import Navbar  from "../../components/navbars/Navbar";
import EnhancedTable from "../../components/staffComps/StaffTable";
import AddBtn from "../../components/productsComps/addProdBtn";
import EditBtn from "../../components/productsComps/editProdBtn";
import SellBtn from "../../components/productsComps/sellProdBtn";
import Chatbot from "../../components/chatbot/Chatbot";
import { BACKEND_API } from "../../api";
import { SearchBarStaff } from '../../components/staffComps/SearchBarStaff';
import "../../components/Searchbar.css"
import "../../components/staffComps/staff.css"

import { useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import * as FaIcons6 from "react-icons/fa6";
import * as FaIcons from "react-icons/fa";
import { LuMail } from "react-icons/lu";
import { AiOutlineMail } from "react-icons/ai";

import { Card, CardContent, CardMedia,Avatar,  Tooltip, Typography, Grid, CardActions, Button} from '@mui/material';
import { deepOrange, deepPurple, green, red, blue } from '@mui/material/colors';

function Staff () {
    const [staff, setStaff] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const _id = useSelector((state) => state.user);

    const fetchData = useCallback(async () => {
        const response = await fetch(`${BACKEND_API}/auth/${_id}`, {method: "GET"});
        const data = await response.json();
        setStaff(data);
    }, []);

    const filterData = (query, staff) => {
        if (!query) {
            return staff;
        } else {
            return staff.filter((d) => d['full_name'].toLowerCase().includes(query.toLowerCase()));
        }
    };
    const colors = [deepOrange[500], deepOrange[300], deepPurple[500], deepPurple[300], green[500], green[300], red[500], red[300], blue[500], blue[300]];
    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

        function stringAvatar(name) {
            return {
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
            };
        }
    useEffect(() => {
        fetchData();
    }, []);

    const dataFiltered = filterData(searchQuery, staff);
    return (
      <>
          <Navbar/>
          <Chatbot/>
          <h1 className="header" style={{paddingLeft: '140px', marginTop: '50px', fontSize: '60px'}}>Your team</h1>
          <div className="container-search">
              <div className="tools-staff">
                  <SearchBarStaff searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </div>
          </div>
          {/*<div style={{ marginLeft:'140px', marginRight: '120px', marginTop: '80px'}}>
              {dataFiltered.length > 0 ? <EnhancedTable rows={dataFiltered} fetchData={fetchData}/> : <p>These is no staff members in your company</p>}
            </div>*/}
            <div style={{ marginLeft:'160px', marginRight: '100px', marginTop: '80px'}}>
                <Grid container justify="space-around" gap={3} >
                    {!dataFiltered || dataFiltered.length === 0 ? (
                    <div>You do not have any staff members yet</div>
                    ) : (
                    dataFiltered.map((dataFiltered) => (
                        <Card sx={{ width: "20rem" }}>
                        <CardContent marginLeft="5rem">

                            <Tooltip title={dataFiltered.full_name} >
                                <Avatar alt="" {...stringAvatar(dataFiltered.full_name)} sx={{ bgcolor: getRandomColor(), width:"3.5rem", height:"3.5rem"}}>
                          
                                </Avatar>
                            </Tooltip>
                            <Typography sx={{ fontSize: 21 }}  gutterBottom>
                            {dataFiltered.full_name} | {dataFiltered._id}
                            </Typography>
                            <Typography variant="h5" component="div" color="text.secondary" >
                                <AiOutlineMail /> {dataFiltered.email}
                            </Typography>
                            <Typography variant="h5" component="div" color="text.primary">
                                <FaIcons6.FaUserTie/> Role: {dataFiltered.role}
                            </Typography> 
                            <Typography variant="h5" component="div" color="text.primary">
                                <FaIcons.FaTasks/> Tasks assigned: {dataFiltered.tasks_n}
                            </Typography> 
                            <Typography variant="h5" component="div" color="text.primary">
                                <FaIcons6.FaMoneyBill1Wave/> Revenue produced: ${dataFiltered.revenue}
                            </Typography> 
                        </CardContent>
                        <CardActions>
                            
                            {/*<History id={dataFiltered._id} name={dataFiltered.client} joined_date={dataFiltered.creation_date}/>*/}
                        </CardActions>
                        </Card>
                    )
                    ))}
                </Grid>
            </div>
      </>
  );
}
export default Staff