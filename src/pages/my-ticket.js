import { useState } from "react";
import {
  Box, Container, Typography, TextField, Button,
  Chip, Divider, Alert, InputAdornment, CircularProgress, Grid,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SeachOutlined from "@mui/icons-material/SearchOutlined";
import supabase from "@/lib/supabase";
import { SearchOutlined } from "@mui/icons-material";

export default function MyTicket() {
  const [phone, setPhone]       = useState("");
  const [tickets, setTickets]   = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      setError("Please enter a valid Bangladesh mobile number (e.g. 01XXXXXXXXX)");
      return;
    }
    setError("");
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("phone", phone)
      .order("timestamp", { ascending: false });
    setLoading(false);
    setTickets(data || []);
    setSearched(true);
  }

  function handleClear() {
    setPhone("");
    setTickets([]);
    setSearched(false);
    setError("");
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <Box sx={{ position: "relative", height: 280, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Box component="img"
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=85"
          alt="my ticket"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,0,0,0.35),rgba(0,40,0,0.78))", zIndex: 1 }} />
        <Box sx={{ position: "relative", zIndex: 2, textAlign: "center", px: 2 }}>
          <Chip label="🎫 My Tickets"
            sx={{ bgcolor: "rgba(165,214,167,0.18)", color: "primary.light", border: "1px solid rgba(165,214,167,0.4)", mb: 2 }}
          />
          <Typography variant="h3" color="#fff" fontWeight={800} sx={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            My Tickets
          </Typography>
          <Typography color="rgba(255,255,255,0.8)" mt={1.5} fontSize="1.05rem">
            Enter your phone number to view all your bookings
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="md" sx={{ py: 8 }}>

        {/* ── SEARCH BOX ── */}
        <Box sx={{
          bgcolor: "background.paper", borderRadius: 2, p: { xs: 3, md: 5 },
          boxShadow: "0 8px 40px rgba(46,125,50,0.10)",
          border: "1.5px solid", borderColor: "divider", mb: 5,
        }}>
          <Box textAlign="center" mb={4}>
            <Box sx={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg,#1b5e20,#2e7d32)",
              color:"#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", mx: "auto", mb: 2,
              boxShadow: "0 8px 24px rgba(46,125,50,0.35)",
            }}><ConfirmationNumberIcon color="#fff" /></Box>
            <Typography variant="h5" fontWeight={800} mb={0.5}>Find Your Tickets</Typography>
            <Typography color="text.secondary" fontSize="0.88rem">
              Enter the phone number you used during booking
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Phone Number"
              placeholder="e.g. 01712345678"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(""); setSearched(false); setTickets([]); }}
              fullWidth
              inputProps={{ maxLength: 11 }}
              error={!!error}
              helperText={error || "Your Bangladesh mobile number"}
              InputProps={{ startAdornment: <InputAdornment position="start">📞</InputAdornment> }}
            />
            <Button type="submit" variant="contained" startIcon={<SearchOutlined />} color="primary" size="large" fullWidth
              sx={{ py: 1.5, fontSize: "1rem" }} disabled={loading}>
              {loading ? <CircularProgress size={22} color="inherit" /> : " Find My Tickets"}
            </Button>
            {searched && (
              <Button variant="outlined" color="primary" fullWidth onClick={handleClear} sx={{ py: 1.2 }}>
                Clear
              </Button>
            )}
          </Box>
        </Box>

        {/* ── NO RESULTS ── */}
        {searched && tickets.length === 0 && (
          <Alert severity="warning" sx={{ borderRadius: 3, mb: 4 }}>
            📭 No bookings found for this number. Please check and try again.
          </Alert>
        )}

        {/* ── TICKET LIST ── */}
        {tickets.length > 0 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 1 }}>
              <Typography variant="h5" fontWeight={800}>
                Your Tickets ({tickets.length})
              </Typography>
              <Chip
                label={`Total Paid: ৳${tickets.reduce((s, t) => s + t.total, 0)}`}
                color="primary" sx={{ fontWeight: 700, fontSize: "0.9rem" }}
              />
            </Box>

            <Grid container spacing={3}>
              {tickets.map((ticket) => (
                <Grid size={{ xs: 12, md: 6 }} key={ticket.id}>
                  <Box sx={{
                    bgcolor: "background.paper", borderRadius: 2, overflow: "hidden",
                    boxShadow: "0 4px 24px rgba(46,125,50,0.10)",
                    border: "2px solid",
                    borderColor: ticket.used ? "error.light" : "primary.light",
                    transition: "all 0.2s",
                    "&:hover": { boxShadow: "0 8px 32px rgba(46,125,50,0.18)", transform: "translateY(-2px)" },
                  }}>
                    {/* ticket header */}
                    <Box sx={{
                      background: ticket.used
                        ? "linear-gradient(135deg,#7f0000,#c62828)"
                        : "linear-gradient(135deg,#1b5e20,#2e7d32)",
                      px: 3, py: 2,
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Typography fontSize="1.5rem">{ticket.used ? "🚫" : "✅"}</Typography>
                        <Box>
                          <Typography fontWeight={800} color="#fff" fontSize="0.95rem">{ticket.id}</Typography>
                          <Typography color="rgba(255,255,255,0.75)" fontSize="0.75rem">{ticket.date}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{
                        px: 2, py: 0.5, borderRadius: 2,
                        bgcolor: ticket.used ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.35)",
                      }}>
                        <Typography fontSize="0.72rem" fontWeight={800} color="#fff" letterSpacing={1}>
                          {ticket.used ? "USED" : "VALID"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* tear line */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "background.default", ml: -1.1, border: "1.5px solid", borderColor: ticket.used ? "error.light" : "primary.light" }} />
                      <Box sx={{ flex: 1, borderTop: "2px dashed", borderColor: ticket.used ? "error.light" : "primary.light", opacity: 0.4 }} />
                      <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "background.default", mr: -1.1, border: "1.5px solid", borderColor: ticket.used ? "error.light" : "primary.light" }} />
                    </Box>

                    {/* ticket body */}
                    <Box sx={{ px: { xs: 2.5, md: 4 }, py: 3 }}>
                      <Grid container spacing={2}>
                        {[
                          { label: "👤 Name",        value: ticket.name },
                          { label: "📞 Phone",        value: ticket.phone },
                          { label: "👥 Persons",      value: `${ticket.persons} ${ticket.persons === 1 ? "Person" : "Persons"}` },
                          { label: "💰 Total",        value: `৳${ticket.total}` },
                          { label: "💸 bKash Number", value: ticket.bkash_number || "—" },
                          { label: "🔑 TrxID",        value: ticket.trx_id || "—" },
                        ].map((row) => (
                          <Grid size={{ xs: 6, md: 4 }} key={row.label}>
                            <Typography color="text.secondary" fontSize="0.75rem" mb={0.3}>{row.label}</Typography>
                            <Typography fontWeight={700} fontSize="0.9rem"
                              color={row.label === "💰 Total" ? "primary.main" : "text.primary"}>
                              {row.value}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>

                      <Divider sx={{ my: 2, borderColor: "divider" }} />

                      {ticket.used ? (
                        <Alert severity="error" sx={{ borderRadius: 2, fontSize: "0.82rem" }}>
                          ⛔ This ticket has already been used.
                          {ticket.used_at && ` Used on: ${ticket.used_at}`}
                        </Alert>
                      ) : (
                        <Alert severity="success" sx={{ borderRadius: 2, fontSize: "0.82rem" }}>
                          🌿 This ticket is valid. Please show it at the entrance gate.
                        </Alert>
                      )}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}
