// ./src/pages/booking.js
import Head from "next/head";
import { useState } from "react";
import {
  Box, Container, Typography, TextField, Button,
  MenuItem, Chip, Divider, Alert, Grid, CircularProgress,
} from "@mui/material";
import supabase from "@/lib/supabase";

const PRICE_PER_PERSON = 50;

// Generate unique booking ID
function genBookingId() {
  return "BK-" + Date.now().toString().slice(-7);
}

export default function Booking() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    persons: 1,
    payment: { bkashNumber: "", trxID: "" },
  });
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(null);
  const [loading, setLoading] = useState(false);

  const total = form.persons * PRICE_PER_PERSON;

  // Form validation
  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^01[3-9]\d{8}$/.test(form.phone)) e.phone = "Enter a valid BD number (e.g. 01XXXXXXXXX)";
    if (!/^01[3-9]\d{8}$/.test(form.payment.bkashNumber)) e.bkashNumber = "Enter a valid bKash number";
    if (!form.payment.trxID.trim()) e.trxID = "Transaction ID is required";
    return e;
  }

  // Submit handler
  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }

    setLoading(true);
    const now = new Date();
    const ticket = {
      id: genBookingId(),
      name: form.name.trim(),
      phone: form.phone,
      persons: form.persons,
      total,
      date: now.toLocaleString("en-BD", { dateStyle: "full", timeStyle: "short" }),
      timestamp: now.toISOString(),
      used: false,
      used_at: null,
      bkash_number: form.payment.bkashNumber,
      trx_id: form.payment.trxID,
      status: "pending",
    };

    // Insert into Supabase
    const { error } = await supabase.from("bookings").insert([ticket]);
    setLoading(false);

    if (error) {
      console.error("Supabase insert error:", error);
      setErrors({ submit: error.message || "Booking failed. Please try again." });
      return;
    }

    setConfirmed(ticket);
  }

  // Reset form
  function handleReset() {
    setConfirmed(null);
    setForm({ name: "", phone: "", persons: 1, payment: { bkashNumber: "", trxID: "" } });
    setErrors({});
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Head>
        <title>Book a Ticket — PTA Agro Park</title>
        <meta name="description" content="Book your visit to PTA Agro Park online. Only ৳25 per person. Fill in your details and pay via bKash to confirm your ticket instantly." />
        <meta name="keywords" content="book ticket PTA BaganBari, resort booking Bangladesh, bKash payment, Brahmanbaria resort ticket" />
        <meta property="og:title" content="Book a Ticket — PTA Agro Park" />
        <meta property="og:description" content="Book your resort visit online for just ৳25 per person. Pay via bKash." />
        <meta name="robots" content="index, follow" />
      </Head>

      {/* HERO */}
      <Box sx={{ position: "relative", height: { xs: 180, md: 280 }, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Box component="img"
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=85"
          alt="booking hero"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,40,0,0.78))", zIndex: 1 }} />
        <Box sx={{ position: "relative", zIndex: 2, textAlign: "center", px: 2 }}>
          <Typography variant="h4" color="#fff" fontWeight={800} sx={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)", fontSize: { xs: "1.5rem", md: "2.5rem" } }}>
            🌿 Book Your Visit
          </Typography>
          <Typography color="rgba(255,255,255,0.85)" mt={1} fontSize={{ xs: "0.88rem", md: "1.05rem" }}>
            ৳{PRICE_PER_PERSON} per person — PTA Agro Park
          </Typography>
        </Box>
      </Box>

      {/* CONTENT */}
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1.5, md: 3 } }}>

        {/* Price + Info bar */}
        <Box sx={{
          background: "linear-gradient(135deg,#1b5e20,#2e7d32)",
          borderRadius: 2, mb: { xs: 2, md: 3 }, overflow: "hidden",
          boxShadow: "0 4px 20px rgba(46,125,50,0.25)",
        }}>
          <Box sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 2, md: 2.5 }, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
            {/* left */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: { xs: 48, md: 56 }, height: { xs: 48, md: 56 }, borderRadius: 2, bgcolor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: { xs: "1.5rem", md: "1.8rem" }, flexShrink: 0 }}>
                🎫
              </Box>
              <Box>
                <Typography fontSize="0.68rem" color="rgba(255,255,255,0.65)" letterSpacing={1.5} fontWeight={700}>ENTRY TICKET</Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                  <Typography fontWeight={900} fontSize={{ xs: "2rem", md: "2.4rem" }} color="#fff" lineHeight={1}>৳{PRICE_PER_PERSON}</Typography>
                  <Typography fontSize="0.8rem" color="rgba(255,255,255,0.7)">/person</Typography>
                </Box>
              </Box>
            </Box>
            {/* right — info pills */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
              {[
                // { icon: "🕐", text: "Sat–Thu  8AM – 6PM" },
                { icon: "📍", text: "Loxmipur, Kasba, Brahmanbaria" },
              ].map(r => (
                <Box key={r.text} sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "rgba(255,255,255,0.12)", borderRadius: 5, px: 1.5, py: 0.4 }}>
                  <Typography fontSize="0.75rem">{r.icon}</Typography>
                  <Typography fontSize="0.72rem" color="rgba(255,255,255,0.9)" fontWeight={600}>{r.text}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          {/* bottom accent strip */}
          <Box sx={{ height: 4, background: "linear-gradient(90deg,#a5d6a7,#66bb6a,#a5d6a7)" }} />
        </Box>

        <Grid container spacing={{ xs: 2, md: 4 }}>

          {/* FORM / CONFIRMATION */}
          <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 2, md: 1 } }}>
            {!confirmed ? (
              <Box sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: "0 4px 20px rgba(46,125,50,0.08)", p: { xs: 2, md: 4 }, border: "1.5px solid", borderColor: "divider" }}>
                <Typography variant="h6" fontWeight={800} mb={0.5} fontSize={{ xs: "1rem", md: "1.25rem" }}>Fill in Your Details</Typography>
                <Typography color="text.secondary" fontSize="0.82rem" mb={2.5}>
                  Complete the form below to confirm your booking
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField size="small"
                    label="Full Name" placeholder="e.g. Rahim Uddin"
                    value={form.name}
                    onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: "" })); }}
                    error={!!errors.name} helperText={errors.name}
                    fullWidth
                    InputProps={{ startAdornment: <Box sx={{ mr: 1 }}>👤</Box> }}
                  />
                  <TextField size="small"
                    label="Phone Number" placeholder="e.g. 01712345678"
                    value={form.phone}
                    onChange={(e) => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: "" })); }}
                    error={!!errors.phone} helperText={errors.phone || "Bangladesh mobile number"}
                    fullWidth inputProps={{ maxLength: 11 }}
                    InputProps={{ startAdornment: <Box sx={{ mr: 1 }}>📞</Box> }}
                  />
                  <TextField size="small" select
                    label="Number of Persons"
                    value={form.persons}
                    onChange={(e) => setForm(f => ({ ...f, persons: Number(e.target.value) }))}
                    fullWidth
                    InputProps={{ startAdornment: <Box sx={{ mr: 1 }}>👥</Box> }}
                    SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: 200 } } } }}
                  >
                    {[...Array(20)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>{i + 1} {i === 0 ? "Person" : "Persons"}</MenuItem>
                    ))}
                  </TextField>
                  <TextField size="small"
                    label="bKash Send Money Number" placeholder="e.g. 017XXXXXXXX"
                    value={form.payment.bkashNumber}
                    onChange={(e) => setForm(f => ({ ...f, payment: { ...f.payment, bkashNumber: e.target.value } }))}
                    error={!!errors.bkashNumber} helperText={errors.bkashNumber || "Number used to send payment"}
                    fullWidth
                    InputProps={{ startAdornment: <Box sx={{ mr: 1 }}>💸</Box> }}
                  />
                  <TextField size="small"
                    label="Transaction ID (trxID)" placeholder="e.g. TX123456789"
                    value={form.payment.trxID}
                    onChange={(e) => setForm(f => ({ ...f, payment: { ...f.payment, trxID: e.target.value } }))}
                    error={!!errors.trxID} helperText={errors.trxID || "bKash transaction ID"}
                    fullWidth
                    InputProps={{ startAdornment: <Box sx={{ mr: 1 }}>🔑</Box> }}
                  />

                  {/* Price Summary */}
                  <Box sx={{ bgcolor: "secondary.dark", borderRadius: 2, p: 2, border: "1.5px solid", borderColor: "primary.light" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography color="text.secondary" fontSize="0.85rem">৳{PRICE_PER_PERSON} × {form.persons} person{form.persons > 1 ? "s" : ""}</Typography>
                      <Typography fontWeight={800} fontSize="1.2rem" color="primary.main">৳{total}</Typography>
                    </Box>
                    <Typography fontSize="0.75rem" color="text.secondary">Total Amount</Typography>
                  </Box>

                  {errors.submit && <Alert severity="error" sx={{ borderRadius: 2 }}>{errors.submit}</Alert>}
                  <Button type="submit" variant="contained" color="primary" size="large" fullWidth
                    sx={{ py: { xs: 1.3, md: 1.6 }, fontSize: "1rem", fontWeight: 800 }} disabled={loading}>
                    {loading ? <CircularProgress size={22} color="inherit" /> : `✅ Confirm Booking — ৳${total}`}
                  </Button>
                </Box>
              </Box>
            ) : (
              // CONFIRMATION TICKET
              <Box sx={{ bgcolor: "background.paper", borderRadius: 2, overflow: "hidden", boxShadow: "0 8px 40px rgba(46,125,50,0.18)", border: "2px solid", borderColor: "primary.light" }}>
                <Box sx={{ background: "linear-gradient(135deg,#1b5e20,#2e7d32)", py: 5, textAlign: "center" }}>
                  <Typography fontSize="3rem">🎉</Typography>
                  <Typography variant="h5" color="#fff" mt={1}>Booking Confirmed!</Typography>
                  <Typography color="rgba(255,255,255,0.8)" fontSize="0.88rem">Your ticket is ready — show at entrance</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mx: 0 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "background.default", ml: -1.2 }} />
                  <Box sx={{ flex: 1, borderTop: "2.5px dashed", borderColor: "primary.light" }} />
                  <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "background.default", mr: -1.2 }} />
                </Box>

                <Box sx={{ px: { xs: 3, md: 5 }, py: 4 }}>
                  {[ 
                    { label: "👤 Name", value: confirmed.name },
                    { label: "📞 Phone", value: confirmed.phone },
                    { label: "👥 Persons", value: `${confirmed.persons} ${confirmed.persons === 1 ? "Person" : "Persons"}` },
                    { label: "📅 Date", value: confirmed.date },
                    { label: "💸 bKash Number", value: confirmed.bkash_number },
                    { label: "🔑 Transaction ID", value: confirmed.trx_id },
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

          {/* INFO PANEL */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 1, md: 2 } }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

              {/* ── PAYMENT INSTRUCTION ── */}
              <Box sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 24px rgba(229,57,53,0.12)", border: "2px solid #f48fb1" }}>
                <Box sx={{ background: "linear-gradient(135deg,#e91e63,#c2185b)", px: 2.5, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography fontSize="1.4rem">💸</Typography>
                  <Box>
                    <Typography fontWeight={800} color="#fff" fontSize="0.95rem">Payment Instructions</Typography>
                    <Typography color="rgba(255,255,255,0.8)" fontSize="0.72rem">Send money before booking</Typography>
                  </Box>
                </Box>
                <Box sx={{ bgcolor: "#fff", p: { xs: 2, md: 3 } }}>
                  {[
                    { n: 1, title: "Open bKash / Nagad App",  desc: 'Go to "Send Money" option' },
                    { n: 3, title: "Send exact amount",        desc: "৳50 × number of persons = total" },
                    { n: 4, title: "Copy Transaction ID",      desc: "Paste the TrxID in the form" },
                  ].map(s => (
                    <Box key={s.n} sx={{ display: "flex", gap: 1.5, mb: 2 }}>
                      <Box sx={{ width: 26, height: 26, borderRadius: "50%", bgcolor: "#fce4ec", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, color: "#c2185b", fontSize: "0.78rem" }}>{s.n}</Box>
                      <Box>
                        <Typography fontWeight={700} fontSize="0.85rem">{s.title}</Typography>
                        <Typography color="text.secondary" fontSize="0.78rem">{s.desc}</Typography>
                      </Box>
                    </Box>
                  ))}

                  {/* bKash number highlight */}
                  <Box sx={{ bgcolor: "#fce4ec", borderRadius: 2, px: 2, py: 1.5, border: "2px dashed #f48fb1", display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Box>
                      <Typography fontSize="0.68rem" color="#c2185b" fontWeight={700} letterSpacing={1}>bKash</Typography>
                      <Typography fontWeight={800} fontSize={{ xs: "1.3rem", md: "1.4rem" }} color="#c2185b" letterSpacing={2}>01974-500611</Typography>
                    </Box>
                    <Typography fontSize="1.6rem">📱</Typography>
                  </Box>

                  <Box sx={{ bgcolor: "#fff8e1", borderRadius: 2, p: 1.5, border: "1px solid #ffe082" }}>
                    <Typography fontSize="0.75rem" color="#f57f17">⚠️ Booking confirmed after admin payment verification.</Typography>
                  </Box>
                </Box>
              </Box>

              {/* ── WHY VISIT US ── */}
              <Box sx={{ display: { xs: "none", md: "block" }, bgcolor: "background.paper", borderRadius: 2, p: { xs: 2, md: 3 }, border: "1.5px solid", borderColor: "divider" }}>
                <Typography fontWeight={800} fontSize="0.95rem" color="primary.main" mb={1.5}>🌿 What's Included</Typography>
                {[
                  { icon: "🌿", text: "Full day access to all nature trails" },
                  { icon: "🏕️", text: "Picnic & camping area access" },
                  { icon: "📸", text: "Scenic photography spots" },
                  { icon: "🍃", text: "Guided eco walk" },
                  { icon: "🅿️", text: "Free parking on premises" },
                ].map(item => (
                  <Box key={item.text} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.8, borderBottom: "1px solid", borderColor: "divider" }}>
                    <Typography fontSize="1rem">{item.icon}</Typography>
                    <Typography fontSize="0.82rem" color="text.secondary">{item.text}</Typography>
                  </Box>
                ))}
              </Box>

              

              {/* ── TICKET PRICE ── */}
             
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}