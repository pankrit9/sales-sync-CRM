import { Box, Typography } from "@mui/material";
import React from 'react';

const BadgeBox = ({ title, subtitle, user, icon, increase }) => {

  return (
    <Box width="100%" m="0 60px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap="15px">
          {React.cloneElement(icon, { fontSize: "large" })}
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            {title}
          </Typography>
        </Box>
        <Typography variant="h5" pl={16.5}>
          {user}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="-50px">
        <Typography variant="h5" pl={17.5}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
        >
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default BadgeBox;

