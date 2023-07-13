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

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
                <div style={{ marginLeft:'140px', marginRight: '120px', marginTop: '80px'}}>
                {dataFiltered.length > 0 ? <EnhancedTable rows={dataFiltered} fetchData={fetchData}/> : <p>The Client list is empty</p>}
            </div>
        </>
    );
}
export default Clients;