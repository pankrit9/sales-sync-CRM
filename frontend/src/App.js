import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./homePage/pages/Home";
import LoginPage from "./pages/loginPage";
import Products from "./pages/productsPage/products";
import Sales from "./pages/salesPage/sales";
import Records from "./pages/recordsPage/recordsPage";
import Tasks from "./pages/tasksPage/tasks";
import Clients from "./pages/clientsPage/clients";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Navbar  from "./components/navbars/Navbar";
import Rankings from "./pages/gamificationPage/rankings";
import Staff from "./pages/staffsPage/staff";
import ResetPage from "./pages/loginPage/indexReset";
import Blog from "./homePage/pages/Blog";
import Services from "./homePage/pages/Services";
import Pricing from "./homePage/pages/Pricing";

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