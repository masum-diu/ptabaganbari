import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box, Container, Typography, Button, Chip, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, IconButton, Alert, Divider, CircularProgress,
  Dialog, DialogContent,
} from "@mui/material";
import SearchIcon             from "@mui/icons-material/Search";
import DeleteIcon             from "@mui/icons-material/Delete";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon             from "@mui/icons-material/People";
import AttachMoneyIcon        from "@mui/icons-material/AttachMoney";
import TourIcon               from "@mui/icons-material/Tour";
import CalendarTodayIcon      from "@mui/icons-material/CalendarToday";
import ChevronLeftIcon        from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon       from "@mui/icons-material/ChevronRight";
import InboxIcon              from "@mui/icons-material/Inbox";
import CheckCircleIcon        from "@mui/icons-material/CheckCircle";
import CancelIcon             from "@mui/icons-material/Cancel";
import VisibilityIcon         from "@mui/icons-material/Visibility";
import CloseIcon              from "@mui/icons-material/Close";
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
            <Grid size={{ xs: 12, sm: 6 }} key={label}>
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

function StatCard({ icon, label, value, color }) {
  return (
    <Box sx={{
      bgcolor: "#fff", borderRadius: 2, p: 3, textAlign: "center",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      border: "1.5px solid #f0f0f0",
      borderTop: "4px solid", borderTopColor: color,
    }}>
      <Box sx={{ color, display: "flex", justifyContent: "center", mb: 1 }}>{icon}</Box>
      <Typography variant="h4" fontWeight={800} sx={{ color }}>{value}</Typography>
      <Typography color="text.secondary" fontSize="0.82rem" mt={0.5}>{label}</Typography>
    </Box>
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
    <Box sx={{ display: "inline-block", px: 1.5, py: 0.3, borderRadius: 2, fontSize: "0.72rem", fontWeight: 700, bgcolor: c.bgcolor, color: c.color, border: `1px solid ${c.border}`, whiteSpace: "nowrap" }}>
      {c.label}
    </Box>
  );
}

