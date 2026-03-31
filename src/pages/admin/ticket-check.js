import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box, Container, Typography, TextField, Button,
  Chip, Divider, Alert, InputAdornment, Switch, CircularProgress,
} from "@mui/material";
import Link from "next/link";
import supabase from "@/lib/supabase";

export default function TicketCheck() {
  const router = useRouter();
  const [query, setQuery]       = useState("");
  const [result, setResult]     = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [toggling, setToggling] = useState(false);
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
    setQuery("");
    setResult(null);
    setNotFound(false);
  }

  const isUsed = result?.used;
  const usedAt = result?.used_at;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0f1a0f" }}>
      <Container maxWidth="sm" sx={{ py: 8 }}>

        {/* ── SEARCH BOX ── */}
        <Box sx={{
          borderRadius: 4, p: { xs: 3, md: 5 }, mb: 4,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(165,214,167,0.15)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
          backdropFilter: "blur(10px)",
        }}>
          <Box textAlign="center" mb={4}>
            <Box sx={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg,#1b5e20,#2e7d32)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", mx: "auto", mb: 2,
              boxShadow: "0 0 24px rgba(46,125,50,0.5)",
            }}>🎫</Box>
            <Chip label="Ticket Verification" size="small"
              sx={{ bgcolor: "rgba(46,125,50,0.25)", color: "#a5d6a7", border: "1px solid rgba(165,214,167,0.3)", mb: 1.5 }}
            />
            <Typography variant="h5" fontWeight={800} color="#e8f5e9">Check Ticket</Typography>
            <Typography color="rgba(255,255,255,0.4)" fontSize="0.88rem" mt={0.5}>
              Enter Booking ID or Phone Number to verify
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Booking ID or Phone Number"
              placeholder="e.g. BK-1234567 or 01712345678"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setNotFound(false); setResult(null); }}
              fullWidth
              InputLabelProps={{ sx: { color: "rgba(255,255,255,0.4)" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255,255,255,0.05)", borderRadius: 2, color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
                  "&:hover fieldset": { borderColor: "rgba(165,214,167,0.4)" },
                  "&.Mui-focused fieldset": { borderColor: "#a5d6a7" },
                },
                "& input": { color: "#fff" },
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ opacity: 0.5 }}>🔍</Typography></InputAdornment> }}
            />
            <Button type="submit" variant="contained" size="large" fullWidth disabled={searching}
              sx={{ py: 1.5, background: "linear-gradient(135deg,#1b5e20,#2e7d32)", borderRadius: 2, fontWeight: 700,
                boxShadow: "0 4px 20px rgba(46,125,50,0.4)", "&:hover": { background: "linear-gradient(135deg,#145214,#1b5e20)" } }}>
              {searching ? <CircularProgress size={22} color="inherit" /> : "Verify Ticket"}
            </Button>
            {(result || notFound) && (
              <Button variant="outlined" fullWidth onClick={handleClear}
                sx={{ borderRadius: 2, borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)",
                  "&:hover": { borderColor: "rgba(165,214,167,0.4)", color: "#a5d6a7" } }}>
                Clear
              </Button>
            )}
          </Box>
        </Box>

        {/* ── NOT FOUND ── */}
        {notFound && (
          <Alert severity="error" sx={{ borderRadius: 3, bgcolor: "rgba(229,57,53,0.12)", color: "#ef9a9a", border: "1px solid rgba(229,57,53,0.3)" }}>
            ❌ No booking found for "<strong>{query}</strong>". Please check the ID or phone number.
          </Alert>
        )}

        {/* ── TICKET RESULT ── */}
        {result && (
          <Box sx={{
            borderRadius: 4, overflow: "hidden",
            border: `2px solid ${isUsed ? "rgba(229,57,53,0.4)" : "rgba(165,214,167,0.35)"}`,
            boxShadow: isUsed
              ? "0 8px 40px rgba(229,57,53,0.2)"
              : "0 8px 40px rgba(46,125,50,0.25)",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(10px)",
          }}>

            {/* ticket header */}
            <Box sx={{
              background: isUsed
                ? "linear-gradient(135deg,#7f0000,#c62828)"
                : "linear-gradient(135deg,#1b5e20,#2e7d32)",
              py: 4, textAlign: "center",
              position: "relative",
            }}>
              <Typography fontSize="2.8rem">{isUsed ? "🚫" : "✅"}</Typography>
              <Typography variant="h6" color="#fff" fontWeight={800} mt={1}>
                {isUsed ? "Already Used" : "Valid Ticket"}
              </Typography>
              <Typography color="rgba(255,255,255,0.75)" fontSize="0.85rem">
                {isUsed ? `Used on: ${usedAt}` : "Booking verified — ready for entry"}
              </Typography>
              {/* status badge */}
              <Box sx={{
                position: "absolute", top: 16, right: 16,
                px: 2, py: 0.5, borderRadius: 5,
                bgcolor: isUsed ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}>
                <Typography fontSize="0.72rem" fontWeight={800} color="#fff" letterSpacing={1}>
                  {isUsed ? "USED" : "VALID"}
                </Typography>
              </Box>
            </Box>

            {/* tear line */}
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#0f1a0f" }}>
              <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "#0f1a0f", ml: -1.2, border: `1px solid ${isUsed ? "rgba(229,57,53,0.4)" : "rgba(165,214,167,0.35)"}` }} />
              <Box sx={{ flex: 1, borderTop: `2px dashed ${isUsed ? "rgba(229,57,53,0.3)" : "rgba(165,214,167,0.25)"}` }} />
              <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "#0f1a0f", mr: -1.2, border: `1px solid ${isUsed ? "rgba(229,57,53,0.4)" : "rgba(165,214,167,0.35)"}` }} />
            </Box>

            {/* ticket body */}
            <Box sx={{ px: { xs: 3, md: 5 }, py: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography color="rgba(255,255,255,0.4)" fontSize="0.72rem" fontWeight={700} letterSpacing={1}>BOOKING ID</Typography>
                <Typography fontWeight={800} color="#a5d6a7">{result.id}</Typography>
              </Box>
              <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.07)" }} />

              {[
                { label: "👤 Name",    value: result.name },
                { label: "📞 Phone",   value: result.phone },
                { label: "👥 Persons", value: `${result.persons} ${result.persons === 1 ? "Person" : "Persons"}` },
                { label: "📅 Booked",  value: result.date },
              ].map((row) => (
                <Box key={row.label} sx={{ display: "flex", justifyContent: "space-between", py: 1.3, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <Typography color="rgba(255,255,255,0.4)" fontSize="0.88rem">{row.label}</Typography>
                  <Typography fontWeight={600} fontSize="0.92rem" color="#e8f5e9">{row.value}</Typography>
                </Box>
              ))}

              {/* total */}
              <Box sx={{
                mt: 3, borderRadius: 3, p: 2.5,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "rgba(46,125,50,0.12)",
                border: "1px solid rgba(165,214,167,0.2)",
              }}>
                <Typography fontWeight={800} color="#e8f5e9">Amount Paid</Typography>
                <Typography fontWeight={800} fontSize="1.8rem" color="#a5d6a7">৳{result.total}</Typography>
              </Box>

              {/* ── ENTRY TOGGLE ── */}
              <Box sx={{
                mt: 3, borderRadius: 3, p: 3,
                background: isUsed ? "rgba(229,57,53,0.08)" : "rgba(46,125,50,0.08)",
                border: `1px solid ${isUsed ? "rgba(229,57,53,0.25)" : "rgba(165,214,167,0.2)"}`,
              }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography fontWeight={800} color={isUsed ? "#ef9a9a" : "#a5d6a7"} fontSize="0.95rem">
                      {isUsed ? "🚫 Entry Already Used" : "🚪 Mark as Entered"}
                    </Typography>
                    <Typography color="rgba(255,255,255,0.4)" fontSize="0.78rem" mt={0.3}>
                      {isUsed
                        ? "This ticket has been used. Entry not allowed."
                        : "Toggle ON to allow entry. This cannot be undone."}
                    </Typography>
                  </Box>
                  <Switch
                    checked={!!isUsed}
                    onChange={handleToggleEntry}
                    disabled={!!isUsed || toggling}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: isUsed ? "#ef9a9a" : "#a5d6a7",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        bgcolor: isUsed ? "#c62828" : "#2e7d32",
                      },
                      "& .MuiSwitch-track": {
                        bgcolor: "rgba(255,255,255,0.15)",
                      },
                    }}
                  />
                </Box>

                {/* confirmation message */}
                {isUsed ? (
                  <Alert severity="error" sx={{ mt: 2, borderRadius: 2, bgcolor: "rgba(229,57,53,0.12)", color: "#ef9a9a", border: "1px solid rgba(229,57,53,0.3)", fontSize: "0.85rem" }}>
                    ⛔ Entry denied. This ticket was already used on {usedAt}.
                  </Alert>
                ) : (
                  <Alert severity="info" sx={{ mt: 2, borderRadius: 2, bgcolor: "rgba(33,150,243,0.08)", color: "#90caf9", border: "1px solid rgba(33,150,243,0.2)", fontSize: "0.85rem" }}>
                    ℹ️ Once switched ON, this ticket cannot be used again.
                  </Alert>
                )}
              </Box>

              {/* success after toggle */}
              {isUsed && (
                <Box sx={{
                  mt: 3, borderRadius: 3, p: 2.5, textAlign: "center",
                  background: "rgba(46,125,50,0.1)",
                  border: "1px solid rgba(165,214,167,0.2)",
                }}>
                  <Typography fontSize="1.8rem">✅</Typography>
                  <Typography fontWeight={800} color="#a5d6a7" mt={1}>
                    Entry Confirmed!
                  </Typography>
                  <Typography color="rgba(255,255,255,0.5)" fontSize="0.82rem" mt={0.5}>
                    {result.persons} person{result.persons > 1 ? "s" : ""} allowed to enter. Enjoy the resort! 🌿
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
