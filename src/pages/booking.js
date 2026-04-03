// ./src/pages/booking.js
import Head from "next/head";
import { useState } from "react";
import {
  Box, Container, Typography, TextField, Button,
  MenuItem, Chip, Divider, Alert, Grid, CircularProgress,
} from "@mui/material";
import supabase from "@/lib/supabase";

const PRICE_PER_PERSON = 25;

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
        <title>Book a Ticket — PTA BaganBari Resort</title>
        <meta name="description" content="Book your visit to PTA BaganBari Resort online. Only ৳25 per person. Fill in your details and pay via bKash to confirm your ticket instantly." />
        <meta name="keywords" content="book ticket PTA BaganBari, resort booking Bangladesh, bKash payment, Brahmanbaria resort ticket" />
        <meta property="og:title" content="Book a Ticket — PTA BaganBari Resort" />
        <meta property="og:description" content="Book your resort visit online for just ৳25 per person. Pay via bKash." />
        <meta name="robots" content="index, follow" />
      </Head>

      {/* HERO */}
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

      {/* CONTENT */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
         <Box sx={{ background: "linear-gradient(135deg,#1b5e20,#2e7d32)", borderRadius: 2, p: 4, color: "#fff" }}>
                <Typography fontWeight={700} fontSize="0.85rem" sx={{ opacity: 0.8, mb: 1, letterSpacing: 1 }}>TICKET PRICE</Typography>
                <Typography variant="h2" color="#fff">৳{PRICE_PER_PERSON}</Typography>
                <Typography sx={{ opacity: 0.85, mt: 0.5 }}>per person</Typography>
                <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />
                <Typography fontSize="0.85rem" sx={{ opacity: 0.8 }}>
                  🕐 Open: Sat–Thu 8AM–6PM<br />
                  📍 Loxmipur PTA Baganbari, Kasba, Brahmanbaria, Bangladesh
                </Typography>
              </Box>
        <Grid container spacing={5} justifyContent="center">

          {/* FORM / CONFIRMATION */}
          <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 2, md: 1 } }}>
            {!confirmed ? (
              <Box sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: "0 8px 40px rgba(46,125,50,0.10)", p: { xs: 3, md: 5 }, border: "1.5px solid", borderColor: "divider" }}>
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
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 200,   // 👈 scroll height (adjustable)
                          },
                        },
                      },
                    }}
                                      >
                    {[...Array(20)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? "Person" : "Persons"}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* bKash Payment */}
                  <TextField
                    label="bKash Send Money Number"
                    placeholder="e.g. 017XXXXXXXX"
                    value={form.payment.bkashNumber}
                    onChange={(e) => setForm(f => ({ ...f, payment: { ...f.payment, bkashNumber: e.target.value } })) }
                    error={!!errors.bkashNumber}
                    helperText={errors.bkashNumber || "Number used to send payment"}
                    fullWidth
                    InputProps={{ startAdornment: <Box sx={{ mr: 1 }}>💸</Box> }}
                  />
                  <TextField
                    label="Transaction ID (trxID)"
                    placeholder="e.g. TX123456789"
                    value={form.payment.trxID}
                    onChange={(e) => setForm(f => ({ ...f, payment: { ...f.payment, trxID: e.target.value } })) }
                    error={!!errors.trxID}
                    helperText={errors.trxID || "bKash transaction ID"}
                    fullWidth
                    InputProps={{ startAdornment: <Box sx={{ mr: 1 }}>🔑</Box> }}
                  />

                  {/* Price Summary */}
                  <Box sx={{ bgcolor: "secondary.dark", borderRadius: 3, p: 3, border: "1.5px solid", borderColor: "primary.light" }}>
                    <Typography fontWeight={700} mb={2} color="primary.main">💰 Price Summary</Typography>
                    {[{ label: "Price per person", value: `৳${PRICE_PER_PERSON}` }, { label: "Number of persons", value: `× ${form.persons}` }]
                      .map((r) => (
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

                  {errors.submit && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>{errors.submit}</Alert>
                  )}
                  <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ py: 1.6, fontSize: "1rem" }} disabled={loading}>
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ bgcolor: "background.paper", borderRadius: 2, p: 4, border: "1.5px solid", borderColor: "divider", boxShadow: "0 4px 20px rgba(46,125,50,0.07)" }}>
                <Chip label="Why Visit Us?" color="primary" sx={{ mb: 2 }} />
                <Typography variant="h6" mb={2}>What's Included</Typography>
                {[{ icon: "🌿", text: "Full day access to all nature trails" },
                  { icon: "🏕️", text: "Picnic & camping area access" },
                  { icon: "📸", text: "Scenic photography spots" },
                  { icon: "🍃", text: "Guided eco walk" },
                  { icon: "🅿️", text: "Free parking on premises" }].map((item) => (
                  <Box key={item.text} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
                    <Typography fontSize="1.2rem">{item.icon}</Typography>
                    <Typography fontSize="0.88rem" color="text.secondary">{item.text}</Typography>
                  </Box>
                ))}
              </Box>

              {/* ── PAYMENT INSTRUCTION ── */}
              <Box sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 24px rgba(229,57,53,0.12)", border: "2px solid #f48fb1" }}>
                {/* header */}
                <Box sx={{ background: "linear-gradient(135deg,#e91e63,#c2185b)", px: 3, py: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography fontSize="1.6rem">💸</Typography>
                  <Box>
                    <Typography fontWeight={800} color="#fff" fontSize="1rem">Payment Instructions</Typography>
                    <Typography color="rgba(255,255,255,0.8)" fontSize="0.75rem">Send money before booking</Typography>
                  </Box>
                </Box>

                <Box sx={{ bgcolor: "#fff", p: 3 }}>
                  {/* step 1 */}
                  <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "#fce4ec", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, color: "#c2185b", fontSize: "0.82rem" }}>1</Box>
                    <Box>
                      <Typography fontWeight={700} fontSize="0.88rem" mb={0.5}>Open bKash / Nagad App</Typography>
                      <Typography color="text.secondary" fontSize="0.82rem">Go to "Send Money" option</Typography>
                    </Box>
                  </Box>

                  {/* step 2 — number */}
                  <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "#fce4ec", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, color: "#c2185b", fontSize: "0.82rem" }}>2</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={700} fontSize="0.88rem" mb={1}>Send to this number</Typography>
                      <Box sx={{
                        bgcolor: "#fce4ec", borderRadius: 3, px: 2.5, py: 1.5,
                        border: "2px dashed #f48fb1",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}>
                        <Box>
                          <Typography fontSize="0.7rem" color="#c2185b" fontWeight={700} letterSpacing={1}>bKash / Nagad / Rocket</Typography>
                          <Typography fontWeight={800} fontSize="1.4rem" color="#c2185b" letterSpacing={2}>01623325407</Typography>
                        </Box>
                        <Typography fontSize="1.8rem">📱</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* step 3 */}
                  <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "#fce4ec", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, color: "#c2185b", fontSize: "0.82rem" }}>3</Box>
                    <Box>
                      <Typography fontWeight={700} fontSize="0.88rem" mb={0.5}>Send exact amount</Typography>
                      <Typography color="text.secondary" fontSize="0.82rem">৳25 × number of persons = total</Typography>
                    </Box>
                  </Box>

                  {/* step 4 */}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "#fce4ec", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, color: "#c2185b", fontSize: "0.82rem" }}>4</Box>
                    <Box>
                      <Typography fontWeight={700} fontSize="0.88rem" mb={0.5}>Copy Transaction ID</Typography>
                      <Typography color="text.secondary" fontSize="0.82rem">Paste the TrxID in the form to complete booking</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2.5, bgcolor: "#fff8e1", borderRadius: 2, p: 1.5, border: "1px solid #ffe082" }}>
                    <Typography fontSize="0.78rem" color="#f57f17">⚠️ Booking will only be confirmed after payment verification by admin.</Typography>
                  </Box>
                </Box>
              </Box>

              {/* ── TICKET PRICE ── */}
             
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}