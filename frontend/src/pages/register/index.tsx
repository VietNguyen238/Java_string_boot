import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Snackbar,
  Alert,
  CircularProgress,
  Grid2,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { register } from "../../apis/repositories/auth";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
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
      const response = await register(formData);
      if (response.status === 201) {
        alert("Registration successful");
        navigate("/login");
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (error: any) {
      setError(error.message || "Registration failed");
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
          Create an Account
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ textAlign: "center", mb: 2 }}
        >
          Join us today! It takes only a few steps
        </Typography>

        {/* Form Đăng ký */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
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
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Register"
            )}
          </Button>
        </form>

        {/* Hiển thị lỗi */}
        {error && (
          <Snackbar open={Boolean(error)} autoHideDuration={6000}>
            <Alert severity="error">{error}</Alert>
          </Snackbar>
        )}

        {/* Liên kết đăng nhập */}
        <Grid2 container justifyContent="center" sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Already have an account?{" "}
            <Link
              component="button"
              variant="body2"
              underline="hover"
              onClick={() => navigate("/login")}
            >
              Login
            </Link>
          </Typography>
        </Grid2>
      </Paper>
    </Box>
  );
};

export default Register;
