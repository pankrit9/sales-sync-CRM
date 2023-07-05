import { useState, useEffect, useCallback} from "react";

import {Link} from 'react-router-dom'
import Navbar  from "../../components/navbars/Navbar";
import RecordsTable from '../../components/recordsTable/records';
import { BACKEND_API } from "../../api";
import { SearchBarStaff } from '../../components/staffComps/SearchBarStaff';
import "../../components/Searchbar.css"
import { useSelector } from "react-redux";
import DownloadBtn from "../../components/recordsTable/DownloadBtn";

const Records = () => {

  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] =  useState("");
  
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
      const response = await fetch(`${BACKEND_API}/records`, {method: "GET"});
      const data = await response.json();
      setRecords(data);
  }, []);
  
  const filterData = (query, records) => {
      if (!query) {
        return records;
      } else {
        return records.filter((d) => d['_id'].toLowerCase().includes(query));
      }
  };
  
  useEffect(() => {
      fetchData();
  }, [fetchData]);

  const dataFiltered = filterData(searchQuery, records);

  return (
      <>
          <Navbar />
          <h1 className="header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', paddingLeft: '140px', marginTop: '50px', fontSize: '60px', alignItems: 'center' }}>
              <span>Sales History</span>
              <div className="add-btn-task" style={{ justifySelf: 'end', paddingRight: '140px' }}>
                  {
                      // only manager can add tasks
                      (role === 'manager'|| role === 'accountant') && <DownloadBtn fetchData={fetchData} userId = {_id}/>}
              </div>
          </h1>

          <div className="task_container" style={{display: 'grid'}} >
              {/* <div className="tools">
                  <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </div> */}
          </div>
          <div style={{ marginLeft: '140px', marginRight: '120px', marginTop: '80px' }}>
              {dataFiltered.length > 0 ? <RecordsTable rows={dataFiltered} fetchData={fetchData} /> : <p>No records found.</p>}
          </div>
      </>
  )
}


export default Records;