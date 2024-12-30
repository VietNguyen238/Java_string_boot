import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  fetchCompanyList,
  deleteCompany,
} from "../../apis/repositories/company"; // Assuming these functions exist
import decodedToken from "../../components/jwt";

const CompanyManagement: React.FC = () => {
  const decoded = decodedToken();
  const role = decoded ? decoded.roles[0] : "";
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);

  useEffect(() => {
    const getCompanies = async () => {
      setLoading(true);
      setError(null);

      try {
        const companyList = await fetchCompanyList();
        setCompanies(companyList);
      } catch (error: any) {
        setError(error.message || "Failed to fetch company list");
      } finally {
        setLoading(false);
      }
    };

    getCompanies();
  }, []);

  const handleDelete = async (companyId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteCompany(companyId);
      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company.id !== companyId)
      );
    } catch (error: any) {
      setError(error.message || "Failed to delete company");
    } finally {
      setLoading(false);
      setOpenConfirmDialog(false);
    }
  };

  const columns: GridColDef[] =
    role === "USER"
      ? [
          { field: "id", headerName: "ID", flex: 0.5 },
          { field: "name", headerName: "Company Name", flex: 3 },
          {
            field: "userIds",
            headerName: "Users Count",
            flex: 1,
            renderCell: (params) => params.value.length,
          },
        ]
      : [
          { field: "id", headerName: "ID", flex: 0.5 },
          { field: "name", headerName: "Company Name", flex: 3 },
          {
            field: "userIds",
            headerName: "Users Count",
            flex: 1,
            renderCell: (params) => params.value.length,
          },
          {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            flex: 2,
            renderCell: (params) => (
              <Box>
                <Button
                  href={`/companies/edit/${params.row.id}`}
                  variant="contained"
                  color="primary"
                  sx={{
                    mr: 1,
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSelectedCompany(params.row);
                    setOpenConfirmDialog(true);
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f50057",
                      borderColor: "#f50057",
                    },
                  }}
                >
                  Delete
                </Button>
              </Box>
            ),
          },
        ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Search Company */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h4"
          color="primary"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Company Management
        </Typography>
        {role === "USER" ? (
          ""
        ) : (
          <Button
            href="/companies/add"
            variant="contained"
            color="primary"
            sx={{
              display: "flex",
              height: 40,
              alignItems: "center",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Add New Company
          </Button>
        )}
      </Box>

      {/* DataGrid - Display Company List */}
      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
          {loading ? (
            <Typography variant="h6" align="center">
              Loading...
            </Typography>
          ) : error ? (
            <Typography variant="h6" color="error" align="center">
              {error}
            </Typography>
          ) : (
            <DataGrid
              rows={companies}
              columns={columns}
              sx={{
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "primary.main",
                  color: "#fff",
                  fontWeight: 600,
                },
                "& .MuiDataGrid-cell": {
                  fontSize: 14,
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            />
          )}
        </Box>
      </Paper>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete company {selectedCompany?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(selectedCompany?.id)}
            color="secondary"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyManagement;
