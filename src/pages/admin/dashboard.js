import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box, Container, Typography, Button, Chip, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, InputAdornment, IconButton, Alert, Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/Inbox";
import Link from "next/link";
import supabase from "@/lib/supabase";

function StatCard({ icon, label, value, color }) {
  return (
    <Box sx={{
      bgcolor: "#fff", borderRadius: 2, p: 3, textAlign: "center",
      boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
      border: "1.5px solid", borderColor: "divider",
      borderTop: "4px solid", borderTopColor: color,
    }}>
      <Box sx={{ color, fontSize: "2rem", display: "flex", justifyContent: "center" }}>{icon}</Box>
      <Typography variant="h4" fontWeight={800} sx={{ color }} mt={1}>{value}</Typography>
      <Typography color="text.secondary" fontSize="0.85rem" mt={0.5}>{label}</Typography>
    </Box>
  );
}

// get all unique booking dates from stored bookings
function getBookingDates(bookings) {
  const dates = new Set();
  bookings.forEach(b => {
    // stored date string — extract YYYY-MM-DD
    const d = new Date(b.timestamp);
    if (!isNaN(d)) dates.add(d.toISOString().slice(0, 10));
  });
  return Array.from(dates).sort((a, b) => b.localeCompare(a)); // newest first
}

function toYMD(date) {
  return date.toISOString().slice(0, 10);
}

