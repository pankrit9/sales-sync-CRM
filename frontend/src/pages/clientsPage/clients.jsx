import React, { useState, useEffect, useCallback } from 'react';
import {Link} from 'react-router-dom'
import Navbar  from "../../components/navbars/Navbar";
import EnhancedTable from "../../components/clientsComps/clientsTable";
import AddBtn from "../../components/clientsComps/addClientsBtn";
import EditBtn from "../../components/clientsComps/editClientsBtn";
import { BACKEND_API } from "../../api";
import { SearchbarClients } from '../../components/clientsComps/SearchBarClients';
import '../../components/Searchbar.css';
import { useSelector } from 'react-redux';
import { deepOrange, deepPurple, green, red, blue } from '@mui/material/colors';

import { Card, CardContent, stringAvatar, CardMedia,Avatar,  Tooltip, Typography, Grid, CardActions, Button} from '@mui/material';

function Clients() {
    
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const state = useSelector(state => state);
    

    const fetchData = useCallback(async () => {
        const response = await fetch(`${BACKEND_API}/clients/`, {method: "GET"});
        const data = await response.json();
        setClients(data);
    }, []);

    const filterData = (query, clients) => {
        if (!query) {
          return clients;
        } else {
          return clients.filter((d) => d['name'].toLowerCase().includes(query.toLowerCase()));
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
    }, [searchQuery]);

    const dataFiltered = filterData(searchQuery, clients);
    return (
        <>
            <Navbar/>
            <h1 className="header" style={{paddingLeft: '140px', marginTop: '50px', fontSize: '60px'}}>Clients</h1>
            
            <div className="container-search">
                <div className="tools">
                    <SearchbarClients searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>
                <div className='edit-btn-clients'>
                    <EditBtn fetchData={fetchData}/>
                </div>
                <div className='add-btn-clients'>
                    <AddBtn fetchData={fetchData}/>
                </div>
            </div>

            <div style={{ marginLeft:'160px', marginRight: '100px', marginTop: '100px'}}>
                <Grid container justify="space-around" gap={3} >
                    {clients.map((dataFiltered) => (
                        <Card sx={{ width: "15rem" }}>
                        <CardContent marginLeft="5rem">

                            <Tooltip title={dataFiltered.client} >
                                <Avatar  {...stringAvatar(dataFiltered.client)} sx={{ bgcolor: getRandomColor(), width:"3.5rem", height:"3.5rem"}}>
                          
                                </Avatar>
                            </Tooltip>
                            <Typography sx={{ fontSize: 21 }}  gutterBottom>
                            {dataFiltered.client} | {dataFiltered._id}
                            </Typography>
                            <Typography variant="h5" component="div" color="text.secondary">
                                {dataFiltered.email}
                            </Typography>
                            <Typography variant="h5" component="div" color="text.secondary">
                                {dataFiltered.mobile_number}
                            </Typography> 
                        </CardContent>
                        <CardActions>
                            <Button size="small">See Details</Button>
                        </CardActions>
                        </Card>
                    ))}
                </Grid>
            </div>

        </>
    );
}
export default Clients;