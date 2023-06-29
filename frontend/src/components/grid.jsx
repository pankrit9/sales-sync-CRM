// Just keeping this here in case we need it in the future
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: '18px',
  fontWeight: 'bold',
}));

function FormRow({arg1, arg2, arg3, arg4, arg5, arg6}) {
  return (
    <React.Fragment>
      <Grid item xs={0.5}>
        <Item>{arg1}</Item>
      </Grid>
      <Grid item xs={2}>
        <Item>{arg2}</Item>
      </Grid>
      <Grid item xs={2}>
        <Item>{arg3}</Item>
      </Grid>
      <Grid item xs={2}>
        <Item>{arg4}</Item>
      </Grid>
      <Grid item xs={2}>
        <Item>{arg5}</Item>
      </Grid>
      <Grid item xs={2}>
        <Item>{arg6}</Item>
      </Grid>
    </React.Fragment>
  );
}

export default function NestedGrid({arg1, arg2, arg3, arg4, arg5, arg6}) {
  return (
    <Box sx={{ flexGrow: 1, marginTop: 2 }}>
      <Grid container spacing={2}>
        <Grid container item spacing={3}>
          <FormRow arg1={arg1} arg2={arg2} arg3={arg3} arg4={arg4} arg5={arg5} arg6={arg6}/>
        </Grid>
      </Grid>
    </Box>
  );
}
