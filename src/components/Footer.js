import { Box, Typography, Grid, Container } from "@mui/material";
import Link from "next/link";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "#0d1a0d", color: "#fff", pt: 6, pb: 3, mt: "auto" }}>
      <Container>
        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} md={4}>
            <Typography fontWeight="bold" fontSize="1.2rem" color="#a5d6a7" mb={1}>
              🌿 PTA BaganBari Resort
            </Typography>
            <Typography color="rgba(255,255,255,0.55)" fontSize="0.88rem" lineHeight={1.8}>
              A peaceful eco-tourism destination nestled in the heart of nature. Come experience the beauty of Bangladesh's village life.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography fontWeight="bold" mb={1} color="#a5d6a7">Quick Links</Typography>
            {[
              { label: "Home", href: "/" },
              { label: "About Us", href: "/about" },
              { label: "Gallery", href: "/gallery" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ textDecoration: "none" }}>
                <Typography
                  fontSize="0.88rem"
                  color="rgba(255,255,255,0.6)"
                  sx={{ mb: 0.5, cursor: "pointer", "&:hover": { color: "#a5d6a7" } }}
                >
                  → {l.label}
                </Typography>
              </Link>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography fontWeight="bold" mb={1} color="#a5d6a7">Contact</Typography>
            <Typography fontSize="0.88rem" color="rgba(255,255,255,0.6)" lineHeight={2}>
              📍 Baganbari, Bangladesh<br />
              📞 +880 1700-000000<br />
              ✉️ info@ptabaganbari.com
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", pt: 3, textAlign: "center" }}>
          <Typography color="rgba(255,255,255,0.4)" fontSize="0.82rem">
            © 2026 PTA BaganBari Resort. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
