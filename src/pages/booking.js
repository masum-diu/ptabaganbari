import { useState } from "react";
import {
  Box, Container, Typography, TextField, Button,
  MenuItem, Chip, Divider, Alert, Grid,
} from "@mui/material";

const PRICE_PER_PERSON = 25;

function genBookingId() {
  return "BK-" + Date.now().toString().slice(-7);
}

export default function Booking() {
  const [form, setForm]       = useState({ name: "", phone: "", persons: 1 });
  const [errors, setErrors]   = useState({});
  const [confirmed, setConfirmed] = useState(null);

  const total = form.persons * PRICE_PER_PERSON;

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^01[3-9]\d{8}$/.test(form.phone)) e.phone = "Enter a valid BD number (e.g. 01XXXXXXXXX)";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setConfirmed({
      id: genBookingId(),
      name: form.name.trim(),
      phone: form.phone,
      persons: form.persons,
      total,
      date: new Date().toLocaleString("en-BD", { dateStyle: "full", timeStyle: "short" }),
    });
  }

  function handleReset() {
    setConfirmed(null);
    setForm({ name: "", phone: "", persons: 1 });
    setErrors({});
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>

      {/* ── PAGE HERO ── */}
      <Box sx={{ position: "relative", height: 280, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Box component="img"
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=85"
          alt="booking hero"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,40,0,0.78))", zIndex: 1 }} />
        <Box sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <Chip label="🎫 Online Booking"
            sx={{ bgcolor: "rgba(165,214,167,0.18)", color: "primary.light", border: "1px solid rgba(165,214,167,0.4)", mb: 2 }}
          />
          <Typography variant="h3" color="#fff" sx={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            Book Your Visit
          </Typography>
          <Typography color="rgba(255,255,255,0.8)" mt={1.5} fontSize="1.05rem">
            ৳{PRICE_PER_PERSON} per person — PTA BaganBari Resort
          </Typography>
        </Box>
      </Box>

      {/* ── CONTENT ── */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={5} justifyContent="center">

          {/* ── LEFT: FORM or TICKET ── */}
          <Grid size={{ xs: 12, md: 7 }}>
            {!confirmed ? (
              <Box sx={{ bgcolor: "background.paper", borderRadius: 4, boxShadow: "0 8px 40px rgba(46,125,50,0.10)", p: { xs: 3, md: 5 }, border: "1.5px solid", borderColor: "divider" }}>
                <Chip label="Visitor Details" color="primary" sx={{ mb: 2 }} />
                <Typography variant="h5" mb={0.5}>Fill in Your Details</Typography>
                <Typography color="text.secondary" fontSize="0.88rem" mb={4}>
                  Complete the form below to confirm your booking
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <TextField
                    label="Full Name"
                    placeholder="e.g. Rahim Uddin"
                    value={form.name}
                    onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: "" })); }}
                    error={!!errors.name}
                    helperText={errors.name}
                    fullWidth
                    InputProps={{ startAdornment: <Box sx={{ mr: 1 }}>👤</Box> }}
                  />
                  <TextField
                    label="Phone Number"
                    placeholder="e.g. 01712345678"
                    value={form.phone}
                    onChange={(e) => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: "" })); }}
                    error={!!errors.phone}
                    helperText={errors.phone || "Bangladesh mobile number"}
                    fullWidth
                    inputProps={{ maxLength: 11 }}
                    InputProps={{ startAdornment: <Box sx={{ mr: 1 }}>📞</Box> }}
                  />
                  <TextField
                    select
                    label="Number of Persons"
                    value={form.persons}
                    onChange={(e) => setForm(f => ({ ...f, persons: Number(e.target.value) }))}
                    fullWidth
                    InputProps={{ startAdornment: <Box sx={{ mr: 1 }}>👥</Box> }}
                  >
                    {[...Array(20)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? "Person" : "Persons"}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Price Summary */}
                  <Box sx={{ bgcolor: "secondary.dark", borderRadius: 3, p: 3, border: "1.5px solid", borderColor: "primary.light" }}>
                    <Typography fontWeight={700} mb={2} color="primary.main">💰 Price Summary</Typography>
                    {[
                      { label: "Price per person", value: `৳${PRICE_PER_PERSON}` },
                      { label: "Number of persons", value: `× ${form.persons}` },
                    ].map((r) => (
                      <Box key={r.label} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography color="text.secondary" fontSize="0.9rem">{r.label}</Typography>
                        <Typography fontWeight={600}>{r.value}</Typography>
                      </Box>
                    ))}
                    <Divider sx={{ my: 1.5, borderColor: "primary.light" }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography fontWeight={800} fontSize="1.05rem">Total Amount</Typography>
                      <Typography fontWeight={800} fontSize="1.4rem" color="primary.main">৳{total}</Typography>
                    </Box>
                  </Box>

                  <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ py: 1.6, fontSize: "1rem" }}>
                    ✅ Confirm Booking — ৳{total}
                  </Button>
                </Box>
              </Box>
            ) : (
              /* ── CONFIRMATION TICKET ── */
              <Box sx={{ bgcolor: "background.paper", borderRadius: 4, overflow: "hidden", boxShadow: "0 8px 40px rgba(46,125,50,0.18)", border: "2px solid", borderColor: "primary.light" }}>
                <Box sx={{ background: "linear-gradient(135deg,#1b5e20,#2e7d32)", py: 5, textAlign: "center" }}>
                  <Typography fontSize="3rem">🎉</Typography>
                  <Typography variant="h5" color="#fff" mt={1}>Booking Confirmed!</Typography>
                  <Typography color="rgba(255,255,255,0.8)" fontSize="0.88rem">Your ticket is ready — show at entrance</Typography>
                </Box>

                {/* ticket tear line */}
                <Box sx={{ display: "flex", alignItems: "center", mx: 0 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "background.default", ml: -1.2 }} />
                  <Box sx={{ flex: 1, borderTop: "2.5px dashed", borderColor: "primary.light" }} />
                  <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "background.default", mr: -1.2 }} />
                </Box>

                <Box sx={{ px: { xs: 3, md: 5 }, py: 4 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography color="text.secondary" fontSize="0.78rem" fontWeight={700} letterSpacing={1}>BOOKING ID</Typography>
                    <Typography fontWeight={800} color="primary.main">{confirmed.id}</Typography>
                  </Box>
                  <Divider sx={{ mb: 2, borderColor: "divider" }} />
                  {[
                    { label: "👤 Name",    value: confirmed.name },
                    { label: "📞 Phone",   value: confirmed.phone },
                    { label: "👥 Persons", value: `${confirmed.persons} ${confirmed.persons === 1 ? "Person" : "Persons"}` },
                    { label: "📅 Date",    value: confirmed.date },
                  ].map((row) => (
                    <Box key={row.label} sx={{ display: "flex", justifyContent: "space-between", py: 1.3, borderBottom: "1px solid", borderColor: "divider" }}>
                      <Typography color="text.secondary" fontSize="0.88rem">{row.label}</Typography>
                      <Typography fontWeight={600} fontSize="0.92rem">{row.value}</Typography>
                    </Box>
                  ))}
                  <Box sx={{ mt: 3, bgcolor: "secondary.dark", borderRadius: 3, p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1.5px solid", borderColor: "primary.light" }}>
                    <Typography fontWeight={800} fontSize="1.05rem">Total Paid</Typography>
                    <Typography fontWeight={800} fontSize="1.8rem" color="primary.main">৳{confirmed.total}</Typography>
                  </Box>
                  <Alert severity="success" sx={{ mt: 3, borderRadius: 3 }}>
                    Please show this ticket at the entrance gate. Enjoy your visit! 🌿
                  </Alert>
                  <Button onClick={handleReset} variant="outlined" color="primary" fullWidth sx={{ mt: 3, py: 1.4 }}>
                    + Book Another Ticket
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>

          {/* ── RIGHT: INFO PANEL ── */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Why Visit */}
              <Box sx={{ bgcolor: "background.paper", borderRadius: 4, p: 4, border: "1.5px solid", borderColor: "divider", boxShadow: "0 4px 20px rgba(46,125,50,0.07)" }}>
                <Chip label="Why Visit Us?" color="primary" sx={{ mb: 2 }} />
                <Typography variant="h6" mb={2}>What's Included</Typography>
                {[
                  { icon: "🌿", text: "Full day access to all nature trails" },
                  { icon: "🏕️", text: "Picnic & camping area access" },
                  { icon: "📸", text: "Scenic photography spots" },
                  { icon: "🍃", text: "Guided eco walk" },
                  { icon: "🅿️", text: "Free parking on premises" },
                ].map((item) => (
                  <Box key={item.text} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
                    <Typography fontSize="1.2rem">{item.icon}</Typography>
                    <Typography fontSize="0.88rem" color="text.secondary">{item.text}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Pricing Info */}
              <Box sx={{ background: "linear-gradient(135deg,#1b5e20,#2e7d32)", borderRadius: 4, p: 4, color: "#fff" }}>
                <Typography fontWeight={700} fontSize="0.85rem" sx={{ opacity: 0.8, mb: 1, letterSpacing: 1 }}>TICKET PRICE</Typography>
                <Typography variant="h2" color="primary.light">৳{PRICE_PER_PERSON}</Typography>
                <Typography sx={{ opacity: 0.85, mt: 0.5 }}>per person</Typography>
                <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />
                <Typography fontSize="0.85rem" sx={{ opacity: 0.8 }}>
                  🕐 Open: Sat–Thu 8AM–6PM<br />
                  📍 Loxmipur PTA Baganbari, Kasba, Brahmanbaria, Bangladesh
                </Typography>
              </Box>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
