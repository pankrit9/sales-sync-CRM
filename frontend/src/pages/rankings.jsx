import React, { useState, useEffect } from 'react';
import Navbar  from "../components/navbars/Navbar";
import { Box, Typography} from "@mui/material";
import BadgeBox from "../components/gamificationComps/badgeBox";
import BadgeBoxSmall from "../components/gamificationComps/badgeBoxSmall";
import { BACKEND_API } from "../api";
import { useSelector } from 'react-redux';
import { TokenTwoTone } from '@mui/icons-material';
import { LocalPoliceTwoTone } from '@mui/icons-material';
import { MilitaryTechTwoTone } from '@mui/icons-material';
import { WorkspacesTwoTone } from '@mui/icons-material';
import { StarsTwoTone } from '@mui/icons-material';
import { EmojiEventsTwoTone } from '@mui/icons-material';
import { AutoAwesomeMosaicTwoTone } from '@mui/icons-material';


import Chatbot from "../components/chatbot/Chatbot";
 


function getBigBadge(revenue) {
  if (revenue >= 10000000) {
    return <AutoAwesomeMosaicTwoTone sx={{ fontSize: "120px", color: "#5E17EB" }}/>;
  }
  if (revenue >= 8000000) {
    return <StarsTwoTone sx={{ fontSize: "120px", color: "#5E17EB"  }}/>;
  }
  if (revenue >= 5000000) {
    return <MilitaryTechTwoTone sx={{ fontSize: "120px", color: "#5E17EB"  }}/>;
  }
  if (revenue >= 1000000) {
    return <WorkspacesTwoTone sx={{ fontSize: "120px", color: "#5E17EB"  }}/>;
  }
  if (revenue >= 800000) {
    return <LocalPoliceTwoTone sx={{ fontSize: "120px", color: "#5E17EB"  }}/>;
  }
  if (revenue >= 500000) {
    return <TokenTwoTone sx={{ fontSize: "120px", color: "#5E17EB"  }}/>;
  }
  if (revenue < 500000) {
    return <EmojiEventsTwoTone sx={{ fontSize: "120px", color: "#5E17EB"  }}/>;
  }
  return <EmojiEventsTwoTone sx={{ fontSize: "120px", color: "#5E17EB"  }}/>;
}

function getRank(revenue) {
  if (revenue >= 10000000) {
    return "Diamond"
  }
  if (revenue >= 8000000) {
    return "Emerald"
  }
  if (revenue >= 5000000) {
    return "Platinum"
  }
  if (revenue >= 1000000) {
    return "Gold"
  }
  if (revenue >= 800000) {
    return "Silver"
  }
  if (revenue >= 500000) {
    return "Bronze"
  }
  if (revenue < 500000) {
    return "Iron"
  }
  return "Iron"
}
function getSmallBadge(revenue) {
  if (revenue >= 10000000) {
    return <AutoAwesomeMosaicTwoTone sx={{ fontSize: "70px" }}/>;
  }
  if (revenue >= 8000000) {
    return <StarsTwoTone sx={{ fontSize: "70px" }}/>;
  }
  if (revenue >= 5000000) {
    return <MilitaryTechTwoTone sx={{ fontSize: "70px" }}/>;
  }
  if (revenue >= 1000000) {
    return <WorkspacesTwoTone sx={{ fontSize: "70px" }}/>;
  }
  if (revenue >= 800000) {
    return <LocalPoliceTwoTone sx={{ fontSize: "70px" }}/>;
  }
  if (revenue >= 500000) {
    return <TokenTwoTone sx={{ fontSize: "70px" }}/>;
  }
  if (revenue < 500000) {
    return <EmojiEventsTwoTone sx={{ fontSize: "70px" }}/>;
  }
  return <EmojiEventsTwoTone sx={{ fontSize: "70px" }}/>;
}
function getRemSales(revenue) {
  if (revenue < 500000) {
    return (500000 - revenue)
  }
  if (revenue < 800000) {
    return (800000 - revenue)
  }
  if (revenue < 1000000) {
    return (1000000 - revenue)
  }
  if (revenue < 5000000) {
    return (5000000 - revenue)
  }
  if (revenue < 8000000) {
    return (8000000 - revenue)
  }
  if (revenue < 10000000) {
    return (10000000 - revenue)
  }
}