function toYMD(date) { return date.toISOString().slice(0, 10); }
function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { return new Date(y, m, 1).getDay(); }
function formatDisplay(ymd) {
  return new Date(ymd + "T00:00:00").toLocaleDateString("en-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const PAGE_SIZE = 20;

export default function AdminDashboard() {
  const router = useRouter();

  // table state
  const [bookings, setBookings]         = useState([]);
  const [tableTotal, setTableTotal]     = useState(0);
  const [page, setPage]                 = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [search, setSearch]             = useState("");
  const [searchInput, setSearchInput]   = useState("");

  // overall stats
  const [stats, setStats]               = useState({ approved: 0, visitors: 0, revenue: 0, visited: 0 });

  // date stats
  const [dateStats, setDateStats]       = useState({ approved: 0, visitors: 0, revenue: 0, visited: 0 });

  // calendar
  const [activeDates, setActiveDates]   = useState(new Set());
  const [selectedDate, setSelectedDate] = useState(toYMD(new Date()));
  const [calYear, setCalYear]           = useState(new Date().getFullYear());
  const [calMonth, setCalMonth]         = useState(new Date().getMonth());
  const [viewMode, setViewMode]         = useState("date");

  const [deleted, setDeleted]           = useState(false);
  const [approving, setApproving]       = useState(null);
  const [actionMsg, setActionMsg]       = useState(null);
  const [viewBooking, setViewBooking]   = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sessionStorage.getItem("admin_auth")) { router.push("/admin"); return; }
    fetchStats();
    fetchActiveDates();
  }, []);

  useEffect(() => { fetchDateStats(selectedDate); }, [selectedDate]);

  useEffect(() => { fetchTable(); }, [viewMode, selectedDate, search, page]);

  // ── overall stats via RPC-free aggregate ──
  async function fetchStats() {
    const [{ data: app }, { data: vis }] = await Promise.all([
      supabase.from("bookings").select("persons, total").eq("status", "approved"),
      supabase.from("bookings").select("persons").eq("used", true),
    ]);
    const approved = app?.length || 0;
    const revenue  = app?.reduce((s, b) => s + b.total, 0) || 0;
    const totalP   = app?.reduce((s, b) => s + b.persons, 0) || 0;
    const visited  = vis?.reduce((s, b) => s + b.persons, 0) || 0;
    setStats({ approved, revenue, visitors: totalP - visited, visited });
  }

  async function fetchActiveDates() {
    const { data } = await supabase.from("bookings").select("timestamp");
    if (data) setActiveDates(new Set(data.map(b => toYMD(new Date(b.timestamp)))));
  }

  async function fetchDateStats(ymd) {
    const start = ymd + "T00:00:00.000Z";
    const end   = ymd + "T23:59:59.999Z";
    const [{ data: app }, { data: vis }] = await Promise.all([
      supabase.from("bookings").select("persons, total").eq("status", "approved").gte("timestamp", start).lte("timestamp", end),
      supabase.from("bookings").select("persons").eq("used", true).gte("timestamp", start).lte("timestamp", end),
    ]);
    const approved = app?.length || 0;
    const revenue  = app?.reduce((s, b) => s + b.total, 0) || 0;
    const totalP   = app?.reduce((s, b) => s + b.persons, 0) || 0;
    const visited  = vis?.reduce((s, b) => s + b.persons, 0) || 0;
    setDateStats({ approved, revenue, visitors: totalP - visited, visited });
  }

  async function fetchTable() {
    setTableLoading(true);
    let query = supabase.from("bookings").select("*", { count: "exact" }).order("timestamp", { ascending: false });

    if (viewMode === "date") {
      query = query.gte("timestamp", selectedDate + "T00:00:00.000Z").lte("timestamp", selectedDate + "T23:59:59.999Z");
    } else {
      query = query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    }

    if (search) {
      query = query.or(`id.ilike.%${search}%,name.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, count } = await query;
    setBookings(data || []);
    setTableTotal(count || 0);
    setTableLoading(false);
  }

  async function handleApprove(id) {
    setApproving(id);
    const { error } = await supabase.from("bookings").update({ status: "approved" }).eq("id", id);
    setApproving(null);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "approved" } : b));
      setActionMsg({ type: "success", text: "Booking approved!" });
      setTimeout(() => setActionMsg(null), 2500);
      fetchStats();
    }
  }

  async function handleReject(id) {
    setApproving(id);
    const { error } = await supabase.from("bookings").update({ status: "rejected" }).eq("id", id);
    setApproving(null);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "rejected" } : b));
      setActionMsg({ type: "error", text: "Booking rejected." });
      setTimeout(() => setActionMsg(null), 2500);
    }
  }

  async function handleDelete(id) {
    await supabase.from("bookings").delete().eq("id", id);
    setBookings(prev => prev.filter(b => b.id !== id));
    setTableTotal(t => t - 1);
    setDeleted(true);
    setTimeout(() => setDeleted(false), 2500);
    fetchStats();
  }

  function handleSearch(e) { e.preventDefault(); setSearch(searchInput); setPage(0); }

  const filtered    = bookings;
  const totalPages  = Math.ceil(tableTotal / PAGE_SIZE);

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  }

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay    = getFirstDay(calYear, calMonth);
  const today       = toYMD(new Date());

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 4 } }}>

        <Typography variant="h5" fontWeight={800} mb={3} color="#1a2e1a">Overall Overview</Typography>
        <Grid container spacing={3} mb={4}>
          {[
            { icon: <ConfirmationNumberIcon sx={{ fontSize: "2rem" }} />, label: "Approved Bookings", value: stats.approved,         color: "#2e7d32" },
            { icon: <PeopleIcon            sx={{ fontSize: "2rem" }} />, label: "Total Visitors",    value: stats.visitors,         color: "#1565c0" },
            { icon: <AttachMoneyIcon       sx={{ fontSize: "2rem" }} />, label: "Total Revenue",     value: `৳${stats.revenue}`,   color: "#6a1b9a" },
            { icon: <TourIcon              sx={{ fontSize: "2rem" }} />, label: "Total Visited",     value: stats.visited,          color: "#e65100" },
          ].map(s => (
            <Grid size={{ xs: 12, md: 3 }} key={s.label}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>

          {/* ── CALENDAR ── */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ bgcolor: "#fff", borderRadius: 2, p: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1.5px solid #f0f0f0" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <CalendarTodayIcon sx={{ color: "primary.main", fontSize: "1rem" }} />
                <Typography fontWeight={800} color="primary.main" fontSize="0.9rem">Select Date</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <IconButton size="small" onClick={prevMonth} sx={{ color: "primary.main" }}><ChevronLeftIcon /></IconButton>
                <Typography fontWeight={700} fontSize="0.88rem">{MONTHS[calMonth]} {calYear}</Typography>
                <IconButton size="small" onClick={nextMonth} sx={{ color: "primary.main" }}><ChevronRightIcon /></IconButton>
              </Box>

              <Grid container columns={7} sx={{ mb: 0.5 }}>
                {DAYS.map(d => (
                  <Grid item key={d} sx={{ width: "14.28%" }}>
                    <Typography textAlign="center" fontSize="0.68rem" fontWeight={700} color="text.secondary">{d}</Typography>
                  </Grid>
                ))}
              </Grid>

              <Grid container columns={7}>
                {Array(firstDay).fill(null).map((_, i) => <Grid item key={`e${i}`} sx={{ width: "14.28%" }} />)}
                {Array(daysInMonth).fill(null).map((_, i) => {
                  const day = i + 1;
                  const ymd = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isSelected = ymd === selectedDate;
                  const isToday    = ymd === today;
                  const hasBkg     = activeDates.has(ymd);
                  return (
                    <Grid item key={day} sx={{ width: "14.28%" }}>
                      <Box onClick={() => { setSelectedDate(ymd); setViewMode("date"); setSearch(""); }}
                        sx={{
                          m: 0.2, borderRadius: 1.5, cursor: "pointer", textAlign: "center", py: 0.5,
                          bgcolor: isSelected ? "primary.main" : isToday ? "#e8f5e9" : "transparent",
                          "&:hover": { bgcolor: isSelected ? "primary.dark" : "#f1f8f1" },
                          transition: "all 0.15s",
                        }}>
                        <Typography fontSize="0.78rem" fontWeight={isSelected || isToday ? 800 : 400}
                          color={isSelected ? "#fff" : isToday ? "primary.main" : "text.primary"}>
                          {day}
                        </Typography>
                        {hasBkg && <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: isSelected ? "#fff" : "primary.main", mx: "auto" }} />}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>

              <Divider sx={{ my: 2 }} />
              <Typography fontWeight={700} fontSize="0.75rem" color="text.secondary" mb={1.5}>{formatDisplay(selectedDate)}</Typography>
              {[
                { label: "Approved", value: dateStats.approved,         sx: { bgcolor: "#e8f5e9", color: "#2e7d32" } },
                { label: "Visitors", value: dateStats.visitors,         sx: { bgcolor: "#e3f2fd", color: "#1565c0" } },
                { label: "Revenue",  value: `৳${dateStats.revenue}`,   sx: { bgcolor: "#f3e5f5", color: "#6a1b9a" } },
                { label: "Visited",  value: dateStats.visited,          sx: { bgcolor: "#fff3e0", color: "#e65100" } },
              ].map(r => (
                <Box key={r.label} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography fontSize="0.82rem" color="text.secondary">{r.label}</Typography>
                  <Chip label={r.value} size="small" sx={{ ...r.sx, fontWeight: 700, height: 22, fontSize: "0.72rem" }} />
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button fullWidth size="small" variant={viewMode === "date" ? "contained" : "outlined"} color="primary" onClick={() => setViewMode("date")}>
                  This Date
                </Button>
                <Button fullWidth size="small" variant={viewMode === "all" ? "contained" : "outlined"} color="primary" onClick={() => setViewMode("all")}>
                  All
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* ── BOOKING TABLE ── */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  {viewMode === "date" ? `Bookings — ${formatDisplay(selectedDate)}` : "All Bookings"}
                </Typography>
                <Typography color="text.secondary" fontSize="0.82rem">
                  {viewMode === "date" ? `${filtered.length} booking${filtered.length !== 1 ? "s" : ""}` : `${tableTotal} total`}
                </Typography>
              </Box>
              <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 1 }}>
                <TextField
                  placeholder="Search ID, name, phone..."
                  size="small"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  sx={{ width: { xs: "100%", sm: 220 } }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#aaa", fontSize: "1rem" }} /></InputAdornment> }}
                />
                <Button type="submit" variant="contained" color="primary" size="small" sx={{ fontWeight: 700, px: 2 }}>Search</Button>
                {search && <Button size="small" onClick={() => { setSearch(""); setSearchInput(""); setPage(0); }}>Clear</Button>}
              </Box>
            </Box>

            {(deleted || actionMsg) && (
              <Alert severity={actionMsg?.type || "success"} sx={{ mb: 2, borderRadius: 2 }}>
                {actionMsg?.text || "Booking deleted successfully."}
              </Alert>
            )}

            {tableLoading ? (
              <Box sx={{ textAlign: "center", py: 6 }}><CircularProgress color="primary" /></Box>
            ) : filtered.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8, bgcolor: "#fff", borderRadius: 2, border: "1.5px solid #f0f0f0" }}>
                <InboxIcon sx={{ fontSize: "3rem", color: "#ddd" }} />
                <Typography color="text.secondary" mt={1.5} fontWeight={600}>
                  {viewMode === "date" ? `No bookings on ${formatDisplay(selectedDate)}` : "No bookings found"}
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1.5px solid #f0f0f0" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f1f8f1" }}>
                      {["Booking ID", "Name", "Phone", "Persons", "Total", "Status"].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 800, color: "#2e7d32", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap", py: 1.5, borderBottom: "1.5px solid #e8f5e9" }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((b, i) => (
                      <TableRow key={b.id} sx={{ bgcolor: i % 2 === 0 ? "#fff" : "#fafff9", "&:hover": { bgcolor: "#f1f8f1" }, "& td": { borderBottom: "1px solid #f5f5f5", py: 1 } }}>
                        <TableCell>
                          <Chip label={b.id} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700, fontSize: "0.7rem" }} />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: "0.82rem", whiteSpace: "nowrap" }}>{b.name}</TableCell>
                        <TableCell sx={{ color: "text.secondary", fontSize: "0.8rem", whiteSpace: "nowrap" }}>{b.phone}</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: "0.8rem", textAlign: "center" }}>{b.persons}</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: "#2e7d32", fontSize: "0.82rem", whiteSpace: "nowrap" }}>৳{b.total}</TableCell>
                        <TableCell><StatusChip status={b.status} /></TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {viewMode === "all" && totalPages > 1 && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, flexWrap: "wrap", gap: 1 }}>
                  <Typography color="text.secondary" fontSize="0.78rem">
                    Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, tableTotal)} of {tableTotal}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button size="small" variant="outlined" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</Button>
                    <Typography sx={{ px: 1.5, py: 0.5, fontSize: "0.82rem", fontWeight: 700 }}>{page + 1} / {totalPages}</Typography>
                    <Button size="small" variant="outlined" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</Button>
                  </Box>
                </Box>
              )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>

      <BookingDetailModal booking={viewBooking} open={!!viewBooking} onClose={() => setViewBooking(null)} />
    </Box>
  );
}
