import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";
import { fetchUserDetail } from "../../apis/repositories/user"; // Assume this function exists

const UserDetail: React.FC = () => {
  const { id: userId } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log(userId)

  useEffect(() => {
    const getUserDetail = async () => {
      if (!userId) {
        setError("User ID is missing");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const userDetail = await fetchUserDetail(Number(userId));
        setUser(userDetail);
      } catch (error: any) {
        setError(error.message || "Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    getUserDetail();
  }, [userId]);

  if (loading) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error" align="center">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        User Details
      </Typography>
      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
        {user && (
          <Box>
            <Typography variant="body1"><strong>ID:</strong> {user.id}</Typography>
            <Typography variant="body1"><strong>First Name:</strong> {user.firstname}</Typography>
            <Typography variant="body1"><strong>Last Name:</strong> {user.lastname}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
            <Typography variant="body1"><strong>Company:</strong> {user.company}</Typography>
            <Typography variant="body1"><strong>Roles:</strong> {user.roles.join(", ")}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UserDetail;
