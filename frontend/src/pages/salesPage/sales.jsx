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

  useEffect(() => {
    fetchTaskData();
    fetchRevenueData();
    fetchClientData();
  }, []);

  return (
    <>
    <Navbar/>
    <h1 className="header" style={{paddingLeft: '140px', marginTop: '50px', fontSize: '60px'}}>Dashboard</h1>
    <Box m="10px" style={{ marginLeft: '140px'}}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Button
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              padding: "30px 20px",
            }}
          >
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(105, 105, 105, 0.5)"
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
          bgcolor="rgba(105, 105, 105, 0.5)"
        >
          <StatBox
            title={`$${revenueData.toLocaleString()}`}
            subtitle="Revenue"
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
          bgcolor="rgba(105, 105, 105, 0.5)"
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
          bgcolor="rgba(105, 105, 105, 0.5)"
        >
          <StatBox
            title="45%"
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
          gridColumn="span 8"
          gridRow="span 2"
        >
          <Box
            mt="15px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
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
          <Box height="250px" m="-20px 0 0 0">
            <StreamCloseChart />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p="15px"
          >
            <Typography variant="h5" fontWeight="600">
              Product Breakdown
            </Typography>
          </Box>
          <Box height="250px" mt="-20px">
            <PieChart />
          </Box>
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
        >
          <Box
            mt="15px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
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
          <Box height="250px" m="-20px 0 0 0">
            <StreamProjChart />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p="15px"
          >
            <Typography variant="h5" fontWeight="600">
              Placeholder for another statistic
            </Typography>
          </Box>
          <Box height="250px" mt="-20px">
            <BarChart />
          </Box>
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default Sales;