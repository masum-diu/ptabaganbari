import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box, Container, Typography, TextField, Button, Grid,
  Chip, Divider, Alert, InputAdornment, Switch, CircularProgress,
  Tabs, Tab, Dialog, DialogContent, IconButton,
} from "@mui/material";
import SearchIcon             from "@mui/icons-material/Search";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CheckCircleIcon        from "@mui/icons-material/CheckCircle";
import MeetingRoomIcon        from "@mui/icons-material/MeetingRoom";
import PersonIcon             from "@mui/icons-material/Person";
import PhoneIcon              from "@mui/icons-material/Phone";
import PeopleIcon             from "@mui/icons-material/People";
import CalendarTodayIcon      from "@mui/icons-material/CalendarToday";
import VisibilityIcon         from "@mui/icons-material/Visibility";
import CloseIcon              from "@mui/icons-material/Close";
import supabase from "@/lib/supabase";

/* ── Ticket Detail Dialog with Entry Toggle ── */
function TicketDialog({ ticket, open, onClose, onToggle, toggling }) {
  if (!ticket) return null;
  const isUsed = ticket.used;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden", border: `2px solid ${isUsed ? "#90caf9" : "#c8e6c9"}` } }}>
      <Box sx={{
        background: isUsed ? "linear-gradient(135deg,#1565c0,#1976d2)" : "linear-gradient(135deg,#1b5e20,#2e7d32)",
        px: 3, py: 3, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {isUsed
            ? <CheckCircleIcon sx={{ color: "#fff", fontSize: "2rem" }} />
            : <ConfirmationNumberIcon sx={{ color: "#fff", fontSize: "2rem" }} />}
          <Box>
            <Typography fontWeight={800} color="#fff">{ticket.id}</Typography>
            <Typography color="rgba(255,255,255,0.75)" fontSize="0.75rem">{ticket.date}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ px: 1.5, py: 0.4, borderRadius: 5, bgcolor: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)" }}>
            <Typography fontSize="0.7rem" fontWeight={800} color="#fff" letterSpacing={1}>
              {isUsed ? "VISITED" : "VALID"}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "rgba(255,255,255,0.8)" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "#f5f7fa", ml: -1.1, border: `1.5px solid ${isUsed ? "#90caf9" : "#c8e6c9"}` }} />
        <Box sx={{ flex: 1, borderTop: `2px dashed ${isUsed ? "#90caf9" : "#c8e6c9"}`, opacity: 0.5 }} />
        <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "#f5f7fa", mr: -1.1, border: `1.5px solid ${isUsed ? "#90caf9" : "#c8e6c9"}` }} />
      </Box>

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography color="text.secondary" fontSize="0.72rem" fontWeight={700} letterSpacing={1}>BOOKING ID</Typography>
          <Typography fontWeight={800} color="primary.main">{ticket.id}</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2} mb={2}>
          {[
            { icon: <PersonIcon sx={{ fontSize: "0.9rem", color: "#aaa" }} />,        label: "Name",    value: ticket.name },
            { icon: <PhoneIcon sx={{ fontSize: "0.9rem", color: "#aaa" }} />,         label: "Phone",   value: ticket.phone },
            { icon: <PeopleIcon sx={{ fontSize: "0.9rem", color: "#aaa" }} />,        label: "Persons", value: `${ticket.persons} ${ticket.persons === 1 ? "Person" : "Persons"}` },
            { icon: <CalendarTodayIcon sx={{ fontSize: "0.9rem", color: "#aaa" }} />, label: "Booked",  value: ticket.date },
          ].map(row => (
            <Grid item xs={6} key={row.label}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.3 }}>
                {row.icon}
                <Typography color="text.secondary" fontSize="0.7rem">{row.label}</Typography>
              </Box>
              <Typography fontWeight={700} fontSize="0.88rem">{row.value}</Typography>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ bgcolor: "#f1f8f1", borderRadius: 3, p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1.5px solid #c8e6c9", mb: 3 }}>
          <Typography fontWeight={800}>Amount Paid</Typography>
          <Typography fontWeight={800} fontSize="1.6rem" color="primary.main">৳{ticket.total}</Typography>
        </Box>

        <Box sx={{
          borderRadius: 3, p: 3,
          bgcolor: isUsed ? "#e3f2fd" : "#f1f8f1",
          border: `1.5px solid ${isUsed ? "#90caf9" : "#c8e6c9"}`,
        }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.5 }}>
                {isUsed
                  ? <CheckCircleIcon sx={{ color: "#1565c0", fontSize: "1.1rem" }} />
                  : <MeetingRoomIcon sx={{ color: "#2e7d32", fontSize: "1.1rem" }} />}
                <Typography fontWeight={800} color={isUsed ? "#1565c0" : "#2e7d32"} fontSize="0.95rem">
                  {isUsed ? "Already Visited" : "Mark as Entered"}
                </Typography>
              </Box>
              <Typography color="text.secondary" fontSize="0.78rem">
                {isUsed ? `Visited on: ${ticket.used_at}` : "Toggle ON to allow entry. Cannot be undone."}
              </Typography>
            </Box>
            <Switch
              checked={!!isUsed}
              onChange={() => onToggle(ticket)}
              disabled={!!isUsed || toggling === ticket.id}
              color={isUsed ? "primary" : "success"}
            />
          </Box>
        </Box>

        {isUsed && (
          <Alert severity="info" icon={<CheckCircleIcon fontSize="small" />} sx={{ mt: 3, borderRadius: 2, fontSize: "0.82rem" }}>
            <strong>Entry Confirmed!</strong> {ticket.persons} person{ticket.persons > 1 ? "s" : ""} visited the resort.
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ── Ticket Row ── */
function TicketRow({ ticket, onView }) {
  const isUsed = ticket.used;
  return (
    <Box sx={{
      bgcolor: "#fff", borderRadius: 3, p: 2.5,
      border: `1.5px solid ${isUsed ? "#90caf9" : "#c8e6c9"}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 2,
      transition: "all 0.2s",
      "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.09)", transform: "translateY(-1px)" },
    }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{
          width: 42, height: 42, borderRadius: 2,
          background: isUsed ? "linear-gradient(135deg,#1565c0,#1976d2)" : "linear-gradient(135deg,#1b5e20,#2e7d32)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {isUsed
            ? <CheckCircleIcon sx={{ color: "#fff", fontSize: "1.3rem" }} />
            : <ConfirmationNumberIcon sx={{ color: "#fff", fontSize: "1.3rem" }} />}
        </Box>
        <Box>
          <Typography fontWeight={800} fontSize="0.92rem">{ticket.id}</Typography>
          <Typography color="text.secondary" fontSize="0.75rem">{ticket.name} — {ticket.date}</Typography>
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
        <Box sx={{
          px: 1.5, py: 0.4, borderRadius: 2,
          bgcolor: isUsed ? "#e3f2fd" : "#e8f5e9",
          border: `1px solid ${isUsed ? "#90caf9" : "#c8e6c9"}`,
        }}>
          <Typography fontSize="0.72rem" fontWeight={700} color={isUsed ? "#1565c0" : "#2e7d32"}>
            {isUsed ? "Visited" : "Valid"}
          </Typography>
        </Box>
        <Button size="small" variant="outlined" color="primary"
          startIcon={<VisibilityIcon sx={{ fontSize: "0.9rem !important" }} />}
          onClick={() => onView(ticket)}
          sx={{ fontSize: "0.75rem", fontWeight: 700, borderRadius: 2, px: 1.5, py: 0.5 }}>
          View
        </Button>
      </Box>
    </Box>
  );
}

export default function TicketCheck() {
  const router = useRouter();
  const [query, setQuery]           = useState("");
  const [tickets, setTickets]       = useState([]);
  const [notFound, setNotFound]     = useState(false);
  const [searching, setSearching]   = useState(false);
  const [toggling, setToggling]     = useState(null);
  const [tab, setTab]               = useState("valid");
  const [viewTicket, setViewTicket] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sessionStorage.getItem("admin_auth")) { router.push("/admin"); return; }
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    // fetch all approved bookings matching id or phone
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("status", "approved")
      .or(`id.eq.${q},phone.eq.${q}`)
      .order("timestamp", { ascending: false });
    setSearching(false);
    if (!data || data.length === 0) { setTickets([]); setNotFound(true); }
    else { setTickets(data); setNotFound(false); setTab("valid"); }
  }

  async function handleToggle(ticket) {
    if (ticket.used) return;
    setToggling(ticket.id);
    const usedAt = new Date().toLocaleString("en-BD", { dateStyle: "full", timeStyle: "short" });
    const { error } = await supabase
      .from("bookings")
      .update({ used: true, used_at: usedAt })
      .eq("id", ticket.id);
    setToggling(null);
    if (!error) {
      const updated = { ...ticket, used: true, used_at: usedAt };
      setTickets(prev => prev.map(t => t.id === ticket.id ? updated : t));
      if (viewTicket?.id === ticket.id) setViewTicket(updated);
    }
  }

  function handleClear() {
    setQuery(""); setTickets([]); setNotFound(false);
  }

  const validTickets   = tickets.filter(t => !t.used);
  const visitedTickets = tickets.filter(t => t.used);
  const currentList    = tab === "valid" ? validTickets : visitedTickets;

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", p: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">

        {/* Header */}
        <Box mb={4}>
          <Typography fontWeight={800} fontSize="1.5rem" color="#1a2e1a">Ticket Check</Typography>
          <Typography color="text.secondary" fontSize="0.85rem" mt={0.5}>
            Search by Phone or Booking ID — shows all approved tickets
          </Typography>
        </Box>

        {/* Search */}
        <Box sx={{ bgcolor: "#fff", borderRadius: 3, p: { xs: 3, md: 4 }, mb: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1.5px solid #e8f5e9" }}>
          <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Phone Number or Booking ID"
              placeholder="e.g. 01712345678 or BK-1234567"
              value={query}
              onChange={e => { setQuery(e.target.value); setNotFound(false); setTickets([]); }}
              sx={{ flex: 1, minWidth: 240 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#aaa", fontSize: "1.1rem" }} /></InputAdornment> }}
            />
            <Button type="submit" variant="contained" color="primary" size="large"
              sx={{ px: 4, fontWeight: 700, minWidth: 140 }} disabled={searching}>
              {searching ? <CircularProgress size={22} color="inherit" /> : "Search"}
            </Button>
            {(tickets.length > 0 || notFound) && (
              <Button variant="outlined" color="primary" onClick={handleClear} sx={{ px: 3 }}>Clear</Button>
            )}
          </Box>
        </Box>

        {/* Not Found */}
        {notFound && (
          <Alert severity="error" sx={{ borderRadius: 3, mb: 3 }}>
            No approved booking found for "<strong>{query}</strong>".
          </Alert>
        )}

        {/* Tabs + Results */}
        {tickets.length > 0 && (
          <Box>
            <Box sx={{ bgcolor: "#fff", borderRadius: 3, border: "1.5px solid #e8f5e9", mb: 3, overflow: "hidden" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, flexWrap: "wrap", gap: 1 }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}
                  sx={{
                    "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.85rem", minHeight: 52 },
                    "& .Mui-selected": { color: "#2e7d32 !important", fontWeight: 800 },
                    "& .MuiTabs-indicator": { bgcolor: "#2e7d32" },
                  }}>
                  <Tab value="valid" label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ConfirmationNumberIcon sx={{ fontSize: "1rem", color: tab === "valid" ? "#2e7d32" : "#aaa" }} />
                      Valid ({validTickets.length})
                    </Box>
                  } />
                  <Tab value="visited" label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: "1rem", color: tab === "visited" ? "#1565c0" : "#aaa" }} />
                      Visited ({visitedTickets.length})
                    </Box>
                  } />
                </Tabs>
                <Chip
                  label={`${tickets.length} ticket${tickets.length > 1 ? "s" : ""} found`}
                  size="small" color="primary" sx={{ fontWeight: 700 }}
                />
              </Box>
            </Box>

            {currentList.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, bgcolor: "#fff", borderRadius: 3, border: "1.5px solid #f0f0f0" }}>
                <ConfirmationNumberIcon sx={{ fontSize: "3rem", color: "#ddd" }} />
                <Typography color="text.secondary" mt={2} fontWeight={600}>
                  No {tab} tickets
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {currentList.map(ticket => (
                  <TicketRow key={ticket.id} ticket={ticket} onView={t => setViewTicket(t)} />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Container>

      <TicketDialog
        ticket={viewTicket}
        open={!!viewTicket}
        onClose={() => setViewTicket(null)}
        onToggle={handleToggle}
        toggling={toggling}
      />
    </Box>
  );
}
