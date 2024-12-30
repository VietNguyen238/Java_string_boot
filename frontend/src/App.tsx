import React from "react";
import "./App.css";
import { Box, ThemeProvider } from "@mui/material";
import Sidebar from "./components/sideBar";
import AppRouter from "./routes/AppRouter";
import { BrowserRouter, useLocation } from "react-router-dom";
import theme from "./themes";

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <Box
      sx={{ display: "flex", width: "100vw", bgcolor: "background.default" }}
    >
      {!isAuthPage && <Sidebar />}
      <Box sx={{ flex: 1, bgcolor: "background.default" }}>
        <AppRouter />
      </Box>
    </Box>
  );
};

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
