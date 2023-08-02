import React, { useState, useEffect, useCallback } from 'react';
import {Link} from 'react-router-dom'
import Navbar  from "../../components/navbars/Navbar";
import PieChart from "../../components/salesComps/pieChart";
import BarChart from "../../components/salesComps/barChart";
import StreamCloseChart from "../../components/salesComps/streamCloseChart";
import StreamProjChart from "../../components/salesComps/streamProjChart";
import { Box, Button, IconButton, Typography} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckIcon from "@mui/icons-material/Check";
import StatBox from "../../components/salesComps/statBox"
import { BACKEND_API } from "../../api";
import { useSelector } from 'react-redux';

function Sales() {
  //should taskData be linked to a get data call?

  const state = useSelector(state => state);
  const role = useSelector(state => state.role);
  const _id = useSelector((state) => state.user);
  const [taskData, setTaskData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [LTVData, setLTVData] = useState([]);
  const [winRateData, setWinRateData] = useState([]);
  const [leadSourceData, setLeadSourceData] = useState([]);
  const [revClosedData, setRevClosedData] = useState([]);
  const [closedKeys, setClosedKeysData] = useState([]);
  const [revClosedSumData, setRevClosedSumData] = useState([]);
  const [revProjectedData, setRevProjectedData] = useState([]);
  const [projectedKeys, setProjectedKeysData] = useState([]);
  const [revProjectedSumData, setRevProjectedSumData] = useState([]);
  const [taskGrowthData, setTaskGrowthData] = useState([]);
  const [ltvGrowthData, setltvGrowthData] = useState([]);
  const [clientGrowthData, setClientGrowthData] = useState([]);
  const [winRateGrowthData, setWinRateGrowthData] = useState([]);

  const fetchTaskData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/tasks/${_id}`, {method: "GET"});
    const data = await response.json();
    setTaskData(data);
  }

  const fetchClientData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/clients/${_id}`, {method: "GET"});
    const data = await response.json();
    setClientData(data);
  }

  const fetchProductData = async () => {
    const response = await fetch(`${BACKEND_API}/products/piechart`, {method: "GET"});
    const data = await response.json();
    setProductData(data);
  }

  const fetchLTVData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/ltv/${_id}`, {method: "GET"});
    const data = await response.json();
    setLTVData(data);
  }

  const fetchWinRateData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/winrate/${_id}`, {method: "GET"});
    const data = await response.json();
    setWinRateData(data);
  }

  const fetchLeadSourceData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/leadsource`, {method: "GET"});
    const data = await response.json();
    setLeadSourceData(data);
  }

  const fetchClosedKeysData = async () => {
      const response = await fetch(`${BACKEND_API}/sales/closedkeys`, {method: "GET"});
      const data = await response.json();
      setClosedKeysData(data);
  }

  const fetchRevClosedData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/closedrev`, {method: "GET"});
    const data = await response.json();
    setRevClosedData(data);
  } 
  const fetchRevClosedSumData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/closedrevsum`, {method: "GET"});
    const data = await response.json();
    setRevClosedSumData(data);
  } 

  const fetchRevProjectedData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/projrev`, {method: "GET"});
    const data = await response.json();
    setRevProjectedData(data);
  } 

  const fetchProjectedKeysData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/projkeys`, {method: "GET"});
    const data = await response.json();
    setProjectedKeysData(data);
  } 

  const fetchRevProjectedSumData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/projrevsum`, {method: "GET"});
    const data = await response.json();
    setRevProjectedSumData(data);
  } 

  const fetchTaskGrowthData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/taskgrowth`, {method: "GET"});
    const data = await response.json();
    setTaskGrowthData(data);
  } 

  const fetchltvGrowthData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/ltvgrowth`, {method: "GET"});
    const data = await response.json();
    setltvGrowthData(data);
  } 

  const fetchClientGrowthData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/clientgrowth`, {method: "GET"});
    const data = await response.json();
    setClientGrowthData(data);
  } 

  const fetchWinRateGrowthData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/winrategrowth`, {method: "GET"});
    const data = await response.json();
    setWinRateGrowthData(data);
  } 

  useEffect(() => {
    fetchTaskData();
    fetchClientData();
    fetchProductData();
    fetchLTVData();
    fetchWinRateData();
    fetchLeadSourceData();
    fetchClosedKeysData();
    fetchRevClosedData();
    fetchRevClosedSumData();
    fetchRevProjectedData();
    fetchProjectedKeysData();
    fetchRevProjectedSumData();
    fetchTaskGrowthData();
    fetchltvGrowthData();
    fetchClientGrowthData();
    fetchWinRateGrowthData();
  }, []);

  return (
    <>
    <Navbar/>
    <h1 className="header" style={{paddingLeft: '160px', marginTop: '50px', fontSize: '60px'}}>Dashboard</h1>
    { role === "staff"
      ? <h1 className="header" style={{paddingLeft: '170px', marginTop: '50px', fontSize: '30px'}}>My Metrics</h1>
      : <h1 className="header" style={{paddingLeft: '170px', marginTop: '50px', fontSize: '30px'}}>My Team Metrics</h1>
    }
    <Box m="10px" style={{ marginLeft: '140px'}}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="30px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
          
        >
          <StatBox
            title={taskData}
            subtitle="Tasks"
            increase={`${taskGrowthData * 100 > 0 ? 
              `+${(taskGrowthData * 100).toFixed(0)}` 
              : (taskGrowthData * 100).toFixed(0)}%`}
            icon={
              <EmailIcon
                sx={{ fontSize: "26px" }}
              />
            }
          />
        
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
          
        >
          <StatBox
            title={`$${LTVData.toLocaleString()}`}
            subtitle="Client LTV"
            increase={`${ltvGrowthData * 100 > 0 ? 
              `+${(ltvGrowthData * 100).toFixed(0)}` 
              : (ltvGrowthData * 100).toFixed(0)}%`}
            icon={
              <PointOfSaleIcon
                sx={{ fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
          
        >
          <StatBox
            title={clientData}
            subtitle="Clients"
            increase={`${clientGrowthData * 100 > 0 ? 
              `+${(clientGrowthData * 100).toFixed(0)}` 
              : (clientGrowthData * 100).toFixed(0)}%`}
            icon={
              <PersonAddIcon
                sx={{ fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
          
        >
          <StatBox
            title={`${(winRateData * 100).toFixed(0)}%`}
            subtitle="Win Rate"
            increase={`${winRateGrowthData * 100 > 0 ? 
              `+${(winRateGrowthData * 100).toFixed(0)}` 
              : (winRateGrowthData * 100).toFixed(0)}%`}
            icon={
              <CheckIcon
                sx={{ fontSize: "26px" }}
              />
            }
          />
        </Box>
        </Box> {/* This closing tag for grid box */}
        { role === "staff" &&
          <h1 classname="header" style={{paddingLeft: '33px', marginTop: '10px', marginBottom: '20px', fontSize: '30px'}}>Team Metrics</h1>
        }
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="30px"
        >
        {/* ROW 2 */}
        <Box
          gridColumn="span 7"
          gridRow="span 3"
        >
          <Box
            mt="15px"
            p="0 30px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
              >
                Revenue Closed this Year
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
              >
                {`$${revClosedSumData.toLocaleString()}`}
              </Typography>
            </Box>
          </Box>
          <Box height="400px" m="-20px 0 0 0">
            <StreamCloseChart data={revClosedData} closedKeys={closedKeys} />
          </Box>
        </Box>
        <Box
          gridColumn="span 5"
          gridRow="span 3"
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p="15px"
          >
            <Typography variant="h5" fontWeight="600">
              Product Breakdown
            </Typography>
          </Box>
          <Box height="400px" mt="-20px">
            <PieChart data={productData}/>
          </Box>
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 7"
          gridRow="span 3"
        >
          <Box
            mt="-30px"
            p="0 30px"
            display="flex "
            justifyContent="center"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
              >
                Revenue Projected this Year
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
              >
                {`$${revProjectedSumData.toLocaleString()}`}
              </Typography>
            </Box>
          </Box>
          <Box height="400px" m="-20px 0 0 0">
          <StreamProjChart data={revProjectedData} projectedKeys={projectedKeys}/>
          </Box>
        </Box>
        <Box
          gridColumn="span 5"
          gridRow="span 3"
          overflow="auto"
          mt="-50px"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p="15px"
          >
            <Typography variant="h5" fontWeight="600">
              Lead source
            </Typography>
          </Box>
          <Box height="400px">
            <BarChart data={leadSourceData} />
          </Box>
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default Sales;