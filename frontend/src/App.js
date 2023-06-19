import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./scenes/loginPage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

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
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
);
}

export default App;
