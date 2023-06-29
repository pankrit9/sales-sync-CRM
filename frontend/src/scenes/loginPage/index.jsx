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

/////// login page template 1
// ----------------------------------------------------------

/**
 * <section class="vh-100 gradient-custom">
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <div class="card bg-dark text-white" style="border-radius: 1rem;">
          <div class="card-body p-5 text-center">

            <div class="mb-md-5 mt-md-4 pb-5">

              <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
              <p class="text-white-50 mb-5">Please enter your login and password!</p>

              <div class="form-outline form-white mb-4">
                <input type="email" id="typeEmailX" class="form-control form-control-lg" />
                <label class="form-label" for="typeEmailX">Email</label>
              </div>

              <div class="form-outline form-white mb-4">
                <input type="password" id="typePasswordX" class="form-control form-control-lg" />
                <label class="form-label" for="typePasswordX">Password</label>
              </div>

              <p class="small mb-5 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>

              <button class="btn btn-outline-light btn-lg px-5" type="submit">Login</button>

              <div class="d-flex justify-content-center text-center mt-4 pt-1">
                <a href="#!" class="text-white"><i class="fab fa-facebook-f fa-lg"></i></a>
                <a href="#!" class="text-white"><i class="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                <a href="#!" class="text-white"><i class="fab fa-google fa-lg"></i></a>
              </div>

            </div>

            <div>
              <p class="mb-0">Don't have an account? <a href="#!" class="text-white-50 fw-bold">Sign Up</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</section>
 */