import { Box, Container, Typography, Grid, Chip, Divider } from "@mui/material";

const STATS = [
  { num: "5000+", label: "Happy Visitors" },
  { num: "12+",   label: "Years of Experience" },
  { num: "50+",   label: "Eco Activities" },
  { num: "4.9★",  label: "Average Rating" },
];

const TEAM = [
  { name: "Rahim Uddin",    role: "Resort Manager",   img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { name: "Fatema Begum",   role: "Guest Relations",  img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" },
  { name: "Karim Hossain",  role: "Eco Tour Guide",   img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80" },
];

const VALUES = [
  { icon: "🌱", title: "Eco Friendly",         desc: "We protect and preserve the natural environment in everything we do." },
  { icon: "🤝", title: "Community First",       desc: "Supporting local families and artisans through sustainable tourism." },
  { icon: "🏡", title: "Authentic Experience",  desc: "Genuine village life, culture, and traditions for every visitor." },
  { icon: "🔒", title: "Safe & Secure",         desc: "Your safety and comfort is our highest priority at all times." },
];

export default function About() {
  return (
    <Box>
      {/* ── PAGE HERO ── */}
      <Box sx={{ position: "relative", height: 360, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Box component="img"
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=85"
          alt="about hero"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,0,0,0.35),rgba(0,40,0,0.78))", zIndex: 1 }} />
        <Box sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <Chip label="Our Story"
            sx={{ bgcolor: "rgba(165,214,167,0.18)", color: "primary.light", border: "1px solid rgba(165,214,167,0.4)", mb: 2 }}
          />
          <Typography variant="h3" color="#fff" sx={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            About PTA BaganBari
          </Typography>
          <Typography color="rgba(255,255,255,0.8)" mt={1.5} fontSize="1.05rem">
            A journey rooted in nature, culture & community
          </Typography>
        </Box>
      </Box>

      {/* ── STORY ── */}
      <Box sx={{ bgcolor: "background.default", py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={7} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: "relative" }}>
                <Box component="img"
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=85"
                  alt="nature"
                  sx={{ width: "100%", borderRadius: 4, boxShadow: "0 12px 48px rgba(0,0,0,0.15)" }}
                />
                <Box sx={{
                  position: "absolute", bottom: -20, right: -20,
                  background: "linear-gradient(135deg,#1b5e20,#2e7d32)",
                  color: "#fff", borderRadius: 4, px: 3, py: 2,
                  boxShadow: "0 8px 24px rgba(46,125,50,0.4)", textAlign: "center",
                }}>
                  <Typography fontWeight={800} fontSize="1.6rem">5+</Typography>
                  <Typography fontSize="0.78rem">Years of Service</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Chip label="Who We Are" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h4" mb={3} lineHeight={1.3}>
                A Sanctuary of Nature<br />in the Heart of Bangladesh
              </Typography>
              <Typography color="text.secondary" lineHeight={2} mb={2.5}>
                PTA BaganBari Resort was founded with a single vision — to offer visitors an authentic, peaceful escape into Bangladesh's breathtaking natural landscape. Nestled among lush green forests and serene waterways, our resort is a place where time slows down.
              </Typography>
              <Typography color="text.secondary" lineHeight={2}>
                We believe in responsible tourism that benefits both our guests and the local community. Every visit supports local farmers, artisans, and families who call BaganBari home.
              </Typography>
              <Divider sx={{ my: 3, borderColor: "divider" }} />
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {["Eco Certified", "Community Owned", "Award Winning"].map((t) => (
                  <Typography key={t} fontSize="0.82rem" fontWeight={700} color="primary.main">✅ {t}</Typography>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── STATS ── */}
      <Box sx={{ background: "linear-gradient(135deg,#1b5e20,#2e7d32)", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {STATS.map((s) => (
              <Grid size={{ xs: 6, md: 3 }} key={s.label} sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="primary.light">{s.num}</Typography>
                <Typography color="rgba(255,255,255,0.75)" mt={0.5}>{s.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── VALUES ── */}
      <Box sx={{ bgcolor: "background.paper", py: 10 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={7}>
            <Chip label="Our Values" color="primary" sx={{ mb: 2 }} />
            <Typography variant="h4">What We Stand For</Typography>
          </Box>
          <Grid container spacing={4}>
            {VALUES.map((v) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={v.title}>
                <Box sx={{
                  p: 4, borderRadius: 4, border: "1.5px solid", borderColor: "divider",
                  textAlign: "center", height: "100%",
                  transition: "all 0.25s",
                  "&:hover": { boxShadow: "0 8px 32px rgba(46,125,50,0.12)", borderColor: "primary.light", transform: "translateY(-4px)" },
                }}>
                  <Typography fontSize="2.5rem" mb={2}>{v.icon}</Typography>
                  <Typography fontWeight={700} mb={1}>{v.title}</Typography>
                  <Typography color="text.secondary" fontSize="0.88rem" lineHeight={1.8}>{v.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── TEAM ── */}
      <Box sx={{ bgcolor: "background.default", py: 10 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={7}>
            <Chip label="Our People" color="primary" sx={{ mb: 2 }} />
            <Typography variant="h4">Meet the Team</Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {TEAM.map((member) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={member.name}>
                <Box sx={{
                  textAlign: "center", p: 4, borderRadius: 4,
                  bgcolor: "background.paper", boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                  border: "1.5px solid", borderColor: "divider",
                  transition: "all 0.25s",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 12px 40px rgba(46,125,50,0.14)", borderColor: "primary.light" },
                }}>
                  <Box component="img" src={member.img} alt={member.name}
                    sx={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "3px solid", borderColor: "primary.light", mb: 2 }}
                  />
                  <Typography fontWeight={700} fontSize="1.05rem">{member.name}</Typography>
                  <Typography color="primary.main" fontSize="0.85rem" fontWeight={600}>{member.role}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
