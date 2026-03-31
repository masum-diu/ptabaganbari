import { useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography, Chip, IconButton, Drawer, useMediaQuery, useTheme } from "@mui/material";
import Link from "next/link";

const NAV_ITEMS = [
  { icon: "📊", label: "Dashboard",    href: "/admin/dashboard" },
  { icon: "🎫", label: "Ticket Check", href: "/admin/ticket-check" },
];

const SIDEBAR_WIDTH = 240;

export default function AdminLayout({ children }) {
  const router  = useRouter();
  const theme   = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin");
  }

  const SidebarContent = (
    <Box sx={{
      width: SIDEBAR_WIDTH, height: "100vh",
      background: "linear-gradient(180deg,#071007 0%,#0d1f0d 60%,#071007 100%)",
      display: "flex", flexDirection: "column",
      borderRight: "1px solid rgba(165,214,167,0.1)",
    }}>
      {/* Logo */}
      <Box sx={{ px: 3, py: 3.5, borderBottom: "1px solid rgba(165,214,167,0.1)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{
            width: 38, height: 38, borderRadius: 2,
            background: "linear-gradient(135deg,#1b5e20,#2e7d32)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem", boxShadow: "0 0 16px rgba(46,125,50,0.5)", flexShrink: 0,
          }}>🛡️</Box>
          <Box>
            <Typography fontWeight={800} color="#a5d6a7" fontSize="0.92rem" lineHeight={1.2}>
              Admin Panel
            </Typography>
            <Typography fontSize="0.68rem" color="rgba(255,255,255,0.35)">
              PTA BaganBari
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Nav label */}
      <Box sx={{ px: 3, pt: 3, pb: 1 }}>
        <Typography fontSize="0.65rem" fontWeight={800} color="rgba(255,255,255,0.25)" letterSpacing={2} sx={{ textTransform: "uppercase" }}>
          Navigation
        </Typography>
      </Box>

      {/* Nav Items */}
      <Box sx={{ flex: 1, px: 2 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}
              onClick={() => isMobile && setMobileOpen(false)}>
              <Box sx={{
                display: "flex", alignItems: "center", gap: 1.5,
                px: 2, py: 1.4, borderRadius: 2, mb: 0.5, cursor: "pointer",
                background: isActive ? "rgba(46,125,50,0.25)" : "transparent",
                borderLeft: isActive ? "3px solid #a5d6a7" : "3px solid transparent",
                transition: "all 0.18s",
                "&:hover": { background: "rgba(165,214,167,0.08)", borderLeftColor: "rgba(165,214,167,0.4)" },
              }}>
                <Typography fontSize="1.1rem">{item.icon}</Typography>
                <Typography
                  fontSize="0.88rem"
                  fontWeight={isActive ? 700 : 400}
                  color={isActive ? "#a5d6a7" : "rgba(255,255,255,0.65)"}
                >
                  {item.label}
                </Typography>
                {isActive && (
                  <Box sx={{ ml: "auto", width: 6, height: 6, borderRadius: "50%", bgcolor: "#a5d6a7", boxShadow: "0 0 6px #a5d6a7" }} />
                )}
              </Box>
            </Link>
          );
        })}
      </Box>

      {/* Divider */}
      <Box sx={{ mx: 3, borderTop: "1px solid rgba(165,214,167,0.1)", mb: 2 }} />

      {/* View Site */}
      <Box sx={{ px: 2, mb: 1 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Box sx={{
            display: "flex", alignItems: "center", gap: 1.5,
            px: 2, py: 1.4, borderRadius: 2, cursor: "pointer",
            transition: "all 0.18s",
            "&:hover": { background: "rgba(165,214,167,0.08)" },
          }}>
            <Typography fontSize="1.1rem">🌿</Typography>
            <Typography fontSize="0.88rem" color="rgba(255,255,255,0.5)">View Site</Typography>
          </Box>
        </Link>
      </Box>

      {/* Logout */}
      <Box sx={{ px: 2, pb: 3 }}>
        <Box onClick={handleLogout} sx={{
          display: "flex", alignItems: "center", gap: 1.5,
          px: 2, py: 1.4, borderRadius: 2, cursor: "pointer",
          transition: "all 0.18s",
          "&:hover": { background: "rgba(229,57,53,0.12)" },
        }}>
          <Typography fontSize="1.1rem">🚪</Typography>
          <Typography fontSize="0.88rem" color="rgba(239,154,154,0.7)">Logout</Typography>
        </Box>
      </Box>

      {/* Bottom info */}
      <Box sx={{ px: 3, pb: 3, borderTop: "1px solid rgba(165,214,167,0.08)", pt: 2 }}>
        <Typography fontSize="0.65rem" color="rgba(255,255,255,0.2)" lineHeight={1.8}>
          © 2026 PTA BaganBari Resort<br />Admin v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#0f1a0f" }}>

      {/* Desktop Sidebar */}
      <Box sx={{ display: { xs: "none", md: "block" }, flexShrink: 0, width: SIDEBAR_WIDTH }}>
        {SidebarContent}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { bgcolor: "transparent", boxShadow: "none" } }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {SidebarContent}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <Box sx={{
          background: "linear-gradient(90deg,#071007,#0d1f0d)",
          px: { xs: 2, md: 3 }, py: 1.5,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid rgba(165,214,167,0.1)",
          flexShrink: 0,
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Mobile menu button */}
            <IconButton
              sx={{ display: { xs: "flex", md: "none" }, color: "#a5d6a7", p: 0.5 }}
              onClick={() => setMobileOpen(true)}
            >
              ☰
            </IconButton>
            <Box>
              <Typography fontWeight={700} color="#e8f5e9" fontSize="0.95rem">
                {NAV_ITEMS.find(n => n.href === router.pathname)?.icon}{" "}
                {NAV_ITEMS.find(n => n.href === router.pathname)?.label || "Admin"}
              </Typography>
              <Typography fontSize="0.7rem" color="rgba(255,255,255,0.3)">
                PTA BaganBari Resort Management
              </Typography>
            </Box>
          </Box>
          <Chip
            label="● Online"
            size="small"
            sx={{ bgcolor: "rgba(46,125,50,0.2)", color: "#a5d6a7", border: "1px solid rgba(165,214,167,0.25)", fontSize: "0.72rem" }}
          />
        </Box>

        {/* Page content */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
