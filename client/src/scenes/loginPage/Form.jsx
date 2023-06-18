import { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";    // used for the form library
import * as yup from "yup";    // validation library
import { useNavigate } from "react-router-dom"; // to navigate when they register
import { useDispatch } from "react-redux";  // used react-redux to store the user info
import { setLogin } from "state";
import FlexBetween from "components/FlexBetween";

const registerForm = yup.object().shape({
    // yup handles the validation of the form (i.e. if the user has entered the correct info)
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("Invalid email").required("required"),
    password: yup.string().required("required")
});

const loginForm = yup.object().shape({
    // stripped down version of the registerSchema
    email: yup.string().email("Invalid email").required("required"),
    password: yup.string().required("required"),
});

const initialValuesRegister = {
    // form for the validation
    // this for the initial values of the form
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: "",
}

const initialValuesLogin = {
    email: "",
    password: "",
}

const Form = () => {
    // Form component
    const { palette } = useTheme();
    const [pageType, setPageType] = useState("login"); // to determine if the user is on the register page or the login page
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLogin = pageType === "login"; // to determine if the user is on the login page or the register page
    const isRegister = pageType === "register";
    
    const isNonMobile = useMediaQuery("(min-width: 600px)"); // hook built into mui to determine if the curr screen size is lower or higher to the value input in it

    /**
     * 
    // allows us to send form info with the image
     * @param values `value` used in the formik textFields is in this object
     * @param onSubmitProps -> essentially the formik props provides several formik methods 
     */
    const register = async (values, onSubmitProps) => {
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
        // to save whatver is returned from the backend, in a parsable form like json
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();  // reset the form

        if (savedUser) {
            setPageType("login");   // if the user is registered, then we'll navigate them to the login page
        }
    }

    /**
     * 
     * @param values 
     * @param onSubmitProps 
    */
    const login = async (values, onSubmitProps) => {
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
            navigate("/home");  // navigate to the home page as the user is logged in
        }
    }

    /** logic behind when the user submits the form */
    const handleFormSubmit = async (values, onSubmitProps) => {
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
                        }} // passed in any div of this box component
                    >
                        {isRegister && (
                            // if on the register page, we'll have a number of components
                            <>
    {/* BASIC NAMING */}
                                <TextField
                                    label="First Name" // display of the text
                                    onBlur={handleBlur} // whenwe click out of input field
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name="firstName" // to sync to the correct value from the initialValueRegister
                                    error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                    helperText={touched.firstName && errors.firstName}
                                    sx={{
                                        gridColumn: "span 2"
                                    }} />
                                <TextField
                                    label="Last Name" // display of the text
                                    onBlur={handleBlur} // whenwe click out of input field
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name="lastName" // to sync to the correct value from the initialValueRegister
                                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                    sx={{
                                        gridColumn: "span 2"
                                    }} />
                            </>
                        )}
                        
    {/* LOGIN AND REGISTER */}
                        <TextField
                            label="Email" // display of the text
                            onBlur={handleBlur} // when we click out of input field
                            onChange={handleChange}
                            value={values.email}
                            name="email" // to sync to the correct value from the initialValueRegister
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{
                                gridColumn: "span 4"
                            }} 
                        />
                        <TextField
                            label="Password" // display of the text
                            type="password" // to hide the value
                            onBlur={handleBlur} // when we click out of input field
                            onChange={handleChange}
                            value={values.password}
                            name="password" // to sync to the correct value from the initialValueRegister
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{
                                gridColumn: "span 4"
                            }}
                        />
                    </Box>

    {/* ------------- BUTTONS SECTION ------------- */}
                    <Box>
                        <Button
                            fullWidth
                            type="SIGN UP"
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
    {/* TEXT BELOW (TO SWITCH BETWEEN REGISTER AND LOGIN) */}
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
                </form>
            )}
        </Formik>
    )
}

export default Form;
