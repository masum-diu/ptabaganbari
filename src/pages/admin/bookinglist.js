import { useEffect, useState } from "react";
import {
  Box, Container, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Button, Chip, CircularProgress,
  TextField, InputAdornment, Alert, TableContainer, Tabs, Tab,
  Dialog, DialogContent, Divider, Grid, IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InboxIcon from "@mui/icons-material/Inbox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import supabase from "@/lib/supabase";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-BD", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function BookingDetailModal({ booking: b, open, onClose }) {
  if (!b) return null;
  const rows = [
    ["Booking ID", b.id],
    ["Name", b.name],
    ["Phone", b.phone],
    ["Persons", `${b.persons} ${b.persons === 1 ? "Person" : "Persons"}`],
    ["Total", `৳${b.total}`],
    ["bKash Number", b.bkash_number || "—"],
    ["Transaction ID", b.trx_id || "—"],
    ["Date", b.date],
    ["Status", b.status || "pending"],
    ["Visited", b.used ? `Yes — ${fmtDate(b.used_at)}` : "No"],
  ];
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 2, overflow: "hidden" } }}>
      <Box sx={{ background: "linear-gradient(135deg,#1b5e20,#2e7d32)", px: 3, py: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography fontWeight={800} color="#fff">{b.id}</Typography>
          <Typography color="rgba(255,255,255,0.75)" fontSize="0.75rem">{b.date}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "rgba(255,255,255,0.8)" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <DialogContent sx={{ px: 3, py: 3 }}>
        <Grid container spacing={1.5}>
          {rows.map(([label, value]) => (
            <Grid item xs={6} key={label}>
              <Typography color="text.secondary" fontSize="0.7rem" mb={0.3}>{label}</Typography>
              <Typography fontWeight={700} fontSize="0.88rem"
                color={label === "Total" ? "primary.main" : label === "Status" ? (b.status === "approved" ? "#2e7d32" : b.status === "rejected" ? "#c62828" : "#f57f17") : "text.primary"}>
                {value}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 2 }} />
        <StatusChip status={b.status} />
      </DialogContent>
    </Dialog>
  );
}

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

const PAGE_SIZE = 20;

export default function BookingList() {
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [tab, setTab]                 = useState("all");
  const [approving, setApproving]     = useState(null);
  const [msg, setMsg]                 = useState(null);
  const [viewBooking, setViewBooking] = useState(null);
  const [page, setPage]               = useState(0);
  const [total, setTotal]             = useState(0);

  async function fetchBookings(currentTab, currentSearch, currentPage) {
    setLoading(true);
    let query = supabase
      .from("bookings")
      .select("*", { count: "exact" })
      .order("timestamp", { ascending: false })
      .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);

    if (currentTab !== "all") query = query.eq("status", currentTab);
    if (currentSearch) {
      query = query.or(
        `id.ilike.%${currentSearch}%,name.ilike.%${currentSearch}%,phone.ilike.%${currentSearch}%,trx_id.ilike.%${currentSearch}%`
      );
    }

    const { data, count } = await query;
    setBookings(data || []);
    setTotal(count || 0);
    setLoading(false);
  }

  useEffect(() => { fetchBookings(tab, search, page); }, [tab, search, page]);

  function handleTabChange(newTab) { setTab(newTab); setPage(0); }
  function handleSearch(e) { e.preventDefault(); setSearch(searchInput); setPage(0); }

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

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const filtered = bookings;

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
              onChange={(_, v) => handleTabChange(v)}
              sx={{
                "& .MuiTab-root": { color: "#888", fontWeight: 600, fontSize: "0.82rem", minHeight: 48, textTransform: "none" },
                "& .Mui-selected": { color: "#2e7d32 !important" },
                "& .MuiTabs-indicator": { bgcolor: "#2e7d32" },
              }}
            >
              {[
                { value: "all",      label: "All" },
                { value: "pending",  label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
              ].map(t => <Tab key={t.value} value={t.value} label={t.label} />)}
            </Tabs>

            <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 1, my: 1 }}>
              <TextField
                placeholder="Search ID, name, phone, TrxID..."
                size="small"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                sx={{ width: { xs: "100%", sm: 240 } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#aaa", fontSize: "1.1rem" }} /></InputAdornment> }}
              />
              <Button type="submit" variant="contained" color="primary" size="small" sx={{ fontWeight: 700, px: 2 }}>Search</Button>
              {search && <Button size="small" onClick={() => { setSearch(""); setSearchInput(""); setPage(0); }}>Clear</Button>}
            </Box>
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
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f1f8f1" }}>
                    {["Booking ID", "Name", "Phone", "Persons", "Total", "Status", "Action"].map(h => (
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
                      "& td": { borderBottom: "1px solid #f0f4f0", py: 1 },
                    }}>
                      <TableCell>
                        <Chip label={b.id} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700, fontSize: "0.7rem" }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#1a2e1a", fontSize: "0.82rem", whiteSpace: "nowrap" }}>{b.name}</TableCell>
                      <TableCell sx={{ color: "text.secondary", fontSize: "0.8rem", whiteSpace: "nowrap" }}>{b.phone}</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.8rem", textAlign: "center" }}>{b.persons}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#2e7d32", fontSize: "0.82rem", whiteSpace: "nowrap" }}>৳{b.total}</TableCell>
                      <TableCell><StatusChip status={b.status} /></TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          <Button size="small" variant="outlined" color="primary"
                            onClick={() => setViewBooking(b)}
                            sx={{ fontSize: "0.72rem", fontWeight: 700, borderRadius: 2, px: 1.5, minWidth: 0 }}
                            startIcon={<VisibilityIcon sx={{ fontSize: "0.9rem !important" }} />}
                          >
                            View
                          </Button>
                          {(b.status || "pending") === "pending" && (
                            <>
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
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, flexWrap: "wrap", gap: 1 }}>
          <Typography color="text.secondary" fontSize="0.78rem">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total} bookings
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button size="small" variant="outlined" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</Button>
            <Typography sx={{ px: 1.5, py: 0.5, fontSize: "0.82rem", fontWeight: 700 }}>{page + 1} / {totalPages || 1}</Typography>
            <Button size="small" variant="outlined" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</Button>
          </Box>
        </Box>
      </Container>

      <BookingDetailModal booking={viewBooking} open={!!viewBooking} onClose={() => setViewBooking(null)} />
    </Box>
  );
}
