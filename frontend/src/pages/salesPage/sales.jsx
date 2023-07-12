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

function Sales() {
  //should taskData be linked to a get data call?
  const [taskData, setTaskData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [LTVData, setLTVData] = useState([]);
  const [winRateData, setWinRateData] = useState([]);
  const [leadSourceData, setLeadSourceData] = useState([]);
  const [revClosedData, setRevClosedData] = useState([]);
  const [closedKeys, setClosedKeysData] = useState([]);

  const fetchTaskData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/tasks`, {method: "GET"});
    const data = await response.json();
    setTaskData(data);
  }

  const fetchRevenueData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/revenue`, {method: "GET"});
    const data = await response.json();
    setRevenueData(data);
  }

  const fetchClientData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/clients`, {method: "GET"});
    const data = await response.json();
    setClientData(data);
  }

  const fetchProductData = async () => {
    const response = await fetch(`${BACKEND_API}/products/piechart`, {method: "GET"});
    const data = await response.json();
    setProductData(data);
  }

  const fetchLTVData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/ltv`, {method: "GET"});
    const data = await response.json();
    setLTVData(data);
  }

  const fetchWinRateData = async () => {
    const response = await fetch(`${BACKEND_API}/sales/winrate`, {method: "GET"});
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

  useEffect(() => {
    fetchTaskData();
    fetchRevenueData();
    fetchClientData();
    fetchProductData();
    fetchLTVData();
    fetchWinRateData();
    fetchLeadSourceData();
    fetchClosedKeysData();
    fetchRevClosedData();
  }, []);

  return (
    <>
    <Navbar/>
    <h1 className="header" style={{paddingLeft: '160px', marginTop: '50px', fontSize: '60px'}}>Dashboard</h1>
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
            increase="+14%"
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
            increase="+21%"
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
            increase="+5%"
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
            title={`${(winRateData * 100).toFixed(2)}%`}
            subtitle="Win Rate"
            increase="+10%"
            icon={
              <CheckIcon
                sx={{ fontSize: "26px" }}
              />
            }
          />
        </Box>

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
                $59,342.32
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
                $102,342.32
              </Typography>
            </Box>
          </Box>
          <Box height="400px" m="-20px 0 0 0">
            <StreamProjChart />
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