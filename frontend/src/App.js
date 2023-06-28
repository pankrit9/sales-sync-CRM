import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./scenes/loginPage";
import Products from "./pages/products";
import Sales from "./pages/sales";
import Tasks from "./pages/tasks";
import Clients from "./pages/clients";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Navbar  from "./components/Navbar";
import Rankings from "./pages/rankings";
import Staff from "./pages/staff";
import ResetPage from "./scenes/loginPage/indexReset";

function App() {
  const mode = useSelector((state) => state.mode); // grabs the value created at initial state in ./state/index.js
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]); // gets the theme, yet to pass to the material ui

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {/* css reset for meterial ui */}
          <CssBaseline />
          <Routes>
            {/* SETTING UP THE ROUTES */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/resetpassword" element={<ResetPage />} />
            <Route path="/home" element={<Navbar />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/staff" element={<Staff />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
);
}

export default App;