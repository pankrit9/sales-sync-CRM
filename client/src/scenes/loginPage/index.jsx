import {
    Box,
    Typography,
    useTheme,
    useMediaQuery,
  } from "@mui/material";
  import Form from "./Form";
  
  const LoginPage = () => {
      const theme = useTheme();
      const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
      
      return (
          <Box>
              <Box
                  width="100%"
                  backgroundColor={theme.palette.background.alt}
                  p="1rem 6%"
                  textAlign="center"
              >
                  <Typography
                      fontWeight="bold"
                      fontSize="32px"
                      color="primary" // purple
                      >
                      SalesSync
                  </Typography>
              </Box>
              {/* FORM BOX */}
              <Box
                  width={isNonMobileScreens ? "50%" : "93%"} // if the screen is non-mobile, then the width is 50%, else 100%
                  p="2rem"    // using rem allows us to have consistantcy across screens
                  m="2rem auto"
                  borderRadius="1.5rem"
                  backgroundColor={theme.palette.background.alt}
              >
                  <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem"}}>
                      Welcome to SalesSync, Unlock the power of your sales data
                  </Typography>
                  <Form />
              </Box>
          </Box>
      );
  };
  
  export default LoginPage;