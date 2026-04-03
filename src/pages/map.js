import Head from "next/head";
import { Box, Container, Typography, Grid, Chip, Button } from "@mui/material";

const INFO = [
  { icon: "📍", title: "Address",       desc: "Loxmipur PTA Baganbari, Kasba, Brahmanbaria, Bangladesh" },
  { icon: "🕐", title: "Opening Hours", desc: "Saturday – Thursday: 8:00 AM – 6:00 PM\nFriday: 2:00 PM – 6:00 PM" },
  { icon: "📞", title: "Phone",         desc: "+880 1700-000000\n+880 1800-000000" },
  { icon: "✉️", title: "Email",         desc: "info@ptabaganbari.com" },
];

const HOW_TO_REACH = [
  { icon: "🚌", mode: "By Bus",      desc: "Take a bus from Brahmanbaria town to Kasba, then local CNG to Baganbari (approx. 30 min)" },
  { icon: "🚗", mode: "By Car",      desc: "From Brahmanbaria city center, take the Kasba road. Follow signs to PTA Baganbari (15 km)" },
  { icon: "🛺", mode: "By CNG/Auto", desc: "Available from Kasba bus stand directly to the resort gate (10–15 min)" },
];

const LANDMARKS = [
  { place: "Kasba Bus Stand",      dist: "~3 km",  icon: "🚌" },
  { place: "Brahmanbaria Town",    dist: "~15 km", icon: "🏙️" },
  { place: "Titas River",          dist: "~5 km",  icon: "🌊" },
  { place: "Brahmanbaria Airport", dist: "~18 km", icon: "✈️" },
  { place: "Local Market",         dist: "~2 km",  icon: "🛒" },
  { place: "Nearest Hospital",     dist: "~8 km",  icon: "🏥" },
];

export default function MapPage() {
  return (
    <Box>
      <Head>
        <title>Location — PTA BaganBari Resort, Kasba, Brahmanbaria</title>
        <meta name="description" content="Find PTA BaganBari Resort on the map. Located in Loxmipur, Kasba, Brahmanbaria, Bangladesh. Get directions, contact info and opening hours." />
        <meta name="keywords" content="PTA BaganBari location, Kasba Brahmanbaria map, resort directions Bangladesh" />
        <meta property="og:title" content="Location — PTA BaganBari Resort" />
        <meta property="og:description" content="Find us at Loxmipur PTA Baganbari, Kasba, Brahmanbaria, Bangladesh." />
        <meta name="robots" content="index, follow" />
      </Head>
      {/* ── PAGE HERO ── */}
      <Box sx={{ position: "relative", height: 300, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Box component="img"
          src="https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=1600&q=85"
          alt="map hero"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,0,0,0.35),rgba(0,40,0,0.78))", zIndex: 1 }} />
        <Box sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <Chip label="📍 Find Us"
            sx={{ bgcolor: "rgba(165,214,167,0.18)", color: "primary.light", border: "1px solid rgba(165,214,167,0.4)", mb: 2 }}
          />
          <Typography variant="h3" color="#fff" sx={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            Our Location
          </Typography>
          <Typography color="rgba(255,255,255,0.8)" mt={1.5} fontSize="1.05rem">
            Loxmipur PTA Baganbari, Kasba, Brahmanbaria — Bangladesh
          </Typography>
        </Box>
      </Box>

      {/* ── MAP + INFO ── */}
      <Box sx={{ bgcolor: "background.default", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>

            {/* Google Map */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.12)", border: "2px solid", borderColor: "primary.light", height: 480 }}>
                <iframe
                  title="PTA BaganBari Resort Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7305.31412022308!2d91.12535930803425!3d23.723937674619588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375473005b976c95%3A0x274d1ebe6829dc8d!2z4Kay4KaV4KeN4Ka34KeA4Kaq4KeB4KawIOCmrOCmvuCml-CmvuCmqOCmrOCmvuCnnOCngA!5e0!3m2!1sen!2sbd!4v1774866059712!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                href="https://www.google.com/maps/place/%E0%A6%B2%E0%A6%95%E0%A7%8D%E0%A6%B7%E0%A7%80%E0%A6%AA%E0%A7%81%E0%A6%B0+%E0%A6%AC%E0%A6%BE%E0%A6%97%E0%A6%BE%E0%A6%A8%E0%A6%AC%E0%A6%BE%E0%A7%9C%E0%A7%80/@23.7239377,91.1253593,16z"
                target="_blank"
                sx={{ mt: 2, py: 1.4 }}
              >
                🗺️ Open in Google Maps
              </Button>
            </Grid>

            {/* Info Cards */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {INFO.map((item) => (
                  <Box key={item.title} sx={{
                    bgcolor: "background.paper", borderRadius: 2, p: 3,
                    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                    border: "1.5px solid", borderColor: "divider",
                    transition: "all 0.2s",
                    "&:hover": { borderColor: "primary.light", boxShadow: "0 4px 24px rgba(46,125,50,0.12)" },
                  }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      <Box sx={{
                        width: 44, height: 44, borderRadius: 2,
                        bgcolor: "secondary.dark", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: "1.3rem", flexShrink: 0,
                      }}>
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography fontWeight={700} fontSize="0.9rem" color="primary.main" mb={0.5}>
                          {item.title}
                        </Typography>
                        <Typography fontSize="0.85rem" color="text.secondary" sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
                          {item.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

     

      
    </Box>
  );
}
