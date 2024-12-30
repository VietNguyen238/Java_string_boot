import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3bb7db",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      paper: "#fff",
      default: "#f4f4f4",
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
  },
});

export default theme;
