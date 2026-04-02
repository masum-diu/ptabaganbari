import { useState } from "react";
import {
  Box, Container, Typography, TextField, Button,
  Chip, Divider, Alert, InputAdornment, CircularProgress,
  Grid, Tabs, Tab, Dialog, DialogContent, IconButton,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SearchIcon      from "@mui/icons-material/Search";
import PhoneIcon       from "@mui/icons-material/Phone";
import PersonIcon      from "@mui/icons-material/Person";
import GroupIcon       from "@mui/icons-material/Group";
import PaidIcon        from "@mui/icons-material/Paid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon      from "@mui/icons-material/Cancel";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import BlockIcon       from "@mui/icons-material/Block";
import VisibilityIcon  from "@mui/icons-material/Visibility";
import CloseIcon       from "@mui/icons-material/Close";
import supabase from "@/lib/supabase";

/* ── Ticket Detail Dialog ── */
function TicketDialog({ ticket, open, onClose }) {
  if (!ticket) return null;
  const isVisited = ticket.used;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 2, overflow: "hidden", border: `2px solid ${isVisited ? "#90caf9" : "#c8e6c9"}` } }}>
      {/* Header */}
      <Box sx={{
        background: isVisited ? "linear-gradient(135deg,#1565c0,#1976d2)" : "linear-gradient(135deg,#1b5e20,#2e7d32)",
        px: 3, py: 3, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {isVisited
            ? <CheckCircleIcon sx={{ color: "#fff", fontSize: "2rem" }} />
            : <ConfirmationNumberIcon sx={{ color: "#fff", fontSize: "2rem" }} />}
          <Box>
            <Typography fontWeight={800} color="#fff">{ticket.id}</Typography>
            <Typography color="rgba(255,255,255,0.75)" fontSize="0.75rem">{ticket.date}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ px: 1.5, py: 0.4, borderRadius: 2, bgcolor: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)" }}>
            <Typography fontSize="0.7rem" fontWeight={800} color="#fff" letterSpacing={1}>
              {isVisited ? "VISITED" : "VALID"}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "rgba(255,255,255,0.8)" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Tear line */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "#f5f7fa", ml: -1.1, border: `1.5px solid ${isVisited ? "#90caf9" : "#c8e6c9"}` }} />
        <Box sx={{ flex: 1, borderTop: `2px dashed ${isVisited ? "#90caf9" : "#c8e6c9"}`, opacity: 0.5 }} />
        <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "#f5f7fa", mr: -1.1, border: `1.5px solid ${isVisited ? "#90caf9" : "#c8e6c9"}` }} />
      </Box>

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Grid container spacing={2} mb={2}>
          {[
            { icon: <PersonIcon sx={{ fontSize: "0.9rem", color: "#aaa" }} />, label: "Name",    value: ticket.name },
            { icon: <PhoneIcon  sx={{ fontSize: "0.9rem", color: "#aaa" }} />, label: "Phone",   value: ticket.phone },
            { icon: <GroupIcon  sx={{ fontSize: "0.9rem", color: "#aaa" }} />, label: "Persons", value: `${ticket.persons} ${ticket.persons === 1 ? "Person" : "Persons"}` },
            { icon: <PaidIcon   sx={{ fontSize: "0.9rem", color: "#aaa" }} />, label: "Total",   value: `৳${ticket.total}` },
            { icon: <ConfirmationNumberIcon sx={{ fontSize: "0.9rem", color: "#aaa" }} />, label: "TrxID", value: ticket.trx_id || "—" },
            { icon: <PhoneIcon  sx={{ fontSize: "0.9rem", color: "#aaa" }} />, label: "bKash",   value: ticket.bkash_number || "—" },
          ].map(row => (
            <Grid item xs={6} key={row.label}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.3 }}>
                {row.icon}
                <Typography color="text.secondary" fontSize="0.7rem">{row.label}</Typography>
              </Box>
              <Typography fontWeight={700} fontSize="0.88rem"
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
      </DialogContent>
    </Dialog>
  );
}

