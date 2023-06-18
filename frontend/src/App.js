import LoginPage from "scenes/loginPage";
// import logo from './logo.svg';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { Navigate } from "react-router-dom";

const mode = useSelector((state) => state.mode); // grabs the value created at initial state in ./state/index.js
const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]); // gets the theme, yet to pass to the material ui
const isAuth = Boolean(useSelector((state) => state.token)); // checks if the user is authenticated (if the token is there). If the user is even logged in

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {/* css reset for meterial ui */}
          <CssBaseline />
          <Routes>
            {/* SETTING UP THE ROUTES */}
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
            {/* above is the parameter (:userID) */}
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
