import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchUserById,
  createUser,
  updateUser,
} from "../../apis/repositories/user";
import { fetchCompanyList } from "../../apis/repositories/company";

const UserForm: React.FC<{ mode: "add" | "edit" }> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    roleIds: [] as number[],
    companyId: null as number | null,
  });
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [companies, setCompanies] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setRoles([
        { id: 1, name: "USER" },
        { id: 2, name: "ADMIN" },
      ]);
    };
    const fetchCompanies = async () => {
      const companyResponse = await fetchCompanyList();
      setCompanies(companyResponse);
    };
    
    fetchRoles(); 
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (mode === "edit" && id) {
        try {
          setLoading(true);
          const user = await fetchUserById(Number(id));

          const company = companies.find((comp) => comp.name === user.company);
          const roleIds = user.roles.map((role: string) => {
            return roles.find((r) => r.name === role)?.id || 0;
          });

          setFormData({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            roleIds,
            companyId: company?.id || null,
          });
        } catch (error: any) {
          console.log(error.message);
          setError("Failed to fetch initial data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInitialData();
  }, [mode, id, roles, companies]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "add") {
        await createUser(formData as any);
        navigate("/users");
      } else {
        await updateUser(Number(id), formData as any);
        navigate("/users");
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
        {mode === "add" ? "Add New User" : "Edit User"}
      </Typography>

      <Button
        variant="text"
        color="secondary"
        onClick={() => navigate("/users")}
        sx={{ mb: 2, textDecoration: "none" }}
      >
        Back to User List
      </Button>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required={mode === "add"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required={mode === "add"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required={mode === "add"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Company"
                variant="outlined"
                fullWidth
                name="companyId"
                value={formData.companyId || ""}
                onChange={handleChange}
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Roles"
                variant="outlined"
                fullWidth
                name="roleIds"
                value={formData.roleIds || ""}
                onChange={handleRoleChange}
                required={mode === "add"}
                multiline
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>
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
                {mode === "add" ? "Add User" : "Save Changes"}
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

export default UserForm;
