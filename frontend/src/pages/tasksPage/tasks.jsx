import React, { useState, useEffect, useCallback } from 'react';
import {Link} from 'react-router-dom'
import Navbar  from "../../components/navbars/Navbar";
import { SearchBar } from '../../components/SearchBar';
import AddTaskBtn from "../../components/tasksComps/addTaskBtn";
import EnhancedTable from "../../components/tasksComps/tasksTable";
import { BACKEND_API } from "../../api";
import { useSelector } from 'react-redux';

// import { SearchBar } from '../components/SearchBar'; // search tasks

 
const Tasks = () => {

    const [tasks, setTask] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    
    const state = useSelector(state => state);
    console.log(state);  // Print the entire state to the console

    const role = useSelector(state => state.role);     // fetch the curr role of user
    if (role) {
        console.log("Current role is: " + role);
    } else {
        console.log("Current role is: " + "undefined");
    }

    const _id = useSelector((state) => state.user);
    console.log("Current user id is: " + _id);

    // fetch tasks on the basis of current role and id of user
    const fetchData = useCallback(async () => {
        const response = await fetch(`${BACKEND_API}/tasks/${_id}`, {method: "GET"});
        const data = await response.json();
        setTask(data);
        console.log("tasks data from backend: ", data);
        console.log("tasks data in tasks list: ", tasks);
    }, []);
    
    const filterData = (query, tasks) => {
        if (!query) {
          return tasks;
        } else {
          return tasks.filter((d) => d['name'].toLowerCase().includes(query));
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const dataFiltered = filterData(searchQuery, tasks);

    return (
        <>
            <Navbar />
            <h1 className="header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', paddingLeft: '140px', marginTop: '50px', fontSize: '60px', alignItems: 'center' }}>
                <span>Tasks</span>
                <div className="add-btn-task" style={{ justifySelf: 'end', paddingRight: '140px' }}>
                    {
                        // only manager can add tasks
                        // role === 'manager' && <AddTaskBtn fetchData={fetchData} />
                        role === 'manager' && <AddTaskBtn fetchData={fetchData} userId = {_id}/>
                    }
                </div>
            </h1>

            <div className="task_container" style={{display: 'grid'}} >
                {/* <div className="tools">
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div> */}
            </div>
            <div style={{ marginLeft: '140px', marginRight: '120px', marginTop: '80px' }}>
                {dataFiltered.length > 0 ? <EnhancedTable rows={dataFiltered} fetchData={fetchData} /> : <p>Currently no tasks for you</p>}
            </div>
        </>
    )
}

export default Tasks