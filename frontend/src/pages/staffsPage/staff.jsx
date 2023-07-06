import React, { useState, useEffect, useCallback } from 'react';
import {Link} from 'react-router-dom'
import Navbar  from "../../components/navbars/Navbar";
import EnhancedTable from "../../components/staffComps/StaffTable";
import AddBtn from "../../components/productsComps/addProdBtn";
import EditBtn from "../../components/productsComps/editProdBtn";
import SellBtn from "../../components/productsComps/sellProdBtn";
import { BACKEND_API } from "../../api";
import { SearchBarStaff } from '../../components/staffComps/SearchBarStaff';
import "../../components/Searchbar.css"

const Staff = () => {
  const [staffs, setStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  

  const fetchData = useCallback(async () => {
      const response = await fetch(`${BACKEND_API}/auth/`, {method: "GET"});
      const data = await response.json();
      setStaff(data);
  }, []);

  const filterData = (query, staffs) => {
      if (!query) {
        return staffs;
      } else {
        return staffs.filter((d) => d['first_name'].toLowerCase().includes(query.toLowerCase()));
      }
  };

  useEffect(() => {
      fetchData();
  }, []);

  const dataFiltered = filterData(searchQuery, staffs);
  return (
      <>
          <Navbar/>
          <h1 className="header" style={{paddingLeft: '140px', marginTop: '50px', fontSize: '60px'}}>Staff Members</h1>
          
          <div className="container-search">
              <div className="tools">
                  <SearchBarStaff searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </div>{/*}
              <div className='edit-btn-product'>
                  <EditBtn fetchData={fetchData}> aaa</EditBtn>
              </div>
              <div className='add-btn-product'>
                  <AddBtn fetchData={fetchData}/>
              </div>
              <div className='sell-btn-product'>
                  <SellBtn fetchData={fetchData}/>
              </div>*/}
          </div>
          <div style={{ marginLeft:'140px', marginRight: '120px', marginTop: '80px'}}>
              {dataFiltered.length > 0 ? <EnhancedTable rows={dataFiltered} fetchData={fetchData}/> : <p>These is no staff members in your company</p>}
          </div>
      </>
  );
}
export default Staff