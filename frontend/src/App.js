import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/homePage/pages/Home";
import LoginPage from "./pages/loginPage";
import Products from "./pages/products";
import Sales from "./pages/sales";
import Records from "./pages/recordsPage";
import Tasks from "./pages/tasks";
import Clients from "./pages/clients";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Navbar  from "./components/navbars/Navbar";
import Rankings from "./pages/rankings";
import Staff from "./pages/staff";
import ResetPage from "./pages/loginPage/indexReset";
import Blog from "./pages/homePage/pages/Blog";
import Services from "./pages/homePage/pages/Services";
import Pricing from "./pages/homePage/pages/Pricing";

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
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/resetpassword" element={<ResetPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/records" element={<Records />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/records" element={<Records />} />
            <Route path="/staff" element={<Staff />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
);
}

export default App;