/* ── Ticket Row Card ── */
function TicketRow({ ticket, onView }) {
  const isVisited  = ticket.used;
  const isRejected = ticket.status === "rejected";

  const borderColor = isRejected ? "#ffcdd2" : isVisited ? "#90caf9" : "#c8e6c9";
  const headerBg    = isRejected
    ? "linear-gradient(135deg,#b71c1c,#c62828)"
    : isVisited
    ? "linear-gradient(135deg,#1565c0,#1976d2)"
    : "linear-gradient(135deg,#1b5e20,#2e7d32)";
  const statusLabel = isRejected ? "Rejected" : isVisited ? "Visited" : "Valid";
  const statusColor = isRejected ? "#c62828"  : isVisited ? "#1565c0" : "#2e7d32";
  const statusBg    = isRejected ? "#ffebee"  : isVisited ? "#e3f2fd" : "#e8f5e9";

  return (
    <Box sx={{
      bgcolor: "#fff", borderRadius: 2, p: 2.5,
      border: `1.5px solid ${borderColor}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 2,
      transition: "all 0.2s",
      "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.09)", transform: "translateY(-1px)" },
    }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{
          width: 42, height: 42, borderRadius: 2,
          background: headerBg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {isRejected
            ? <CancelIcon sx={{ color: "#fff", fontSize: "1.3rem" }} />
            : isVisited
            ? <CheckCircleIcon sx={{ color: "#fff", fontSize: "1.3rem" }} />
            : <ConfirmationNumberIcon sx={{ color: "#fff", fontSize: "1.3rem" }} />}
        </Box>
        <Box>
          <Typography fontWeight={800} fontSize="0.92rem">{ticket.id}</Typography>
          <Typography color="text.secondary" fontSize="0.75rem">{ticket.date}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        <Box>
          <Typography color="text.secondary" fontSize="0.7rem">Persons</Typography>
          <Typography fontWeight={700} fontSize="0.88rem">{ticket.persons}</Typography>
        </Box>
        <Box>
          <Typography color="text.secondary" fontSize="0.7rem">Total</Typography>
          <Typography fontWeight={700} fontSize="0.88rem" color="primary.main">৳{ticket.total}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ px: 1.5, py: 0.4, borderRadius: 2, bgcolor: statusBg, border: `1px solid ${statusColor}44` }}>
          <Typography fontSize="0.72rem" fontWeight={700} color={statusColor}>{statusLabel}</Typography>
        </Box>
        <Button size="small" variant="outlined"
          color={isRejected ? "error" : "primary"}
          startIcon={<VisibilityIcon sx={{ fontSize: "0.9rem !important" }} />}
          onClick={() => !isRejected && onView(ticket)}
          disabled={isRejected}
          sx={{ fontSize: "0.75rem", fontWeight: 700, borderRadius: 2, px: 1.5, py: 0.5 }}>
          View
        </Button>
      </Box>
    </Box>
  );
}

export default function MyTicket() {
  const [phone, setPhone]         = useState("");
  const [tickets, setTickets]     = useState([]);
  const [searched, setSearched]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [tab, setTab]             = useState("approved");
  const [viewTicket, setViewTicket] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      setError("Please enter a valid Bangladesh mobile number (e.g. 01XXXXXXXXX)");
      return;
    }
    setError("");
    setLoading(true);
    const { data } = await supabase
      .from("bookings").select("*").eq("phone", phone)
      .order("timestamp", { ascending: false });
    setLoading(false);
    setTickets(data || []);
    setSearched(true);
  }

  function handleClear() {
    setPhone(""); setTickets([]); setSearched(false); setError(""); setTab("approved");
  }

  const approvedTickets = tickets.filter(t => t.status === "approved");
  const pendingTickets  = tickets.filter(t => (t.status || "pending") === "pending");
  const rejectedTickets = tickets.filter(t => t.status === "rejected");

  const tabList = [
    { value: "approved", label: `Approved (${approvedTickets.length})` },
    { value: "pending",  label: `Pending (${pendingTickets.length})` },
    { value: "rejected", label: `Rejected (${rejectedTickets.length})` },
  ];

  const currentList = tab === "approved" ? approvedTickets : tab === "pending" ? pendingTickets : rejectedTickets;

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

      <Container maxWidth="lg" sx={{ py: 8 }}>

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
              label="Phone Number" placeholder="e.g. 01712345678"
              value={phone}
              onChange={e => { setPhone(e.target.value); setError(""); setSearched(false); setTickets([]); }}
              fullWidth inputProps={{ maxLength: 11 }}
              error={!!error} helperText={error || "Your Bangladesh mobile number"}
              InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "#aaa", fontSize: "1.1rem" }} /></InputAdornment> }}
            />
            <Button type="submit" variant="contained" color="primary" size="large" fullWidth
              startIcon={<SearchIcon />} sx={{ py: 1.5, fontSize: "1rem" }} disabled={loading}>
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
          <Alert severity="warning" sx={{ borderRadius: 2, mb: 4 }}>
            No bookings found for this number. Please check and try again.
          </Alert>
        )}

        {/* ── TABS + LIST ── */}
        {tickets.length > 0 && (
          <Box>
            {/* Tab header */}
            <Box sx={{ bgcolor: "background.paper", borderRadius: 2, overflow: "hidden", border: "1.5px solid", borderColor: "divider", mb: 3 }}>
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{
                  px: 2,
                  "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.85rem", minHeight: 52 },
                  "& .Mui-selected": { color: "#2e7d32 !important", fontWeight: 800 },
                  "& .MuiTabs-indicator": { bgcolor: "#2e7d32" },
                }}
              >
                {tabList.map(t => (
                  <Tab key={t.value} value={t.value} label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {t.value === "approved"  && <CheckCircleIcon sx={{ fontSize: "1rem", color: tab === t.value ? "#2e7d32" : "#aaa" }} />}
                      {t.value === "pending"   && <HourglassTopIcon sx={{ fontSize: "1rem", color: tab === t.value ? "#f57f17" : "#aaa" }} />}
                      {t.value === "rejected"  && <BlockIcon sx={{ fontSize: "1rem", color: tab === t.value ? "#c62828" : "#aaa" }} />}
                      {t.label}
                    </Box>
                  } />
                ))}
              </Tabs>
            </Box>

            {/* Tab content */}
            {tab === "pending" && pendingTickets.length > 0 && (
              <Alert severity="warning" sx={{ borderRadius: 2, mb: 3 }}>
                Your booking is under review. Ticket will appear once admin approves your payment.
              </Alert>
            )}
            {tab === "rejected" && rejectedTickets.length > 0 && (
              <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
                Your booking was rejected. Please contact us for assistance.
              </Alert>
            )}

            {currentList.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, bgcolor: "background.paper", borderRadius: 2, border: "1.5px solid", borderColor: "divider" }}>
                <ConfirmationNumberIcon sx={{ fontSize: "3rem", color: "#ddd" }} />
                <Typography color="text.secondary" mt={2} fontWeight={600}>
                  No {tab} tickets found
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* summary chip for approved */}
                {tab === "approved" && (
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Chip
                      label={`Total Paid: ৳${approvedTickets.reduce((s, t) => s + t.total, 0)}`}
                      color="primary" sx={{ fontWeight: 700 }}
                    />
                  </Box>
                )}
                {currentList.map(ticket => (
                  <TicketRow key={ticket.id} ticket={ticket} onView={t => setViewTicket(t)} />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Container>

      {/* ── TICKET DIALOG ── */}
      <TicketDialog ticket={viewTicket} open={!!viewTicket} onClose={() => setViewTicket(null)} />
    </Box>
  );
}
