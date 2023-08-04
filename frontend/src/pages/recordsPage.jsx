import { useState, useEffect, useCallback} from "react";
import Navbar  from "../components/navbars/Navbar";
import Chatbot from "../components/chatbot/Chatbot";
import RecordsTable from '../components/recordsTable/records';
import { BACKEND_API } from "../api";
import "../components/Searchbar.css"
import { useSelector } from "react-redux";
import DownloadBtn from "../components/recordsTable/DownloadBtn";
import { SearchBarRecords } from "../components/recordsTable/SearchBarRecords";
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
      const response = await fetch(`${BACKEND_API}/records/${_id}`, {method: "GET"});
      const data = await response.json();
      setRecords(data);
  }, []);
  
  const filterData = (query, records) => {
      if (!query) {
        return records;
      } else {
        return records.filter((d) => d['client_id'].toLowerCase().includes(query.toLowerCase()));
      }
  };
  
  useEffect(() => {
      fetchData();
  }, [records.length]);

  const dataFiltered = filterData(searchQuery, records);

  return (
      <>
          <Navbar />
          <Chatbot />
          <h1 className="header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', paddingLeft: '140px', marginTop: '50px', fontSize: '60px', alignItems: 'center' }}>
              <span>Sales History</span>
          </h1>
            <div className="download-btn" style={{ justifySelf: 'end', paddingRight: '120px' }}>
                  { // only manager can add tasks
                    (role === 'manager') && <DownloadBtn fetchData={fetchData} userId = {_id}/>
                    }
                </div>*
          <div className="task_container" style={{display: 'grid'}} >
               <div className="tools" style={{ paddingRight: '0px' }}>
                  <SearchBarRecords searchQuery={searchQuery} setSearchQuery={setSearchQuery} setRecords={setRecords}/>
              </div> 
          </div>
          <div style={{ marginLeft: '140px', marginRight: '120px', marginTop: '80px' }}>
              {dataFiltered.length > 0 ? <RecordsTable rows={dataFiltered} fetchData={fetchData} /> : <p>No records found.</p>}
          </div>
      </>
  )
}
export default Records;