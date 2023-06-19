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
        <div class="container">
            <div class="left-side"
                width="100%"
                backgroundColor={theme.palette.background.alt}
                p="1rem 6%"
                textAlign="left"
            >
                <Typography
                    fontWeight="bold"
                    fontSize="32px"
                    >
                    SalesSync
                </Typography>
                <Typography
                    fontWeight="bold"
                    fontSize="15px"
                    color="primary"
                    >
                    Customer Relationship Management
                </Typography>
            </div>
            <div class="right-side"
                width="100%"
                backgroundColor={theme.palette.background.alt}
                p="1rem 6%"
                textAlign="left"
            >
                {/* FORM BOX */}
                    <Box
                        width={isNonMobileScreens ? "50%" : "93%"} // if the screen is non-mobile, then the width is 50%, else 100%
                        p="2rem"    // using rem allows us to have consistantcy across screens
                        m="2rem auto"
                        borderRadius="1.5rem"
                        backgroundColor={theme.palette.background.alt}
                    >
                        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem"}}>
                            Welcome to SalesSync, unlock the power of your sales data!
                        </Typography>
                        <Form />
                    </Box>
            </div>
        </div>
    );
};

export default LoginPage;