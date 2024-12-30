import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../../apis/repositories/auth";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login(formData.email, formData.password);
      localStorage.setItem("authToken", response.data);
      navigate("/users");
    } catch (error: any) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #27b0d8 0%, #f2f3f4 100%)",
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: 400, borderRadius: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          Welcome
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ textAlign: "center", mb: 2 }}
        >
          Please sign in to your account
        </Typography>

        {/* Form Đăng nhập */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoFocus
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2}}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Login"
            )}
          </Button>
        </form>

        {/* Hiển thị lỗi */}
        {error && (
          <Snackbar open={Boolean(error)} autoHideDuration={6000}>
            <Alert severity="error">{error}</Alert>
          </Snackbar>
        )}

        {/* Liên kết đăng ký */}
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Don’t have an account?{" "}
            <Link
              component="button"
              variant="body2"
              underline="hover"
              color="primary"
              onClick={() => navigate("/register")}
            >
              Sign up
            </Link>
          </Typography>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Login;
