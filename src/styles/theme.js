import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary:   { main: "#2e7d32", light: "#a5d6a7", dark: "#1b5e20", contrastText: "#fff" },
    secondary: { main: "#f9fdf9", light: "#ffffff",  dark: "#c8e6c9", contrastText: "#2e7d32" },
    background:{ default: "#f9fdf9", paper: "#ffffff" },
    text:      { primary: "#1a2e1a", secondary: "#5a7a5a" },
    success:   { main: "#2e7d32" },
    divider:   "#e8f5e9",
  },
  typography: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          borderRadius: 10,
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #2e7d32, #1b5e20)",
          "&:hover": { background: "linear-gradient(135deg, #1b5e20, #145214)" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            "&:hover fieldset": { borderColor: "#2e7d32" },
            "&.Mui-focused fieldset": { borderColor: "#2e7d32" },
          },
          "& label.Mui-focused": { color: "#2e7d32" },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { background: "linear-gradient(90deg, #0d1f0d, #1b2e1b)" },
      },
    },
  },
});

export default theme;
