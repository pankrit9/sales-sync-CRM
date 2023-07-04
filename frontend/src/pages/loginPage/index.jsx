// layout for the login page
import {
    Box,
    Typography,
    useTheme,
    useMediaQuery,
} from "@mui/material";

import Form from "./Form";
import "./page.css";
  
const LoginPage = () => {
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    
    return (
        <div className="container">
            <div className="left-side"
                // width="100%"
                // backgroundColor={theme.palette.background.alt}
                p="1rem 6%"
                // textAlign="left"
            >
                <Typography
                    fontWeight="bold"
                    style={{
                        fontSize:"100px",
                        color: theme.palette.text.primary,
                    }}
                    >
                    SaleSync
                </Typography>
                <Typography
                    fontWeight="bold"
                    style={{
                        fontSize:"30px",
                        color: theme.palette.primary.main
                    }}
                    textAlign={"center"}
                    >
                    Customer Relationship Management
                </Typography>
            </div>
            <div className="right-side"
                // width="100%"
                // backgroundColor={theme.palette.background.alt}
                p="1rem 6%"
                // textAlign="left"
            >
                {/* FORM BOX */}
                    <Box
                        width={isNonMobileScreens ? "93%" : "50%"} // if the screen is non-mobile, then the width is 50%, else 100%
                        p="2rem"    // using rem allows us to have consistantcy across screens
                        m="2rem auto"
                        borderRadius="1.5rem"
                        backgroundColor={theme.palette.background.alt}
                    >
                        <Typography textAlign = "center" fontWeight="bold" variant="h2" sx={{ mb: "1.5rem"}}>
                            Welcome to SaleSync, unlock the power of your sales data!
                        </Typography>
                        <Form />
                    </Box>
            </div>
        </div>
    );
};

export default LoginPage;
