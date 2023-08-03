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
import { BACKEND_API } from "../../api";

// creating the validation schema to tell how the form library is going to store the information
const forgotPasswordSchema =  yup.object().shape({
    // lets user enter their email if they forgot their password
    email: yup.string().email("Invalid email").required("required"),
});

const changePasswordSchema =  yup.object().shape({
    // lets user enter their email if they forgot their password
    email: yup.string().email("Invalid email").required("required"),
}
);

const initialValuesForgotPassword = {
    email: "",
}

const initialValuesChangePassword = {
    email: "",
    code: "",
    new_password: ""
}

const Resetpassword = () => {
    const [pageType, setPageType] = useState("forgot password");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width: 600px)"); // hook built into mui to determine if the curr screen size is lower or higher to the value input in it
    const isForgotPassword = pageType === "forgot password";
    const isChangePassword = pageType === "change password";

    /**
     * @param values 
     * @param onSubmitProps 
    */
    const forgotPassword = async (values, onSubmitProps) => {

        try {
            const forgotInResponse = await fetch(
                // send the form data to the below api call
                `${BACKEND_API}/auth/recover-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                    credentials: "omit",
                }
            );

            if (!forgotInResponse.ok) {
                const errorData = await forgotInResponse.json();
                console.error("Unable to log in: ", errorData);
                alert("Unable to log in: " + errorData.message);
                throw new Error("Registration failed" + errorData.message);
            };

            const forgot = await forgotInResponse.json();
            onSubmitProps.resetForm();  // reset the form
            if (forgot) {
                setPageType("change password"); // navigate to the home page as the user is logged in
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
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
                credentials: "include",
            }
        );
        onSubmitProps.resetForm();  // reset the form
        navigate("/login")
    }

    /** logic behind when the user submits the form */
    const handleFormSubmit = async (values, onSubmitProps) => {
        console.log("here we clicked", isChangePassword);
        if (isForgotPassword) await forgotPassword(values, onSubmitProps);
        if (isChangePassword) await changePassword(values, onSubmitProps);
    };

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={isForgotPassword ? initialValuesForgotPassword : initialValuesChangePassword}
            validationSchema={isForgotPassword ? forgotPasswordSchema : changePasswordSchema}
        >
            {({
                values,
                errors,
                touched, 
                handleChange, 
                handleSubmit, 
                handleBlur,
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
                            <TextField
                                label="Email" 
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name="email"initialValuesForgotPassword
                                error={Boolean(touched.email) && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                sx={{
                                    gridColumn: "span 4"
                                }} 
                            />
                        )}

                        {/*CHECK EMAIL INBOX MESSAGE */}
                        {isChangePassword && (
                            <>
                                <TextField
                                    label="Email" 
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"initialValuesChangePassword
                                    error={Boolean(touched.email) && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    sx={{
                                        gridColumn: "span 4"
                                    }} 
                                />
                                <TextField
                                    label="Recovery Code" 
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.code}
                                    name="code"initialValuesChangePassword
                                    error={Boolean(touched.code) && Boolean(errors.code)}
                                    helperText={touched.code && errors.code}
                                    sx={{
                                        gridColumn: "span 4"
                                    }} 
                                />
                                {/*ADD FUNCTIONALITY TO CONFIRM PASSWORDS ARE EQUAL */}
                                <TextField
                                    label="New Password" 
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.new_password}
                                    name="new_password"initialValuesChangePassword
                                    error={Boolean(touched.new_password) && Boolean(errors.new_password)}
                                    helperText={touched.new_password && errors.new_password}
                                    sx={{
                                        gridColumn: "span 4"
                                    }} 
                                />
                            </>
                        )}
                    </Box>
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                gridColumn:"span ",
                                margin: "2rem 0",
                                padding: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main},
                            }}
                        >
                            { "SUBMIT"}
                        </Button>
                        
                    </Box>
                    <Typography
                        onClick={() => {
                            // if on login page, switch to forgot page, else switch to login page
                            setPageType(isForgotPassword ? "forgot password" : "login");
                            navigate("/login" );

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
                        {isForgotPassword &&
                            "I've remembered my password, click here to login!"}
                    </Typography>
                </form>
            )}
        </Formik>
    )
}
export default Resetpassword;