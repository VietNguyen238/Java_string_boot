import apiClient from "../apiClient";

interface CreateUserRequest {
  firstname: string;
  lastname: string;
  email: string;
  roleIds: number[];
  companyId: number;
}

interface UpdateUserRequest {
  firstname: string;
  lastname: string;
  email: string;
  roleIds: number[];
  companyId: number;
}

export const fetchUserList = async () => {
  try {
    const response = await apiClient.get("/users");
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch user list";
  }
};

export const fetchUserDetail = async (userId: number) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch user list";
  }
};

export const fetchUserById = async (userId: number) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch user";
  }
};

export const createUser = async (userData: CreateUserRequest) => {
  try {
    const response = await apiClient.post("/users/create", userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to create user";
  }
};

export const updateUser = async (
  userId: number,
  userData: UpdateUserRequest
) => {
  try {
    console.log(userData);
    const response = await apiClient.put(`/users/update/${userId}`, userData, {
      headers: {
        "Content-Type": "application/json"
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to update user";
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const response = await apiClient.delete(`/users/delete/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to delete user";
  }
};


