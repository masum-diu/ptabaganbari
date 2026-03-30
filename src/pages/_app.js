import "@/styles/globals.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@/styles/theme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Box } from "@mui/material";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <Box sx={{ flex: 1 }}>
          <Component {...pageProps} />
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
