import { useState } from "react";
import {
  Box, Container, Typography, TextField, Button,
  Chip, Divider, Alert, InputAdornment, CircularProgress, Grid,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SearchIcon from "@mui/icons-material/Search";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import PaidIcon from "@mui/icons-material/Paid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import BlockIcon from "@mui/icons-material/Block";
import supabase from "@/lib/supabase";

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
    setPhone(""); setTickets([]); setSearched(false); setError("");
  }

  // separate by status
  const approvedTickets = tickets.filter(t => t.status === "approved");
  const pendingTickets  = tickets.filter(t => (t.status || "pending") === "pending");
  const rejectedTickets = tickets.filter(t => t.status === "rejected");

  function TicketCard({ ticket }) {
    const isVisited = ticket.used;

    // header color
    const headerBg = isVisited
      ? "linear-gradient(135deg,#1565c0,#1976d2)"   // blue = visited
      : "linear-gradient(135deg,#1b5e20,#2e7d32)";  // green = valid

    return (
      <Box sx={{
        bgcolor: "#fff", borderRadius: 2, overflow: "hidden",
        boxShadow: "0 4px 24px rgba(46,125,50,0.10)",
        border: `2px solid ${isVisited ? "#90caf9" : "#c8e6c9"}`,
        transition: "all 0.2s",
        "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" },
      }}>
        {/* Header */}
        <Box sx={{ background: headerBg, px: 3, py: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {isVisited
              ? <CheckCircleIcon sx={{ color: "#fff", fontSize: "1.8rem" }} />
              : <ConfirmationNumberIcon sx={{ color: "#fff", fontSize: "1.8rem" }} />
            }
            <Box>
              <Typography fontWeight={800} color="#fff" fontSize="0.95rem">{ticket.id}</Typography>
              <Typography color="rgba(255,255,255,0.75)" fontSize="0.75rem">{ticket.date}</Typography>
            </Box>
          </Box>
          <Box sx={{ px: 2, py: 0.5, borderRadius: 5, bgcolor: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)" }}>
            <Typography fontSize="0.7rem" fontWeight={800} color="#fff" letterSpacing={1}>
              {isVisited ? "VISITED" : "VALID"}
            </Typography>
          </Box>
        </Box>

        {/* Tear line */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "#f5f7fa", ml: -1.1, border: `1.5px solid ${isVisited ? "#90caf9" : "#c8e6c9"}` }} />
          <Box sx={{ flex: 1, borderTop: `2px dashed ${isVisited ? "#90caf9" : "#c8e6c9"}`, opacity: 0.5 }} />
          <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "#f5f7fa", mr: -1.1, border: `1.5px solid ${isVisited ? "#90caf9" : "#c8e6c9"}` }} />
        </Box>

        {/* Body */}
        <Box sx={{ px: { xs: 2.5, md: 3 }, py: 3 }}>
          <Grid container spacing={2} mb={2}>
            {[
              { icon: <PersonIcon sx={{ fontSize: "0.9rem", color: "#aaa" }} />, label: "Name",    value: ticket.name },
              { icon: <PhoneIcon  sx={{ fontSize: "0.9rem", color: "#aaa" }} />, label: "Phone",   value: ticket.phone },
              { icon: <GroupIcon  sx={{ fontSize: "0.9rem", color: "#aaa" }} />, label: "Persons", value: `${ticket.persons} ${ticket.persons === 1 ? "Person" : "Persons"}` },
              { icon: <PaidIcon   sx={{ fontSize: "0.9rem", color: "#aaa" }} />, label: "Total",   value: `৳${ticket.total}` },
            ].map((row) => (
              <Grid item xs={6} key={row.label}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.3 }}>
                  {row.icon}
                  <Typography color="text.secondary" fontSize="0.72rem">{row.label}</Typography>
                </Box>
                <Typography fontWeight={700} fontSize="0.9rem"
                  color={row.label === "Total" ? "primary.main" : "text.primary"}>
                  {row.value}
                </Typography>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ mb: 2 }} />

          {isVisited ? (
            <Alert severity="info" icon={<CheckCircleIcon fontSize="small" />} sx={{ borderRadius: 2, fontSize: "0.82rem" }}>
              <strong>Resort Visited!</strong> You visited on {ticket.used_at || "—"}.
            </Alert>
          ) : (
            <Alert severity="success" icon={<ConfirmationNumberIcon fontSize="small" />} sx={{ borderRadius: 2, fontSize: "0.82rem" }}>
              <strong>Valid Ticket!</strong> Show this at the entrance gate to enter.
            </Alert>
          )}
        </Box>
      </Box>
    );
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
          <Chip label="My Tickets"
            icon={<ConfirmationNumberIcon sx={{ color: "primary.light !important", fontSize: "0.9rem !important" }} />}
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
          boxShadow: "0 4px 24px rgba(46,125,50,0.08)",
          border: "1.5px solid", borderColor: "divider", mb: 5,
        }}>
          <Box textAlign="center" mb={4}>
            <Box sx={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg,#1b5e20,#2e7d32)",
              display: "flex", alignItems: "center", justifyContent: "center",
              mx: "auto", mb: 2, boxShadow: "0 8px 24px rgba(46,125,50,0.3)",
            }}>
              <ConfirmationNumberIcon sx={{ color: "#fff", fontSize: "2rem" }} />
            </Box>
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
              InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "#aaa", fontSize: "1.1rem" }} /></InputAdornment> }}
            />
            <Button type="submit" variant="contained" color="primary" size="large" fullWidth
              startIcon={<SearchIcon />}
              sx={{ py: 1.5, fontSize: "1rem" }} disabled={loading}>
              {loading ? <CircularProgress size={22} color="inherit" /> : "Find My Tickets"}
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
            No bookings found for this number. Please check and try again.
          </Alert>
        )}

        {/* ── PENDING TICKETS ── */}
        {pendingTickets.length > 0 && (
          <Box mb={5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <HourglassTopIcon sx={{ color: "#f57f17" }} />
              <Typography variant="h6" fontWeight={800}>Pending Approval ({pendingTickets.length})</Typography>
            </Box>
            <Alert severity="warning" sx={{ borderRadius: 3, mb: 3 }}>
              Your booking is under review. Your ticket will appear here once the admin approves your payment.
            </Alert>
            {pendingTickets.map(t => (
              <Box key={t.id} sx={{ bgcolor: "#fff", borderRadius: 2, p: 3, mb: 2, border: "1.5px solid #ffe082", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography fontWeight={700} color="#f57f17">{t.id}</Typography>
                  <Typography color="text.secondary" fontSize="0.82rem">{t.date}</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box>
                    <Typography color="text.secondary" fontSize="0.72rem">Persons</Typography>
                    <Typography fontWeight={700}>{t.persons}</Typography>
                  </Box>
                  <Box>
                    <Typography color="text.secondary" fontSize="0.72rem">Total</Typography>
                    <Typography fontWeight={700} color="primary.main">৳{t.total}</Typography>
                  </Box>
                  <Box>
                    <Typography color="text.secondary" fontSize="0.72rem">TrxID</Typography>
                    <Typography fontWeight={700} fontSize="0.82rem">{t.trx_id || "—"}</Typography>
                  </Box>
                </Box>
                <Chip label="Pending" size="small" sx={{ bgcolor: "#fff8e1", color: "#f57f17", border: "1px solid #ffe082", fontWeight: 700 }} />
              </Box>
            ))}
          </Box>
        )}

        {/* ── REJECTED TICKETS ── */}
        {rejectedTickets.length > 0 && (
          <Box mb={5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <BlockIcon sx={{ color: "#c62828" }} />
              <Typography variant="h6" fontWeight={800}>Rejected ({rejectedTickets.length})</Typography>
            </Box>
            {rejectedTickets.map(t => (
              <Box key={t.id} sx={{ bgcolor: "#fff", borderRadius: 2, p: 3, mb: 2, border: "1.5px solid #ffcdd2", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography fontWeight={700} color="#c62828">{t.id}</Typography>
                  <Typography color="text.secondary" fontSize="0.82rem">{t.date}</Typography>
                </Box>
                <Chip label="Rejected" size="small" icon={<CancelIcon sx={{ fontSize: "0.9rem !important" }} />} sx={{ bgcolor: "#ffebee", color: "#c62828", border: "1px solid #ffcdd2", fontWeight: 700 }} />
              </Box>
            ))}
            <Alert severity="error" sx={{ borderRadius: 3 }}>
              Your booking was rejected. Please contact us for assistance.
            </Alert>
          </Box>
        )}

        {/* ── APPROVED TICKETS ── */}
        {approvedTickets.length > 0 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CheckCircleIcon sx={{ color: "#2e7d32" }} />
                <Typography variant="h6" fontWeight={800}>
                  Approved Tickets ({approvedTickets.length})
                </Typography>
              </Box>
              <Chip
                label={`Total: ৳${approvedTickets.reduce((s, t) => s + t.total, 0)}`}
                color="primary" sx={{ fontWeight: 700 }}
              />
            </Box>
            <Grid container spacing={3}>
              {approvedTickets.map(ticket => (
                <Grid item xs={12} md={6} key={ticket.id}>
                  <TicketCard ticket={ticket} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

      </Container>
    </Box>
  );
}
