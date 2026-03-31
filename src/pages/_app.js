import "@/styles/globals.css";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "@/styles/theme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminLayout from "@/components/AdminLayout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminLogin = router.pathname === "/admin";
  const isAdminPage  = router.pathname.startsWith("/admin");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAdminLogin ? (
        // Login page — no layout
        <Component {...pageProps} />
      ) : isAdminPage ? (
        // Admin pages — sidebar layout
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      ) : (
        // Public pages — navbar + footer
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />
          <Box sx={{ flex: 1 }}>
            <Component {...pageProps} />
          </Box>
          <Footer />
        </Box>
      )}
    </ThemeProvider>
  );
}
