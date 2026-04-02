import { useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography, Chip, IconButton, Drawer, useMediaQuery, useTheme } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ShieldIcon from "@mui/icons-material/Shield";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalAtmIcon        from "@mui/icons-material/LocalAtm";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Link from "next/link";

const NAV_ITEMS = [
  { icon: <DashboardIcon fontSize="small" />,          label: "Dashboard",    href: "/admin/dashboard" },
  { icon: <ListAltIcon fontSize="small" />,            label: "Booking List", href: "/admin/bookinglist" },
  { icon: <ConfirmationNumberIcon fontSize="small" />, label: "Ticket Check", href: "/admin/ticket-check" },
  { icon: <LocalAtmIcon fontSize="small" />,           label: "Cash Ticket",  href: "/admin/cash-ticket" },
];

const SIDEBAR_WIDTH = 240;

export default function AdminLayout({ children }) {
  const router   = useRouter();
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin");
  }

  const SidebarContent = (
    <Box sx={{
      width: SIDEBAR_WIDTH, height: "100vh",
      bgcolor: "#fff",
      display: "flex", flexDirection: "column",
      borderRight: "1px solid #e8f5e9",
      boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
    }}>
      {/* Logo */}
      <Box sx={{ px: 3, py: 3, borderBottom: "1px solid #e8f5e9" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{
            width: 38, height: 38, borderRadius: 2,
            background: "linear-gradient(135deg,#1b5e20,#2e7d32)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(46,125,50,0.3)", flexShrink: 0,
          }}>
            <ShieldIcon sx={{ color: "#fff", fontSize: "1.2rem" }} />
          </Box>
          <Box>
            <Typography fontWeight={800} color="#1b5e20" fontSize="0.92rem" lineHeight={1.2}>
              Admin Panel
            </Typography>
            <Typography fontSize="0.68rem" color="#aaa">PTA BaganBari</Typography>
          </Box>
        </Box>
      </Box>

      {/* Nav label */}
      <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Typography fontSize="0.65rem" fontWeight={800} color="#bbb" letterSpacing={2} sx={{ textTransform: "uppercase" }}>
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
                px: 2, py: 1.3, borderRadius: 2, mb: 0.5, cursor: "pointer",
                bgcolor: isActive ? "#e8f5e9" : "transparent",
                borderLeft: isActive ? "3px solid #2e7d32" : "3px solid transparent",
                transition: "all 0.18s",
                "& .nav-icon": { color: isActive ? "#2e7d32" : "#aaa" },
                "&:hover": { bgcolor: "#f1f8f1", borderLeftColor: "#a5d6a7", "& .nav-icon": { color: "#2e7d32" } },
              }}>
                <Box className="nav-icon" sx={{ display: "flex", alignItems: "center" }}>{item.icon}</Box>
                <Typography fontSize="0.88rem" fontWeight={isActive ? 700 : 400} color={isActive ? "#1b5e20" : "#555"}>
                  {item.label}
                </Typography>
                {isActive && <Box sx={{ ml: "auto", width: 6, height: 6, borderRadius: "50%", bgcolor: "#2e7d32" }} />}
              </Box>
            </Link>
          );
        })}
      </Box>

      {/* Divider */}
      <Box sx={{ mx: 3, borderTop: "1px solid #f0f0f0", mb: 1.5 }} />

      {/* View Site */}
      <Box sx={{ px: 2, mb: 0.5 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Box sx={{
            display: "flex", alignItems: "center", gap: 1.5,
            px: 2, py: 1.3, borderRadius: 2, cursor: "pointer",
            transition: "all 0.18s",
            "&:hover": { bgcolor: "#f1f8f1" },
          }}>
            <OpenInNewIcon sx={{ color: "#aaa", fontSize: "1.1rem" }} />
            <Typography fontSize="0.88rem" color="#777">View Site</Typography>
          </Box>
        </Link>
      </Box>

      {/* Logout */}
      <Box sx={{ px: 2, pb: 3 }}>
        <Box onClick={handleLogout} sx={{
          display: "flex", alignItems: "center", gap: 1.5,
          px: 2, py: 1.3, borderRadius: 2, cursor: "pointer",
          transition: "all 0.18s",
          "&:hover": { bgcolor: "#ffebee" },
        }}>
          <LogoutIcon sx={{ color: "#e53935", fontSize: "1.1rem" }} />
          <Typography fontSize="0.88rem" color="#e53935">Logout</Typography>
        </Box>
      </Box>

      {/* Bottom info */}
      <Box sx={{ px: 3, pb: 2.5, borderTop: "1px solid #f5f5f5", pt: 2 }}>
        <Typography fontSize="0.65rem" color="#ccc" lineHeight={1.8}>
          © 2026 PTA BaganBari Resort<br />Admin v1.0
        </Typography>
      </Box>
    </Box>
  );

  const currentPage = NAV_ITEMS.find(n => n.href === router.pathname);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>

      {/* Desktop Sidebar */}
      <Box sx={{ display: { xs: "none", md: "block" }, flexShrink: 0, width: SIDEBAR_WIDTH }}>
        {SidebarContent}
      </Box>

      {/* Mobile Drawer */}
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { bgcolor: "transparent", boxShadow: "none" } }}
        sx={{ display: { xs: "block", md: "none" } }}>
        {SidebarContent}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <Box sx={{
          bgcolor: "#fff", px: { xs: 2, md: 3 }, py: 1.5,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid #e8f5e9",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          flexShrink: 0,
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton sx={{ display: { xs: "flex", md: "none" }, color: "#2e7d32", p: 0.5 }}
              onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Box>
              <Typography fontWeight={700} color="#1a2e1a" fontSize="0.95rem">
                {currentPage?.label || "Admin"}
              </Typography>
              <Typography fontSize="0.7rem" color="#bbb">
                PTA BaganBari Resort Management
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={<FiberManualRecordIcon sx={{ fontSize: "0.6rem !important", color: "#2e7d32 !important" }} />}
            label="Online"
            size="small"
            sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", border: "1px solid #a5d6a7", fontSize: "0.72rem", fontWeight: 700 }}
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
