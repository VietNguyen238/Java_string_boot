 
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCompanyById,
  createCompany,
  updateCompany,
} from "../../apis/repositories/company";
import { fetchUserList } from "../../apis/repositories/user";

const CompanyForm: React.FC<{ mode: "add" | "edit" }> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    users: [] as number[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userOptions, setUserOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        const users = await fetchUserList();
        console.log(users.map((user: any) => ({
            id: user.id,
            name: user.email,
          })));
        setUserOptions(
          users.map((user: any) => ({
            id: user.id,
            name: user.email,
          }))
        );
      } catch (error: any) {
        console.log(error);
        setError("Failed to fetch users data");
      }
    };

    fetchUsersList();
  }, []);

  // Lấy dữ liệu công ty khi ở chế độ edit
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (mode === "edit" && id) {
          const company = await fetchCompanyById(Number(id));
          setFormData({
            name: company.name,
            users: company.userIds,
          });
        }
      } catch (error: any) {
        console.error(error.message);
        setError("Failed to fetch company data");
      }
    };

    fetchInitialData();
  }, [mode, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(formData);
  };

  const handleUsersChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      users: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "add") {
        await createCompany(formData as any);
        navigate("/companies");
      } else {
        await updateCompany(Number(id), formData as any);
        navigate("/companies");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to submit data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        {mode === "add" ? "Add New Company" : "Edit Company"}
      </Typography>

      <Button
        variant="text"
        color="secondary"
        onClick={() => navigate("/companies")}
        sx={{ mb: 2, textDecoration: "none" }}
      >
        Back to Company List
      </Button>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={mode === "add"}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Users</InputLabel>
                <Select
                  label="Users"
                  multiple
                  name="users"
                  value={formData.users}
                  onChange={handleUsersChange}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {userOptions.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Checkbox
                        checked={formData.users.includes(user.id)}
                      />
                      <ListItemText primary={user.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {mode === "add" ? "Add Company" : "Save Changes"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {error && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </Box>
  );
};

export default CompanyForm;
