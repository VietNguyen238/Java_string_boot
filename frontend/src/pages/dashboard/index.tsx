import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { fetchUserList } from "../../apis/repositories/user";
import { fetchCompanyList } from "../../apis/repositories/company";
import decodedToken from "../../components/jwt";

const Dashboard: React.FC = () => {
  const decoded = decodedToken();
  const role = decoded ? decoded.roles[0] : "";
  const [user, setUser] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const userList = await fetchUserList();
        setUser(userList);
      } catch (error: any) {
        console.log(error);
      }
    };

    const getCompanies = async () => {
      try {
        const companyList = await fetchCompanyList();
        setCompanies(companyList);
      } catch (error: any) {
        console.log(error);
      }
    };

    getCompanies();

    getUsers();
  }, []);

  return (
    <Box sx={{ p: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* Header */}
      <Typography variant="h4" color="textPrimary" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Welcome to the {role} dashboard! Here’s an overview of the current
        status.
      </Typography>

      {/* Info Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Users
              </Typography>
              <Typography variant="h3" color="primary">
                {user.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Company
              </Typography>
              <Typography variant="h3" color="primary">
                {companies.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
