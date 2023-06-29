import React, { useState, useEffect, useCallback } from 'react';
import {Link} from 'react-router-dom'
import Navbar  from "../components/Navbar";
import { SearchBar } from '../components/SearchBar';
import CreateTaskBtn from "../components/addTaskBtn";
import EnhancedTable from "../components/tasksTable";
import { BACKEND_API } from "../api";
// import { SearchBar } from '../components/SearchBar'; // search tasks

 
const Tasks = () => {

    const [tasks, setTask] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    
    const fetchData = useCallback(async () => {
        const response = await fetch(`${BACKEND_API}/manager/tasks`, {method: "GET"});
        const data = await response.json();
        setTask(data);
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
    }, [fetchData]);

    const dataFiltered = filterData(searchQuery, tasks);

    return (
        <>
            <Navbar />
            <h1 className="header" style={{ paddingLeft: '140px', marginTop: '50px', fontSize: '60px' }}>Tasks</h1>

            <div className="task_container">
                {/* <div className="tools">
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div> */}
                <div className="add-btn-task" style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '140px' }}>
                    <CreateTaskBtn fetchData={fetchData} />
                </div>
            </div>
            <div style={{ marginLeft: '140px', marginRight: '120px', marginTop: '80px' }}>
                {dataFiltered.length > 0 ? <EnhancedTable rows={dataFiltered} fetchData={fetchData} /> : <p>Currently no tasks for you</p>}
            </div>
        </>
    )
}

export default Tasks