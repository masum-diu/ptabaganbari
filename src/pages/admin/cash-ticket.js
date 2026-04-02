import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box, Container, Typography, TextField, Button, Grid,
  Divider, Alert, InputAdornment, CircularProgress, MenuItem,
} from "@mui/material";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import PersonIcon   from "@mui/icons-material/Person";
import PhoneIcon    from "@mui/icons-material/Phone";
import PeopleIcon   from "@mui/icons-material/People";
import supabase from "@/lib/supabase";

const PRICE = 25;
function genId() { return "BK-" + Date.now().toString().slice(-7); }

export default function CashTicket() {
  const router = useRouter();
  const [form, setForm]           = useState({ name: "", phone: "", persons: 1 });
  const [errors, setErrors]       = useState({});
  const [issuing, setIssuing]     = useState(false);
  const [issued, setIssued]       = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sessionStorage.getItem("admin_auth")) { router.push("/admin"); return; }
  }, []);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^01[3-9]\d{8}$/.test(form.phone)) e.phone = "Enter valid BD number";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIssuing(true);
    const now    = new Date();
    const ticket = {
      id:           genId(),
      name:         form.name.trim(),
      phone:        form.phone,
      persons:      form.persons,
      total:        form.persons * PRICE,
      date:         now.toLocaleString("en-BD", { dateStyle: "full", timeStyle: "short" }),
      timestamp:    now.toISOString(),
      status:       "approved",
      used:         false,
      used_at:      null,
      bkash_number: "CASH",
      trx_id:       "CASH-" + Date.now().toString().slice(-6),
    };
    const { error } = await supabase.from("bookings").insert([ticket]);
    setIssuing(false);
    if (!error) { setIssued(ticket); setForm({ name: "", phone: "", persons: 1 }); setErrors({}); }
  }

  const total = form.persons * PRICE;

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", p: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">

        {/* Header */}
        <Box mb={4}>
          <Typography fontWeight={800} fontSize="1.5rem" color="#1a2e1a">Cash Ticket</Typography>
          <Typography color="text.secondary" fontSize="0.85rem" mt={0.5}>
            Issue ticket for visitors paying cash on the spot
          </Typography>
        </Box>

        <Grid container spacing={3}>

          {/* ── FORM ── */}
          <Grid size={{ xs: 12, md: 5}}>
            <Box sx={{ bgcolor: "#fff", borderRadius: 3, p: { xs: 3, md: 4 }, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: "1.5px solid #ffe082" }}>
              <Box textAlign="center" mb={3}>
                <Box sx={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "linear-gradient(135deg,#e65100,#f57c00)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  mx: "auto", mb: 2, boxShadow: "0 4px 16px rgba(230,81,0,0.3)",
                }}>
                  <LocalAtmIcon sx={{ color: "#fff", fontSize: "2rem" }} />
                </Box>
                <Typography variant="h6" fontWeight={800}>Visitor Details</Typography>
                <Typography color="text.secondary" fontSize="0.85rem" mt={0.5}>
                  Fill in details to issue cash ticket
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField label="Full Name" placeholder="e.g. Rahim Uddin"
                  value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: "" })); }}
                  error={!!errors.name} helperText={errors.name} fullWidth
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "#aaa", fontSize: "1.1rem" }} /></InputAdornment> }}
                />
                <TextField label="Phone Number" placeholder="e.g. 01712345678"
                  value={form.phone}
                  onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: "" })); }}
                  error={!!errors.phone} helperText={errors.phone || "Bangladesh mobile number"} fullWidth inputProps={{ maxLength: 11 }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "#aaa", fontSize: "1.1rem" }} /></InputAdornment> }}
                />
                <TextField select label="Number of Persons" value={form.persons}
                  onChange={e => setForm(f => ({ ...f, persons: Number(e.target.value) }))} fullWidth
                  InputProps={{ startAdornment: <InputAdornment position="start"><PeopleIcon sx={{ color: "#aaa", fontSize: "1.1rem" }} /></InputAdornment> }}>
                  {[...Array(20)].map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>{i + 1} {i === 0 ? "Person" : "Persons"}</MenuItem>
                  ))}
                </TextField>

                {/* Price summary */}
                <Box sx={{ bgcolor: "#fff8e1", borderRadius: 3, p: 2.5, border: "1.5px solid #ffe082" }}>
                  <Typography fontWeight={700} color="#e65100" mb={1.5}>Cash Payment Summary</Typography>
                  {[
                    { label: "Price per person", value: `৳${PRICE}` },
                    { label: "Persons",          value: `× ${form.persons}` },
                  ].map(r => (
                    <Box key={r.label} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography color="text.secondary" fontSize="0.88rem">{r.label}</Typography>
                      <Typography fontWeight={600}>{r.value}</Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 1.5, borderColor: "#ffe082" }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography fontWeight={800}>Total Cash</Typography>
                    <Typography fontWeight={800} fontSize="1.4rem" color="#e65100">৳{total}</Typography>
                  </Box>
                </Box>

                <Button type="submit" variant="contained" size="large" fullWidth disabled={issuing}
                  startIcon={<LocalAtmIcon />}
                  sx={{ py: 1.5, bgcolor: "#e65100", "&:hover": { bgcolor: "#bf360c" }, fontWeight: 700, borderRadius: 2 }}>
                  {issuing ? <CircularProgress size={22} color="inherit" /> : `Issue Cash Ticket — ৳${total}`}
                </Button>
              </Box>

              {issued && (
                <Box mt={2}>
                  <Alert severity="success" sx={{ borderRadius: 2, mb: 2 }}>Cash ticket issued successfully!</Alert>
                  <Button variant="outlined" fullWidth onClick={() => setIssued(null)}
                    startIcon={<LocalAtmIcon />}
                    sx={{ borderColor: "#e65100", color: "#e65100", borderRadius: 2, "&:hover": { bgcolor: "#fff8e1" } }}>
                    Issue Another Ticket
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>

          {/* ── TICKET PREVIEW ── */}
          <Grid size={{ xs: 12, md: 7 }}>
            {issued ? (
              <Box sx={{ bgcolor: "#fff", borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 24px rgba(230,81,0,0.15)", border: "2px solid #ffcc80", position: "relative" }}>
                {/* Header */}
                <Box sx={{ background: "linear-gradient(135deg,#e65100,#f57c00)", py: 3.5, textAlign: "center" }}>
                  <LocalAtmIcon sx={{ color: "#fff", fontSize: "2.8rem" }} />
                  <Typography variant="h6" color="#fff" fontWeight={800} mt={0.5}>Cash Ticket Issued!</Typography>
                  <Typography color="rgba(255,255,255,0.8)" fontSize="0.82rem">Entry granted — paid on spot</Typography>
                  <Box sx={{ position: "absolute", top: 14, right: 14, px: 1.5, py: 0.4, borderRadius: 5, bgcolor: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)" }}>
                    <Typography fontSize="0.7rem" fontWeight={800} color="#fff" letterSpacing={1}>CASH</Typography>
                  </Box>
                </Box>

                {/* Tear line */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "#f5f7fa", ml: -1.1, border: "1.5px solid #ffcc80" }} />
                  <Box sx={{ flex: 1, borderTop: "2px dashed #ffcc80" }} />
                  <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: "#f5f7fa", mr: -1.1, border: "1.5px solid #ffcc80" }} />
                </Box>

                {/* Body */}
                <Box sx={{ px: { xs: 3, md: 5 }, py: 4 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                    <Typography color="text.secondary" fontSize="0.72rem" fontWeight={700} letterSpacing={1}>BOOKING ID</Typography>
                    <Typography fontWeight={800} color="#e65100">{issued.id}</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {[
                    { label: "👤 Name",    value: issued.name },
                    { label: "📞 Phone",   value: issued.phone },
                    { label: "👥 Persons", value: `${issued.persons} ${issued.persons === 1 ? "Person" : "Persons"}` },
                    { label: "📅 Date",    value: issued.date },
                    { label: "💵 Payment", value: "Cash on Spot" },
                  ].map(row => (
                    <Box key={row.label} sx={{ display: "flex", justifyContent: "space-between", py: 1.3, borderBottom: "1px solid #f5f5f5" }}>
                      <Typography color="text.secondary" fontSize="0.88rem">{row.label}</Typography>
                      <Typography fontWeight={600} fontSize="0.9rem">{row.value}</Typography>
                    </Box>
                  ))}

                  <Box sx={{ mt: 3, bgcolor: "#fff8e1", borderRadius: 3, p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1.5px solid #ffe082" }}>
                    <Typography fontWeight={800} fontSize="1.05rem">Cash Collected</Typography>
                    <Typography fontWeight={800} fontSize="1.8rem" color="#e65100">৳{issued.total}</Typography>
                  </Box>

                  <Alert severity="success" sx={{ mt: 3, borderRadius: 2, fontSize: "0.82rem" }}>
                    <strong>Entry Granted!</strong> {issued.persons} person{issued.persons > 1 ? "s" : ""} allowed to enter. Enjoy the resort! 🌿
                  </Alert>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 12, bgcolor: "#fff", borderRadius: 3, border: "1.5px solid #f0f0f0" }}>
                <LocalAtmIcon sx={{ fontSize: "4rem", color: "#ddd" }} />
                <Typography color="text.secondary" mt={2} fontWeight={600} fontSize="1rem">
                  Fill the form to issue a cash ticket
                </Typography>
                <Typography color="text.secondary" fontSize="0.82rem" mt={0.5}>
                  Ticket will be instantly approved and entry granted
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