function getNextRank(revenue) {
  if (revenue < 500000) {
    return "Bronze"
  } else if (revenue < 800000) {
    return "Silver"
  } else if (revenue < 1000000) {
    return "Gold"
  } else if (revenue < 5000000) {
    return "Platinum"
  } else if (revenue < 8000000) {
    return "Emerald"
  } else if (revenue <= 10000000) {
    return "Diamond"
  } else {
    return "-"
  }
}

function Rankings() {
  const role = useSelector(state => state.role);
  const _id = useSelector((state) => state.user);
  const name = useSelector((state) => state.name);
  const [higherUserData, setHigherUserData] = useState({});
  const [lowerUserData, setLowerUserData] = useState({});
  const [currentUserData, setCurrentUserData] = useState({});

  const fetchHigherUserData = async () => {
    const response = await fetch(`${BACKEND_API}/rankings/higher/${_id}`, {method: "GET"});
    const data = await response.json();
    setHigherUserData(data);
  }

  const fetchLowerUserData = async () => {
    const response = await fetch(`${BACKEND_API}/rankings/lower/${_id}`, {method: "GET"});
    const data = await response.json();
    setLowerUserData(data);
  }

  const fetchCurrentUserData = async () => {
    const response = await fetch(`${BACKEND_API}/rankings/current/${_id}`, {method: "GET"});
    const data = await response.json();
    setCurrentUserData(data);
  }

  useEffect(() => {
    fetchHigherUserData();
    fetchLowerUserData();
    fetchCurrentUserData();
  }, []);

  return (
    <>
    <Navbar/>
    <Chatbot/>
    <h1 className="header" style={{paddingLeft: '160px', marginTop: '50px', fontSize: '60px'}}>My Ranking</h1>
    <h1 className="header" style={{paddingLeft: '160px', marginTop: '50px', fontSize: '40px'}}>{name}{' | '}{role}{' | Sales to next Rank: $'}
      {getRemSales(currentUserData.revenue) ? getRemSales(currentUserData.revenue).toLocaleString(): 'Loading...'}</h1>
    <Box m="10px" style={{ marginLeft: '240px',marginTop: '30px'}}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(10, 1fr)"
        gridAutoRows="140px"
        gap="30px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 7"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
        {higherUserData && higherUserData.full_name ? 
        <Box border={3} borderColor="divider" borderRadius={2} p={2}>
        <Box pr={5} pb={2}>
          
          <BadgeBoxSmall
              title={"Rank: " + getRank(higherUserData.revenue)}
              subtitle={"Next Rank: " + getNextRank(higherUserData.revenue)}
              user={higherUserData.full_name}
              increase={"Sales: $" + higherUserData.revenue.toLocaleString()}
              icon={getSmallBadge(higherUserData.revenue)}
            />            
          
        </Box>
        </Box>
        : 'You are number 1!'
        }
        </Box>
        </Box>
      </Box>
      <Box m="10px" style={{ marginLeft: '140px', marginTop: '30px'}}>
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
          gridColumn="span 7"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {currentUserData && currentUserData.full_name ? 
          <Box border={5} borderColor="#5E17EB" borderRadius={2} p={2}>
          <Box pr={15} pb={4}>
          <BadgeBox
            title={"Rank: " + getRank(currentUserData.revenue)}
            user="You"
            subtitle={"Next Rank: " + getNextRank(currentUserData.revenue)}
            increase={"Sales: $" + currentUserData.revenue.toLocaleString()}
            icon={getBigBadge(currentUserData.revenue)}
          />
          
          </Box>
          </Box>
          : 'We cannot find you'
          }
        </Box>
        </Box>
      </Box>
      <Box m="10px" style={{ marginLeft: '240px', marginTop: '30px' }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(10, 1fr)"
        gridAutoRows="140px"
        gap="30px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 7"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {lowerUserData && lowerUserData.full_name ?
        <Box border={3} borderColor="divider" borderRadius={2} p={2}>
        <Box pr={5} pb={2}>
          
          <BadgeBoxSmall
            title={"Rank: " + getRank(lowerUserData.revenue)}
            user={lowerUserData.full_name}
            subtitle={"Next Rank: " + getNextRank(lowerUserData.revenue)}
            increase={"Sales: $" + lowerUserData.revenue.toLocaleString()}
            icon={getSmallBadge(lowerUserData.revenue)}
          />
          
        </Box>
        </Box>
        : 'There is no one below you'
      }
        </Box>
        </Box>
      </Box>
    </>
  );
};

export default Rankings;