function formatDisplay(ymd) {
  return new Date(ymd + "T00:00:00").toLocaleDateString("en-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

// mini calendar helpers
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

export default function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings]   = useState([]);
  const [search, setSearch]       = useState("");
  const [deleted, setDeleted]     = useState(false);
  const [selectedDate, setSelectedDate] = useState(toYMD(new Date()));
  const [calYear, setCalYear]     = useState(new Date().getFullYear());
  const [calMonth, setCalMonth]   = useState(new Date().getMonth());
  const [viewMode, setViewMode]   = useState("date"); // "date" | "all"

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sessionStorage.getItem("admin_auth")) { router.push("/admin"); return; }
    fetchBookings();
  }, []);

  async function fetchBookings() {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("timestamp", { ascending: false });
    if (data) setBookings(data);
  }

  async function handleDelete(id) {
    await supabase.from("bookings").delete().eq("id", id);
    setBookings(prev => prev.filter(b => b.id !== id));
    setDeleted(true);
    setTimeout(() => setDeleted(false), 2500);
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin");
  }

  // bookings that have a date matching selectedDate
  const bookingsForDate = bookings.filter(b => {
    if (!b.timestamp) return false;
    return toYMD(new Date(b.timestamp)) === selectedDate;
  });

  const displayList = viewMode === "all" ? bookings : bookingsForDate;

  const filtered = displayList.filter(b =>
    b.id.toLowerCase().includes(search.toLowerCase()) ||
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.phone.includes(search)
  );

  // dates that have bookings (for calendar highlight)
  const activeDates = new Set(
    bookings
      .filter(b => b.timestamp)
      .map(b => toYMD(new Date(b.timestamp)))
  );

  const totalPersons = bookings.reduce((s, b) => s + b.persons, 0);
  const totalRevenue = bookings.reduce((s, b) => s + b.total, 0);
  const datePersons  = bookingsForDate.reduce((s, b) => s + b.persons, 0);
  const dateRevenue  = bookingsForDate.reduce((s, b) => s + b.total, 0);

  // calendar nav
  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  }

  const daysInMonth  = getDaysInMonth(calYear, calMonth);
  const firstDay     = getFirstDayOfMonth(calYear, calMonth);
  const today        = toYMD(new Date());

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Container maxWidth="xl" sx={{ py: 5 }}>

        {/* ── OVERALL STATS ── */}
        <Typography variant="h5" fontWeight={800} mb={3}>Overall Overview</Typography>
        <Grid container spacing={3} mb={5}>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard icon={<ConfirmationNumberIcon sx={{ fontSize: "2rem" }} />} label="Total Bookings" value={bookings.length}     color="#2e7d32" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard icon={<PeopleIcon sx={{ fontSize: "2rem" }} />}             label="Total Visitors" value={totalPersons}        color="#1565c0" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard icon={<AttachMoneyIcon sx={{ fontSize: "2rem" }} />}        label="Total Revenue"  value={`৳${totalRevenue}`} color="#6a1b9a" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard icon={<CalendarTodayIcon sx={{ fontSize: "2rem" }} />}      label="Today"          value={new Date().toLocaleDateString("en-BD")} color="#e65100" />
          </Grid>
        </Grid>

        <Grid container spacing={4}>

          {/* ── LEFT: CALENDAR ── */}
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <Box sx={{ bgcolor: "#fff", borderRadius: 2, p: 3, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1.5px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <CalendarTodayIcon sx={{ color: "primary.main", fontSize: "1.1rem" }} />
                <Typography fontWeight={800} color="primary.main">Select Date</Typography>
              </Box>

              {/* Month nav */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <IconButton size="small" onClick={prevMonth} sx={{ color: "primary.main" }}><ChevronLeftIcon /></IconButton>
                <Typography fontWeight={700} fontSize="0.95rem">{MONTHS[calMonth]} {calYear}</Typography>
                <IconButton size="small" onClick={nextMonth} sx={{ color: "primary.main" }}><ChevronRightIcon /></IconButton>
              </Box>

              {/* Day headers */}
              <Grid container columns={7} sx={{ mb: 0.5 }}>
                {DAYS.map(d => (
                  <Grid item key={d} sx={{ width: "14.28%" }}>
                    <Typography textAlign="center" fontSize="0.72rem" fontWeight={700} color="text.secondary">{d}</Typography>
                  </Grid>
                ))}
              </Grid>

              {/* Calendar days */}
              <Grid container columns={7}>
                {/* empty cells */}
                {Array(firstDay).fill(null).map((_, i) => (
                  <Grid item key={`e${i}`} sx={{ width: "14.28%" }} />
                ))}
                {Array(daysInMonth).fill(null).map((_, i) => {
                  const day  = i + 1;
                  const ymd  = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isSelected = ymd === selectedDate;
                  const isToday    = ymd === today;
                  const hasBooking = activeDates.has(ymd);
                  return (
                    <Grid item key={day} sx={{ width: "14.28%" }}>
                      <Box
                        onClick={() => { setSelectedDate(ymd); setViewMode("date"); setSearch(""); }}
                        sx={{
                          m: 0.3, borderRadius: 2, cursor: "pointer",
                          textAlign: "center", py: 0.6, position: "relative",
                          bgcolor: isSelected ? "primary.main" : isToday ? "secondary.dark" : "transparent",
                          "&:hover": { bgcolor: isSelected ? "primary.dark" : "secondary.dark" },
                          transition: "all 0.15s",
                        }}
                      >
                        <Typography
                          fontSize="0.82rem"
                          fontWeight={isSelected || isToday ? 800 : 400}
                          color={isSelected ? "#fff" : isToday ? "primary.main" : "text.primary"}
                        >
                          {day}
                        </Typography>
                        {/* booking dot */}
                        {hasBooking && (
                          <Box sx={{
                            width: 5, height: 5, borderRadius: "50%",
                            bgcolor: isSelected ? "#fff" : "primary.main",
                            mx: "auto", mt: 0.2,
                          }} />
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Date stats */}
              <Typography fontWeight={700} fontSize="0.82rem" color="text.secondary" mb={1.5}>
                {formatDisplay(selectedDate)}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography fontSize="0.85rem" color="text.secondary">Bookings</Typography>
                <Chip label={bookingsForDate.length} color="primary" size="small" />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography fontSize="0.85rem" color="text.secondary">Visitors</Typography>
                <Chip label={datePersons} size="small" sx={{ bgcolor: "#e3f2fd", color: "#1565c0", fontWeight: 700 }} />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontSize="0.85rem" color="text.secondary">Revenue</Typography>
                <Chip label={`৳${dateRevenue}`} size="small" sx={{ bgcolor: "#f3e5f5", color: "#6a1b9a", fontWeight: 700 }} />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* View toggle */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  fullWidth size="small" variant={viewMode === "date" ? "contained" : "outlined"}
                  color="primary" onClick={() => setViewMode("date")}
                >
                  This Date
                </Button>
                <Button
                  fullWidth size="small" variant={viewMode === "all" ? "contained" : "outlined"}
                  color="primary" onClick={() => setViewMode("all")}
                >
                  All
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* ── RIGHT: BOOKING TABLE ── */}
          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  {viewMode === "date" ? `Bookings — ${formatDisplay(selectedDate)}` : "All Bookings"}
                </Typography>
                <Typography color="text.secondary" fontSize="0.85rem" mt={0.3}>
                  {filtered.length} booking{filtered.length !== 1 ? "s" : ""} found
                </Typography>
              </Box>
              <TextField
                placeholder="Search ID, name, phone..."
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: { xs: "100%", sm: 280 } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#aaa", fontSize: "1.1rem" }} /></InputAdornment> }}
              />
            </Box>

            {deleted && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>Booking deleted successfully.</Alert>}

            {filtered.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 10, bgcolor: "#fff", borderRadius: 2, border: "1.5px solid", borderColor: "divider" }}>
                <InboxIcon sx={{ fontSize: "3rem", color: "#ccc" }} />
                <Typography color="text.secondary" mt={2} fontWeight={600}>
                  {viewMode === "date"
                    ? `No bookings on ${formatDisplay(selectedDate)}`
                    : "No bookings found"}
                </Typography>
                <Typography color="text.secondary" fontSize="0.85rem" mt={1}>
                  {viewMode === "date" && "Try selecting a different date or click 'All' to see everything"}
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1.5px solid", borderColor: "divider" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "secondary.dark" }}>
                      {["Booking ID", "Name", "Phone", "Persons", "Total", "Date & Time", "Action"].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 800, color: "primary.dark", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((b, i) => (
                      <TableRow key={b.id} sx={{ bgcolor: i % 2 === 0 ? "#fff" : "#fafff9", "&:hover": { bgcolor: "secondary.dark" } }}>
                        <TableCell><Chip label={b.id} color="primary" size="small" variant="outlined" /></TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{b.name}</TableCell>
                        <TableCell sx={{ color: "text.secondary", fontSize: "0.88rem" }}>{b.phone}</TableCell>
                        <TableCell>
                          <Chip label={`${b.persons} person${b.persons > 1 ? "s" : ""}`} size="small"
                            sx={{ bgcolor: "#e3f2fd", color: "#1565c0", fontWeight: 600 }} />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: "primary.main" }}>৳{b.total}</TableCell>
                        <TableCell sx={{ fontSize: "0.82rem", color: "text.secondary", whiteSpace: "nowrap" }}>{b.date}</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleDelete(b.id)}
                            sx={{ color: "#e53935", "&:hover": { bgcolor: "#ffebee" } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
