import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box, Container, Typography, TextField, Button,
  Chip, Divider, Alert, InputAdornment, Switch, CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import supabase from "@/lib/supabase";

export default function TicketCheck() {
  const router = useRouter();
  const [query, setQuery]         = useState("");
  const [result, setResult]       = useState(null);
  const [notFound, setNotFound]   = useState(false);
  const [toggling, setToggling]   = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sessionStorage.getItem("admin_auth")) { router.push("/admin"); return; }
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    setSearching(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .or(`id.ilike.${q},phone.eq.${q}`);
    setSearching(false);
    if (error || !data || data.length === 0) { setResult(null); setNotFound(true); }
    else { setResult(data[0]); setNotFound(false); }
  }

  async function handleToggleEntry() {
    if (!result || result.used) return;
    setToggling(true);
    const usedAt = new Date().toLocaleString("en-BD", { dateStyle: "full", timeStyle: "short" });
    const { error } = await supabase
      .from("bookings")
      .update({ used: true, used_at: usedAt })
      .eq("id", result.id);
    setToggling(false);
    if (!error) setResult(prev => ({ ...prev, used: true, used_at: usedAt }));
  }

  function handleClear() {
    setQuery(""); setResult(null); setNotFound(false);
  }

  const isUsed = result?.used;
  const usedAt = result?.used_at;

  const ROWS = result ? [
    { icon: <PersonIcon sx={{ fontSize: "1rem", color: "#aaa" }} />,        label: "Name",    value: result.name },
    { icon: <PhoneIcon sx={{ fontSize: "1rem", color: "#aaa" }} />,         label: "Phone",   value: result.phone },
    { icon: <PeopleIcon sx={{ fontSize: "1rem", color: "#aaa" }} />,        label: "Persons", value: `${result.persons} ${result.persons === 1 ? "Person" : "Persons"}` },
    { icon: <CalendarTodayIcon sx={{ fontSize: "1rem", color: "#aaa" }} />, label: "Booked",  value: result.date },
  ] : [];

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", p: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">

        {/* Header */}
        <Box mb={4}>
          <Typography fontWeight={800} fontSize="1.5rem" color="#1a2e1a">Ticket Check</Typography>
          <Typography color="text.secondary" fontSize="0.85rem" mt={0.5}>
            Verify visitor tickets by Booking ID or Phone Number
          </Typography>
        </Box>

        {/* Search Box */}
        <Box sx={{ bgcolor: "#fff", borderRadius: 2, p: { xs: 3, md: 4 }, mb: 3, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: "1.5px solid #e8f5e9" }}>
          <Box textAlign="center" mb={3}>
            <Box sx={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg,#1b5e20,#2e7d32)",
              display: "flex", alignItems: "center", justifyContent: "center",
              mx: "auto", mb: 2,
              boxShadow: "0 4px 16px rgba(46,125,50,0.3)",
            }}>
              <ConfirmationNumberIcon sx={{ color: "#fff", fontSize: "2rem" }} />
            </Box>
            <Typography variant="h6" fontWeight={800}>Verify Ticket</Typography>
            <Typography color="text.secondary" fontSize="0.85rem" mt={0.5}>
              Enter Booking ID or Phone Number
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Booking ID or Phone Number"
              placeholder="e.g. BK-1234567 or 01712345678"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setNotFound(false); setResult(null); }}
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#aaa", fontSize: "1.1rem" }} /></InputAdornment> }}
            />
            <Button type="submit" variant="contained" color="primary" size="large" fullWidth
              sx={{ py: 1.5, fontWeight: 700 }} disabled={searching}>
              {searching ? <CircularProgress size={22} color="inherit" /> : "Verify Ticket"}
            </Button>
            {(result || notFound) && (
              <Button variant="outlined" color="primary" fullWidth onClick={handleClear}>Clear</Button>
            )}
          </Box>
        </Box>

        {/* Not Found */}
        {notFound && (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            No booking found for "<strong>{query}</strong>". Please check and try again.
          </Alert>
        )}

        {/* Ticket Result */}
        {result && (
          <Box sx={{
            bgcolor: "#fff", borderRadius: 2, overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
            border: `2px solid ${isUsed ? "#ffcdd2" : "#c8e6c9"}`,
          }}>
            {/* Ticket Header */}
            <Box sx={{
              background: isUsed ? "linear-gradient(135deg,#c62828,#e53935)" : "linear-gradient(135deg,#1b5e20,#2e7d32)",
              py: 3.5, textAlign: "center", position: "relative",
            }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
                {isUsed
                  ? <CancelIcon sx={{ color: "#fff", fontSize: "2.8rem" }} />
                  : <CheckCircleIcon sx={{ color: "#fff", fontSize: "2.8rem" }} />
                }
              </Box>
              <Typography variant="h6" color="#fff" fontWeight={800}>
                {isUsed ? "Already Used" : "Valid Ticket"}
              </Typography>
              <Typography color="rgba(255,255,255,0.8)" fontSize="0.82rem" mt={0.3}>
                {isUsed ? `Used on: ${usedAt}` : "Ready for entry"}
              </Typography>
              <Box sx={{ position: "absolute", top: 14, right: 14, px: 1.5, py: 0.4, borderRadius: 5, bgcolor: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)" }}>
                <Typography fontSize="0.7rem" fontWeight={800} color="#fff" letterSpacing={1}>
                  {isUsed ? "USED" : "VALID"}
                </Typography>
              </Box>
            </Box>

            {/* Tear line */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "#f5f7fa", ml: -1.1, border: `1.5px solid ${isUsed ? "#ffcdd2" : "#c8e6c9"}` }} />
              <Box sx={{ flex: 1, borderTop: `2px dashed ${isUsed ? "#ffcdd2" : "#c8e6c9"}` }} />
              <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "#f5f7fa", mr: -1.1, border: `1.5px solid ${isUsed ? "#ffcdd2" : "#c8e6c9"}` }} />
            </Box>

            {/* Ticket Body */}
            <Box sx={{ px: { xs: 3, md: 4 }, py: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography color="text.secondary" fontSize="0.72rem" fontWeight={700} letterSpacing={1}>BOOKING ID</Typography>
                <Typography fontWeight={800} color="primary.main">{result.id}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {ROWS.map(row => (
                <Box key={row.label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1.2, borderBottom: "1px solid #f5f5f5" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {row.icon}
                    <Typography color="text.secondary" fontSize="0.88rem">{row.label}</Typography>
                  </Box>
                  <Typography fontWeight={600} fontSize="0.9rem">{row.value}</Typography>
                </Box>
              ))}

              {/* Total */}
              <Box sx={{ mt: 3, bgcolor: "#f1f8f1", borderRadius: 3, p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1.5px solid #c8e6c9" }}>
                <Typography fontWeight={800}>Amount Paid</Typography>
                <Typography fontWeight={800} fontSize="1.8rem" color="primary.main">৳{result.total}</Typography>
              </Box>

              {/* Entry Toggle */}
              <Box sx={{
                mt: 3, borderRadius: 3, p: 3,
                bgcolor: isUsed ? "#ffebee" : "#f1f8f1",
                border: `1.5px solid ${isUsed ? "#ffcdd2" : "#c8e6c9"}`,
              }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.5 }}>
                      {isUsed
                        ? <CancelIcon sx={{ color: "#c62828", fontSize: "1.1rem" }} />
                        : <MeetingRoomIcon sx={{ color: "#2e7d32", fontSize: "1.1rem" }} />
                      }
                      <Typography fontWeight={800} color={isUsed ? "#c62828" : "#2e7d32"} fontSize="0.95rem">
                        {isUsed ? "Entry Already Used" : "Mark as Entered"}
                      </Typography>
                    </Box>
                    <Typography color="text.secondary" fontSize="0.78rem">
                      {isUsed ? "This ticket cannot be used again." : "Toggle ON to allow entry. Cannot be undone."}
                    </Typography>
                  </Box>
                  <Switch
                    checked={!!isUsed}
                    onChange={handleToggleEntry}
                    disabled={!!isUsed || toggling}
                    color="success"
                  />
                </Box>

                {isUsed ? (
                  <Alert severity="error" sx={{ mt: 2, borderRadius: 2, fontSize: "0.82rem" }}>
                    Entry denied. This ticket was already used on {usedAt}.
                  </Alert>
                ) : (
                  <Alert severity="info" sx={{ mt: 2, borderRadius: 2, fontSize: "0.82rem" }}>
                    Once switched ON, this ticket cannot be used again.
                  </Alert>
                )}
              </Box>

              {/* Success */}
              {isUsed && (
                <Box sx={{ mt: 3, bgcolor: "#e8f5e9", borderRadius: 3, p: 2.5, textAlign: "center", border: "1.5px solid #c8e6c9" }}>
                  <CheckCircleIcon sx={{ color: "#2e7d32", fontSize: "2.5rem" }} />
                  <Typography fontWeight={800} color="#2e7d32" mt={1}>Entry Confirmed!</Typography>
                  <Typography color="text.secondary" fontSize="0.82rem" mt={0.5}>
                    {result.persons} person{result.persons > 1 ? "s" : ""} allowed to enter. Enjoy the resort!
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
