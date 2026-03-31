import { useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box,
  IconButton, Drawer, List, ListItem, ListItemButton,
  ListItemText, Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { useRouter } from "next/router";

const NAV_LINKS = [
  { label: "Home",      href: "/" },
  { label: "About",     href: "/about" },
  { label: "Gallery",   href: "/gallery" },
  { label: "My Ticket", href: "/my-ticket" },
  { label: "Map",       href: "/map" },
];

export default function Navbar() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppBar position="sticky" sx={{ background: "linear-gradient(90deg,#0d1f0d,#1b2e1b)", boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <Typography fontWeight={800} fontSize="1.2rem" color="primary.light" sx={{ cursor: "pointer", letterSpacing: 0.5 }}>
              🌿 PTA BaganBari
            </Typography>
          </Link>

          {/* Desktop Nav */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, alignItems: "center" }}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                <Button sx={{
                  color: router.pathname === link.href ? "primary.light" : "#fff",
                  fontWeight: router.pathname === link.href ? 700 : 400,
                  borderBottom: router.pathname === link.href ? "2px solid" : "2px solid transparent",
                  borderColor: router.pathname === link.href ? "primary.light" : "transparent",
                  borderRadius: 0,
                  px: 2,
                  "&:hover": { color: "primary.light", bgcolor: "rgba(165,214,167,0.08)" },
                }}>
                  {link.label}
                </Button>
              </Link>
            ))}
            <Link href="/booking" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary" size="small" sx={{ ml: 2, px: 3, borderRadius: 3 }}>
                🎫 Book Now
              </Button>
            </Link>
          </Box>

          {/* Mobile Hamburger */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, color: "#fff" }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 270, bgcolor: "#0d1f0d" } }}
      >
        {/* Drawer Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 2.5, bgcolor: "#1b2e1b" }}>
          <Typography fontWeight={800} color="primary.light" fontSize="1.1rem">
            🌿 PTA BaganBari
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "rgba(165,214,167,0.15)" }} />

        {/* Nav Links */}
        <List sx={{ pt: 1 }}>
          {NAV_LINKS.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <ListItem key={link.href} disablePadding>
                <Link href={link.href} style={{ textDecoration: "none", width: "100%" }} onClick={() => setDrawerOpen(false)}>
                  <ListItemButton sx={{
                    px: 3, py: 1.5,
                    bgcolor: isActive ? "rgba(165,214,167,0.12)" : "transparent",
                    borderLeft: isActive ? "3px solid" : "3px solid transparent",
                    borderColor: isActive ? "primary.light" : "transparent",
                    "&:hover": { bgcolor: "rgba(165,214,167,0.08)" },
                  }}>
                    <ListItemText
                      primary={link.label}
                      primaryTypographyProps={{
                        color: isActive ? "primary.light" : "rgba(255,255,255,0.85)",
                        fontWeight: isActive ? 700 : 400,
                        fontSize: "0.98rem",
                      }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ borderColor: "rgba(165,214,167,0.15)", mx: 3 }} />

        {/* Book Now CTA */}
        <Box sx={{ px: 3, pt: 3 }}>
          <Link href="/booking" style={{ textDecoration: "none" }} onClick={() => setDrawerOpen(false)}>
            <Button variant="contained" color="primary" fullWidth sx={{ py: 1.4, borderRadius: 3, fontSize: "0.95rem" }}>
              🎫 Book Now
            </Button>
          </Link>
        </Box>

        {/* Footer info */}
        <Box sx={{ px: 3, mt: "auto", pb: 3, pt: 4 }}>
          <Typography fontSize="0.78rem" color="rgba(255,255,255,0.35)" lineHeight={1.8}>
            📍 Baganbari, Kasba, Brahmanbaria<br />
            📞 +880 1700-000000
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}
