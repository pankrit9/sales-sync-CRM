import React, { useState, useEffect } from 'react';
import Navbar  from "../../components/navbars/Navbar";
import { Box, Typography} from "@mui/material";
import BadgeBox from "../../components/gamificationComps/badgeBox";
import BadgeBoxSmall from "../../components/gamificationComps/badgeBoxSmall";
import { BACKEND_API } from "../../api";
import { useSelector } from 'react-redux';
import { TokenTwoTone } from '@mui/icons-material';
import { LocalPoliceTwoTone } from '@mui/icons-material';
import { MilitaryTechTwoTone } from '@mui/icons-material';
import { WorkspacesTwoTone } from '@mui/icons-material';
import { StarsTwoTone } from '@mui/icons-material';
import { EmojiEventsTwoTone } from '@mui/icons-material';
import { AutoAwesomeMosaicTwoTone } from '@mui/icons-material';

function Rankings() {
  const role = useSelector(state => state.role);
  const _id = useSelector((state) => state.user);
  const name = useSelector((state) => state.name);

  useEffect(() => {
  }, []);

  return (
    <>
    <Navbar/>
    <h1 className="header" style={{paddingLeft: '160px', marginTop: '50px', fontSize: '60px'}}>My Ranking</h1>
    <h1 className="header" style={{paddingLeft: '160px', marginTop: '50px', fontSize: '40px'}}>{name}{' | '}{role}{' | '}{'$552,000'}</h1>
    <Box m="10px" style={{ marginLeft: '160px'}}>
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
          <BadgeBoxSmall
            title="Rank: Bronze Seller"
            subtitle="Next Rank: Silver Seller"
            user="Jordan Teal"
            increase="Til next rank: $500,000"
            icon={
              <EmojiEventsTwoTone
                sx={{ fontSize: "70px" }}
              />
            }
          />
        </Box>
        </Box>
      </Box>
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
          gridColumn="span 7"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <BadgeBox
            title="Rank: Bronze Seller"
            user="You"
            subtitle="Next Rank: Silver Seller"
            increase="Til next rank: $500,000"
            icon={
              <TokenTwoTone
                sx={{ fontSize: "120px" }}
              />
            }
          />
        </Box>
        </Box>
      </Box>
      <Box m="10px" style={{ marginLeft: '160px', marginTop: '25px' }}>
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
          <BadgeBoxSmall
            title="Rank: Bronze Seller"
            user="Haley Smith"
            subtitle="Next Rank: Silver Seller"
            increase="Til next rank: $500,000"
            icon={
              <StarsTwoTone
                sx={{ fontSize: "70px" }}
              />
            }
          />
        </Box>
        </Box>
      </Box>
    </>
  );
};

export default Rankings;