import apiClient from "../apiClient";

interface CreateCompanyRequest {
  name: string;
  users: number[];
}

interface UpdateCompanyRequest {
  name: string;
  users: number[];
}

export const fetchCompanyList = async () => {
  try {
    const response = await apiClient.get("/companies");
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch company list";
  }
};

export const fetchCompanyById = async (companyId: number) => {
  try {
    const response = await apiClient.get(`/companies/${companyId}`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch company";
  }
};

export const createCompany = async (companyData: CreateCompanyRequest) => {
  try {
    const response = await apiClient.post("/companies/create", companyData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to create company";
  }
};

export const updateCompany = async (
  companyId: number,
  companyData: UpdateCompanyRequest
) => {
  try {
    const response = await apiClient.put(
      `/companies/update/${companyId}`,
      companyData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to update company";
  }
};

export const deleteCompany = async (companyId: number) => {
  try {
    const response = await apiClient.delete(`/companies/delete/${companyId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to delete company";
  }
};
