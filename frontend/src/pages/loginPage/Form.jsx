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
const registerSchema = yup.object().shape({
    // yup handles the validation of the form (i.e. if the user has entered the correct info)
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("Invalid email").required("required"),
    password: yup.string().required("required"),
    company: yup.string().required("required"),
    role: yup.string().required("required")
});

const loginSchema = yup.object().shape({
    // stripped down version of the registerSchema
    email: yup.string().email("Invalid email").required("required"),
    password: yup.string().required("required"),
});

const forgotPasswordSchema = yup.object().shape({
    // lets user enter their email if they forgot their password
    email: yup.string().email("Invalid email").required("required"),
});

const initialValuesRegister = {
    // schema for the validation
    // this for the initial values of the form
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    company: "",
    role: "",   // to determine if the user is a manager or staff
}

const initialValuesLogin = {
    email: "",
    password: "",
}
const initialValuesForgotPassword = {
    email: "",
}

const Form = () => {
    const [pageType, setPageType] = useState("login");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width: 600px)"); // hook built into mui to determine if the curr screen size is lower or higher to the value input in it
    const isLogin = pageType === "login"; // to determine if the user is on the login page or the register page
    const isRegister = pageType === "register";
    const isForgotPassword = pageType === "forgot password";

    /**
     * 
    // allows us to send form info with the image
     * @param values `value` used in the formik textFields is in this object
     * @param onSubmitProps -> essentially the formik props provides several formik methods 
     */
    const register = async (values, onSubmitProps) => {
        try {
            // form data is used
            const formData = new FormData();    // to handle the pictures
            for (let value in values) {
                // loop through each key-value in the values object and append to the form data
                formData.append(value, values[value]);
            }

            const savedUserResponse = await fetch(
                // send the form data to the below api call
                `${BACKEND_API}/auth/register`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!savedUserResponse.ok) {
                // Handle the case when the server responds with an error status
                throw new Error("Registration failed");
            };

            // to save whatver is returned from the backend, in a parsable form like json
            const savedUser = await savedUserResponse.json();
            onSubmitProps.resetForm();  // reset the form

            if (savedUser) {
                setPageType("login");   // if the user is registered, then we'll navigate them to the login page
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 
     * @param values 
     * @param onSubmitProps 
    */
    const login = async (values, onSubmitProps) => {
        try {
            const loggedInResponse = await fetch(
                // send the form data to the below api call
                `${BACKEND_API}/auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                    credentials: "omit",
                }
            );

            if (!loggedInResponse.ok) {
                // Handle the case when the server responds with an error status
                throw new Error("Login failed");
            };

            const loggedIn = await loggedInResponse.json();
            onSubmitProps.resetForm();  // reset the form
            if (loggedIn) {
                dispatch(
                    setLogin({
                        // comes from the redux state dir 
                        user: loggedIn.user,
                        token: loggedIn.token,
                    })
                );   // dispatch the user info to the store
                navigate("/");  // navigate to the home page as the user is logged in
            }
        } catch (error) {
            console.log(error);
        }
    }
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


    /** logic behind when the user submits the form */
    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isForgotPassword) await forgotPassword(values, onSubmitProps);
        if (isLogin) await login(values, onSubmitProps);    // leave it for the backend
        if (isRegister) await register(values, onSubmitProps);
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
                        {isRegister && (
                            <>
                                {/* USER DETAILS */}
                                <TextField
                                    label="First Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name="firstName"
                                    error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                    helperText={touched.firstName && errors.firstName}
                                    sx={{
                                        gridColumn: "span 2"
                                    }} />
                                <TextField
                                    label="Last Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name="lastName"
                                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                    sx={{
                                        gridColumn: "span 2"
                                    }} />
                                <TextField
                                    label="company"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.location}
                                    name="company"
                                    error={Boolean(touched.location) && Boolean(errors.location)}
                                    helperText={touched.location && errors.location}
                                    sx={{
                                        gridColumn: "span 4"
                                    }} />
                            </>
                        )}

                        {/* LOGIN AND REGISTER */}
                        <TextField
                            label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{
                                gridColumn: "span 4"
                            }}
                        />
                        <TextField
                            label="Password"
                            type="password" // to hide the value
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password" // to sync to the correct value from the initialValueRegister
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{
                                gridColumn: "span 4"
                            }}
                        />
                        {isRegister && (
                            <>
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="manager"
                                        checked={values.role === "manager"}
                                        onChange={handleChange}
                                    />
                                    Manager
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="manager"
                                        checked={values.role === "manager"}
                                        onChange={handleChange}
                                        // sx={{
                                        //     position: 'absolute'
                                        // }}
                                    />
                                    Staff
                                </label>
                            </>
                        )}
                    </Box>

                    {/* ------------- BUTTONS SECTION ------------- */}
                    <Box>
                        {/* LOGIN/REGISTER BUTTON */}
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                margin: "2rem 0",
                                padding: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main },
                            }}
                        >
                            {isLogin ? "LOGIN" : "REGISTER"}
                        </Button>
                        {/* SWITCH BETWEEN REGISTER AND LOGIN */}
                        <Typography
                            onClick={() => {
                                // if on login page, switch to register page, else switch to login page
                                setPageType(isLogin ? "register" : "login");
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
                                ? "Don't have an account? Sign Up here."
                                : "Already have an account? Login here."}
                        </Typography>
                    </Box>
                    {/* FORGOT PASSWORD */}
                    {!isRegister && (
                        <Typography
                            onClick={() => {
                                // if on login page, switch to forgot page, else switch to login page
                                setPageType(isLogin ? "forgot password" : "login");
                                navigate("/resetpassword");
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
                    )}
                </form>
            )}
        </Formik>
    )
}

export default Form;