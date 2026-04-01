import { useEffect, useState } from "react";
import {
  Box, Container, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Button, Chip, CircularProgress,
  TextField, InputAdornment, Alert, TableContainer, Tabs, Tab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InboxIcon from "@mui/icons-material/Inbox";
import supabase from "@/lib/supabase";

function StatusChip({ status }) {
  const s = status || "pending";
  const map = {
    pending:  { label: "Pending",  bgcolor: "#fff8e1", color: "#f57f17", border: "#ffe082" },
    approved: { label: "Approved", bgcolor: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
    rejected: { label: "Rejected", bgcolor: "#ffebee", color: "#c62828", border: "#ef9a9a" },
  };
  const c = map[s] || map.pending;
  return (
    <Box sx={{ display: "inline-block", px: 1.5, py: 0.4, borderRadius: 2, fontSize: "0.75rem", fontWeight: 700, bgcolor: c.bgcolor, color: c.color, border: `1px solid ${c.border}` }}>
      {c.label}
    </Box>
  );
}

export default function BookingList() {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [tab, setTab]             = useState("all");
  const [approving, setApproving] = useState(null);
  const [msg, setMsg]             = useState(null);

  async function fetchBookings() {
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("timestamp", { ascending: false });
    if (data) setBookings(data);
    setLoading(false);
  }

  useEffect(() => { fetchBookings(); }, []);

  async function handleApprove(id) {
    setApproving(id);
    const { error } = await supabase.from("bookings").update({ status: "approved" }).eq("id", id);
    setApproving(null);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "approved" } : b));
      setMsg({ type: "success", text: "Booking approved successfully!" });
      setTimeout(() => setMsg(null), 3000);
    }
  }

  async function handleReject(id) {
    setApproving(id);
    const { error } = await supabase.from("bookings").update({ status: "rejected" }).eq("id", id);
    setApproving(null);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "rejected" } : b));
      setMsg({ type: "error", text: "Booking rejected." });
      setTimeout(() => setMsg(null), 3000);
    }
  }

  const counts = {
    all:      bookings.length,
    pending:  bookings.filter(b => (b.status || "pending") === "pending").length,
    approved: bookings.filter(b => b.status === "approved").length,
    rejected: bookings.filter(b => b.status === "rejected").length,
  };

  const filtered = bookings
    .filter(b => tab === "all" ? true : (b.status || "pending") === tab)
    .filter(b =>
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      (b.trx_id || "").toLowerCase().includes(search.toLowerCase())
    );

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", p: { xs: 2, md: 4 } }}>
      <Container maxWidth="xl" disableGutters>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography fontWeight={800} color="#1a2e1a" fontSize="1.5rem">Booking List</Typography>
          <Typography color="text.secondary" fontSize="0.85rem" mt={0.5}>
            Manage and approve visitor bookings
          </Typography>
        </Box>

        {/* Alert */}
        {msg && (
          <Alert severity={msg.type} sx={{ mb: 3, borderRadius: 2 }} onClose={() => setMsg(null)}>
            {msg.text}
          </Alert>
        )}

        {/* Main Card */}
        <Box sx={{ bgcolor: "#fff", borderRadius: 2, border: "1.5px solid #e8f5e9", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>

          {/* Tabs + Search */}
          <Box sx={{ borderBottom: "1px solid #e8f5e9", px: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                "& .MuiTab-root": { color: "#888", fontWeight: 600, fontSize: "0.82rem", minHeight: 48, textTransform: "none" },
                "& .Mui-selected": { color: "#2e7d32 !important" },
                "& .MuiTabs-indicator": { bgcolor: "#2e7d32" },
              }}
            >
              {[
                { value: "all",      label: `All (${counts.all})` },
                { value: "pending",  label: `Pending (${counts.pending})` },
                { value: "approved", label: `Approved (${counts.approved})` },
                { value: "rejected", label: `Rejected (${counts.rejected})` },
              ].map(t => <Tab key={t.value} value={t.value} label={t.label} />)}
            </Tabs>

            <TextField
              placeholder="Search ID, name, phone, TrxID..."
              size="small"
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ width: { xs: "100%", sm: 280 }, my: 1 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#aaa", fontSize: "1.1rem" }} /></InputAdornment> }}
            />
          </Box>

          {/* Table */}
          {loading ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <CircularProgress color="primary" />
              <Typography color="text.secondary" mt={2} fontSize="0.85rem">Loading bookings...</Typography>
            </Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <InboxIcon sx={{ fontSize: "3.5rem", color: "#ccc" }} />
              <Typography color="text.secondary" mt={2} fontWeight={600}>No bookings found</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f1f8f1" }}>
                    {["Booking ID", "Name", "Phone", "Persons", "Total", "bKash No.", "TrxID", "Date", "Status", "Action"].map(h => (
                      <TableCell key={h} sx={{ color: "#2e7d32", fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 0.8, whiteSpace: "nowrap", borderBottom: "1.5px solid #e8f5e9", py: 1.5 }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((b, i) => (
                    <TableRow key={b.id} sx={{
                      bgcolor: i % 2 === 0 ? "#fff" : "#fafff9",
                      "&:hover": { bgcolor: "#f1f8f1" },
                      "& td": { borderBottom: "1px solid #f0f4f0" },
                    }}>
                      <TableCell>
                        <Chip label={b.id} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700, fontSize: "0.72rem" }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#1a2e1a" }}>{b.name}</TableCell>
                      <TableCell sx={{ color: "text.secondary", fontSize: "0.82rem" }}>{b.phone}</TableCell>
                      <TableCell>
                        <Chip label={`${b.persons} person${b.persons > 1 ? "s" : ""}`} size="small"
                          sx={{ bgcolor: "#e3f2fd", color: "#1565c0", fontWeight: 600, fontSize: "0.72rem" }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#2e7d32" }}>৳{b.total}</TableCell>
                      <TableCell sx={{ color: "text.secondary", fontSize: "0.82rem" }}>{b.bkash_number || "—"}</TableCell>
                      <TableCell>
                        <Chip label={b.trx_id || "—"} size="small"
                          sx={{ bgcolor: "#fff8e1", color: "#f57f17", fontWeight: 600, fontSize: "0.72rem" }} />
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary", fontSize: "0.75rem", whiteSpace: "nowrap" }}>{b.date}</TableCell>
                      <TableCell><StatusChip status={b.status} /></TableCell>
                      <TableCell>
                        {(b.status || "pending") === "pending" && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button size="small" variant="contained" color="success"
                              disabled={approving === b.id}
                              onClick={() => handleApprove(b.id)}
                              sx={{ fontSize: "0.72rem", fontWeight: 700, borderRadius: 2, px: 1.5, minWidth: 0 }}
                              startIcon={approving === b.id ? null : <CheckCircleIcon sx={{ fontSize: "0.9rem !important" }} />}
                            >
                              {approving === b.id ? <CircularProgress size={12} color="inherit" /> : "Approve"}
                            </Button>
                            <Button size="small" variant="outlined" color="error"
                              disabled={approving === b.id}
                              onClick={() => handleReject(b.id)}
                              sx={{ fontSize: "0.72rem", fontWeight: 700, borderRadius: 2, px: 1.5, minWidth: 0 }}
                              startIcon={<CancelIcon sx={{ fontSize: "0.9rem !important" }} />}
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                        {b.status === "approved" && <Typography fontSize="0.75rem" color="#2e7d32" fontWeight={700}>Done</Typography>}
                        {b.status === "rejected" && <Typography fontSize="0.75rem" color="#c62828" fontWeight={700}>Rejected</Typography>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Typography color="text.secondary" fontSize="0.78rem" mt={2}>
          Showing {filtered.length} of {bookings.length} bookings
        </Typography>
      </Container>
    </Box>
  );
}
