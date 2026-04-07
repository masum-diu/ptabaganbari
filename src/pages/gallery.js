import Head from "next/head";
import { useState } from "react";
import { Box, Container, Typography, Chip, Grid } from "@mui/material";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", label: "Mountain View",   cat: "Nature" },
  { src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80", label: "Green Valley",    cat: "Nature" },
  { src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80", label: "Lake Sunrise",    cat: "Water" },
  { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80", label: "Forest Trail",    cat: "Nature" },
  { src: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80", label: "Waterfall",       cat: "Water" },
  { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", label: "Hilltop",         cat: "Nature" },
  { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80", label: "Riverside Camp",  cat: "Activities" },
  { src: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80", label: "Campfire Night",  cat: "Activities" },
  { src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", label: "Boat Ride",       cat: "Water" },
  { src: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80", label: "Village Path",    cat: "Village" },
  { src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80", label: "Local Farm",      cat: "Village" },
  { src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80", label: "Misty Forest",    cat: "Nature" },
];

const CATS = ["All", "Nature", "Water", "Activities", "Village"];

export default function Gallery() {
  const [active, setActive]     = useState("All");
  const [lightbox, setLightbox] = useState(null);

  const filtered = active === "All" ? PHOTOS : PHOTOS.filter((p) => p.cat === active);

  return (
    <Box>
      <Head>
        <title>Photo Gallery — PTA BaganBari Resort</title>
        <meta name="description" content="Explore the beauty of PTA BaganBari Resort through our photo gallery. Nature trails, waterfalls, camping spots and village life in Kasba, Brahmanbaria." />
        <meta name="keywords" content="PTA BaganBari gallery, resort photos Bangladesh, nature photography, Brahmanbaria" />
        <meta property="og:title" content="Photo Gallery — PTA BaganBari Resort" />
        <meta property="og:description" content="Browse stunning photos of PTA BaganBari Resort — nature, water, activities and village life." />
        <meta name="robots" content="index, follow" />
      </Head>
      {/* ── PAGE HERO ── */}
      <Box sx={{ position: "relative", height: 340, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Box component="img"
          src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1600&q=85"
          alt="gallery hero"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,0,0,0.35),rgba(0,40,0,0.75))", zIndex: 1 }} />
        <Box sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <Chip label="📸 Visual Journey"
            sx={{ bgcolor: "rgba(165,214,167,0.18)", color: "primary.light", border: "1px solid rgba(165,214,167,0.4)", mb: 2 }}
          />
          <Typography variant="h3" color="#fff" sx={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            Photo Gallery
          </Typography>
          <Typography color="rgba(255,255,255,0.8)" mt={1.5} fontSize="1.05rem">
            Explore the beauty of PTA BaganBari through our lens
          </Typography>
        </Box>
      </Box>

      {/* ── FILTER + GRID ── */}
      <Box sx={{ bgcolor: "background.default", py: 8 }}>
        <Container maxWidth="lg">
          {/* Category Filter */}
          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap", mb: 6 }}>
            {CATS.map((cat) => (
              <Chip key={cat} label={cat} onClick={() => setActive(cat)}
                color={active === cat ? "primary" : "default"}
                variant={active === cat ? "filled" : "outlined"}
                sx={{
                  px: 2, cursor: "pointer",
                  borderColor: "primary.main",
                  color: active === cat ? "#fff" : "primary.main",
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: active === cat ? "primary.dark" : "secondary.dark" },
                }}
              />
            ))}
          </Box>

          {/* Photo Grid */}
          <Grid container spacing={2}>
            {filtered.map((photo, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Box onClick={() => setLightbox(photo)} sx={{
                  position: "relative", borderRadius: 2, overflow: "hidden",
                  cursor: "pointer", height: 240,
                  "&:hover img": { transform: "scale(1.08)" },
                  "&:hover .overlay": { opacity: 1 },
                }}>
                  <Box component="img" src={photo.src} alt={photo.label}
                    sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                  />
                  <Box className="overlay" sx={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top,rgba(0,40,0,0.82) 0%,rgba(0,0,0,0.1) 60%)",
                    opacity: 0, transition: "opacity 0.3s",
                    display: "flex", flexDirection: "column", justifyContent: "flex-end", p: 2,
                  }}>
                    <Typography color="#fff" fontWeight={700}>{photo.label}</Typography>
                    <Chip label={photo.cat} size="small" color="primary"
                      sx={{ width: "fit-content", mt: 0.5, fontSize: "0.72rem" }}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Typography textAlign="center" color="text.secondary" mt={5} fontSize="0.85rem">
            Showing {filtered.length} of {PHOTOS.length} photos
          </Typography>
        </Container>
      </Box>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <Box onClick={() => setLightbox(null)} sx={{
          position: "fixed", inset: 0, bgcolor: "rgba(0,0,0,0.93)",
          zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "zoom-out", p: 2,
        }}>
          <Box sx={{ position: "relative", maxWidth: 900, width: "100%" }}>
            <Box component="img" src={lightbox.src} alt={lightbox.label}
              sx={{ width: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: 2 }}
            />
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography color="#fff" fontWeight={700} fontSize="1.1rem">{lightbox.label}</Typography>
              <Chip label={lightbox.cat} size="small" color="primary" sx={{ mt: 1 }} />
            </Box>
            <Typography sx={{ position: "absolute", top: -36, right: 0, color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>
              Click anywhere to close ✕
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
