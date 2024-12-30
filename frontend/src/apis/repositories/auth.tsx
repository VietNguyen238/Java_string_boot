import apiClient from "../apiClient";

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/auth/generateToken", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Login failed";
  }
};

export const register = async (formData: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("/auth/register", formData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Registration failed";
  }
};
