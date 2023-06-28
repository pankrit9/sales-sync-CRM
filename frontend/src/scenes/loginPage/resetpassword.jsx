// this is where the register functionality is handled
import { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { setLogin } from "../../state";
import { BACKEND_API } from "../../api";

// creating the validation schema to tell how the form library is going to store the information
const forgotPasswordSchema =  yup.object().shape({
    // lets user enter their email if they forgot their password
    email: yup.string().email("Invalid email").required("required"),
});

const initialValuesForgotPassword = {
    email: "",
}

const resetpassword = () => {
    const [pageType, setPageType] = useState("login");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width: 600px)"); // hook built into mui to determine if the curr screen size is lower or higher to the value input in it
    const isForgotPassword = pageType === "forgot password";
    const isChangePassword = pageType === "change password";

    /**
     * 
    // allows us to send form info with the image

    /**
     * 
     * @param values 
     * @param onSubmitProps 
    */
    const forgotPassword = async (values, onSubmitProps) => {
        const loggedInResponse = await fetch(
            // send the form data to the below api call
            `${BACKEND_API}/auth/recover-password`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
                credentials: "omit",
            }
        );
        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();  // reset the form
    }

    /**
     * 
     * @param values 
     * @param onSubmitProps 
    */
    const changePassword = async (values, onSubmitProps) => {
        const loggedInResponse = await fetch(
            // send the form data to the below api call
            `${BACKEND_API}/auth/change-password`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
                credentials: "omit",
            }
        );
        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();  // reset the form
    }


/** logic behind when the user submits the form */
    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isForgotPassword) await forgotPassword(values, onSubmitProps);
        if (isChangePassword) await forgotPassword(values, onSubmitProps);
    };

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
        >
            {({
                values,
                errors,
                touched, 
                handleChange, 
                handleSubmit, 
                handleBlur,
                setFieldValue,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))" // equal fractions of 4 cols, if the screen has space, otherwise to 0
                        sx={{
                            "& > div": {
                                gridColumn: isNonMobile ? undefined : "span 4",
                            }
                        }}
                    >

{/*FORGOT PASSWORD */}
                {isForgotPassword && (                                   
                    <>
                    <TextField
                        label="Email" 
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                        name="email"initialValueRegister
                        error={Boolean(touched.email) && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        sx={{
                            gridColumn: "span 4"
                        }} 
                    />
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                margin: "2rem 0",
                                padding: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main},
                            }}
                        >
                            {isLogin ? "LOGIN" : "SUBMIT"}
                        </Button>
                        <Typography
                            onClick={() => {
                                // if on login page, switch to forgot page, else switch to login page
                                setPageType(isLogin ? "forgot password" : "login");
                                resetForm();
                            }}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                "&:hover": { 
                                    cursor: "pointer",
                                    color: palette.primary.light,
                                }
                            }}
                        >
                            {isLogin 
                                ? "Forgot my Password"  
                                : "I've remembered my password, click here to login!"}
                        </Typography>
                    </Box>
                    </>
                )}

{/*CHECK EMAIL INBOX MESSAGE */}
                {isChangePassword && (
                    <>
                    <TextField
                        label="Recovery Code" 
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                        name="email"initialValueRegister
                        error={Boolean(touched.email) && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        sx={{
                            gridColumn: "span 4"
                        }} 
                    />
                    {/*ADD FUNCTIONALITY TO CONFIRM PASSWORDS ARE EQUAL */}
                    <TextField
                        label="New Password" 
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                        name="email"initialValueRegister
                        error={Boolean(touched.email) && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        sx={{
                            gridColumn: "span 4"
                        }} 
                    />
                    <TextField
                        label="Confirm New Password" 
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                        name="email"initialValueRegister
                        error={Boolean(touched.email) && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        sx={{
                            gridColumn: "span 4"
                        }} 
                    />
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                margin: "2rem 0",
                                padding: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main},
                            }}
                        >
                            {isLogin ? "LOGIN" : "SUBMIT"}
                        </Button>
                    </Box>
                    </>
                )}
                </Box>
                </form>
            )}
        </Formik>
    )
}

export default resetpassword;