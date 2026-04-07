import Head from "next/head";
import {
  Box, Container, Typography, Button,
  Grid, Card, CardContent, CardActions, Chip,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import Link from "next/link";

const TICKETS = [
  { title: "Single Ticket",   price: "৳25",  desc: "1 person entry, full day access",           badge: "Popular",    icon: "🎫", color: "primary.main" },
  { title: "Family Package",  price: "৳100", desc: "Up to 5 members, picnic area & bonfire",    badge: "Best Value", icon: "👨‍👩‍👧‍👦", color: "#1565c0" },
  { title: "VIP Ticket",      price: "৳200", desc: "Priority entry + guided tour + lunch",      badge: "Premium",    icon: "👑", color: "#6a1b9a" },
];

const FEATURES = [
  { icon: "🌄", label: "Scenic Views" },
  { icon: "🏕️", label: "Camping Spots" },
  // { icon: "🚣", label: "Boat Rides" },
  { icon: "🍃", label: "Eco Trails" },
];

export default function Home() {
  return (
    <Box>
      <Head>
        <title>PTA Agro Park — Eco Tourism in Brahmanbaria, Bangladesh</title>
        <meta name="description" content="Visit PTA Agro Park in Kasba, Brahmanbaria. Enjoy eco trails, camping, scenic views and nature activities. Book your ticket online for just ৳25 per person." />
        <meta name="keywords" content="PTA BaganBari, resort Bangladesh, eco tourism, Brahmanbaria, Kasba resort, nature resort, book ticket" />
        <meta property="og:title" content="PTA Agro Park — Eco Tourism Bangladesh" />
        <meta property="og:description" content="Escape the city and explore green trails at PTA Agro Park, Kasba, Brahmanbaria." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Head>
      {/* ── HERO ── */}
      <Box sx={{ height: "92vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden" }}>
        <Box component="img"
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90"
          alt="hero"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(0,0,0,0.3) 0%,rgba(0,30,0,0.78) 100%)", zIndex: 1 }} />
        <Box sx={{ position: "relative", zIndex: 2, px: 3, maxWidth: 750 }}>
          <Chip label="🌿 Eco Tourism Destination — Bangladesh"
            sx={{ bgcolor: "rgba(165,214,167,0.18)", color: "primary.light", mb: 3, border: "1px solid rgba(165,214,167,0.4)", backdropFilter: "blur(8px)" }}
          />
          <Typography variant="h2" color="#fff"
            sx={{ textShadow: "0 4px 24px rgba(0,0,0,0.5)", lineHeight: 1.15, fontSize: { xs: "2rem", md: "3.2rem" } }}>
            Welcome to<br />
            <Box component="span" sx={{ color: "primary.light" }}>PTA Agro</Box> Park
          </Typography>
          <Typography sx={{ mt: 2.5, color: "rgba(255,255,255,0.82)", fontSize: "1.1rem", maxWidth: 560, mx: "auto" }}>
            Escape the city — breathe fresh air, explore green trails, and create memories that last a lifetime.
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap", mt: 4 }}>
            {FEATURES.map((f) => (
              <Box key={f.label} sx={{ bgcolor: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", color: "#fff", px: 2, py: 0.8, borderRadius: 5, fontSize: "0.85rem", border: "1px solid rgba(255,255,255,0.2)" }}>
                {f.icon} {f.label}
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 5, display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/booking" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary" size="large" startIcon={<ConfirmationNumberIcon />} sx={{ px: 5, fontSize: "1rem" }}>
                 Book Ticket
              </Button>
            </Link>
            <Link href="/gallery" style={{ textDecoration: "none" }}>
              <Button variant="outlined" size="large"
                sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.6)", px: 5, "&:hover": { borderColor: "primary.light", color: "primary.light" } }}>
                📸 View Gallery
              </Button>
            </Link>
          </Box>
        </Box>
        <Box sx={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 2, color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", textAlign: "center" }}>
          <Box sx={{ width: 1.5, height: 40, bgcolor: "rgba(255,255,255,0.3)", mx: "auto", mb: 0.5, borderRadius: 1 }} />
          scroll
        </Box>
      </Box>

     
    </Box>
  );
}
