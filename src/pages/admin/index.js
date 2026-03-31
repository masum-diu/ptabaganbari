import { useState } from "react";
import { useRouter } from "next/router";
import {
  Box, Typography, TextField, Button, Chip, Alert, InputAdornment, IconButton,
} from "@mui/material";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm]     = useState({ username: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (form.username === "admin" && form.password === "admin123") {
      sessionStorage.setItem("admin_auth", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid username or password.");
    }
  }

  return (
    <Box sx={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg,#0d1f0d 0%,#1b3a1b 50%,#0d1f0d 100%)",
      p: 2,
    }}>
      <Box sx={{
        bgcolor: "#fff", borderRadius: 5, p: { xs: 4, md: 6 },
        width: "100%", maxWidth: 440,
        boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
        border: "1.5px solid #c8e6c9",
      }}>
        {/* Logo */}
        <Box textAlign="center" mb={4}>
          <Box sx={{
            width: 72, height: 72, borderRadius: "50%",
            background: "linear-gradient(135deg,#1b5e20,#2e7d32)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2rem", mx: "auto", mb: 2,
            boxShadow: "0 8px 24px rgba(46,125,50,0.35)",
          }}>
            🛡️
          </Box>
          <Chip label="Admin Panel" color="primary" size="small" sx={{ mb: 1.5 }} />
          <Typography variant="h5" fontWeight={800}>Welcome Back</Typography>
          <Typography color="text.secondary" fontSize="0.88rem" mt={0.5}>
            PTA BaganBari Resort — Admin
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Username"
            placeholder="admin"
            value={form.username}
            onChange={(e) => { setForm(f => ({ ...f, username: e.target.value })); setError(""); }}
            fullWidth
            InputProps={{ startAdornment: <InputAdornment position="start">👤</InputAdornment> }}
          />
          <TextField
            label="Password"
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => { setForm(f => ({ ...f, password: e.target.value })); setError(""); }}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">🔒</InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPw(v => !v)} size="small">
                    {showPw ? "🙈" : "👁️"}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ py: 1.5, mt: 1, fontSize: "1rem" }}>
            Login to Dashboard
          </Button>
        </Box>

        <Typography textAlign="center" fontSize="0.78rem" color="text.secondary" mt={3}>
          Default: admin / admin123
        </Typography>
      </Box>
    </Box>
  );
}
