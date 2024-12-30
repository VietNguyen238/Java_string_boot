import { jwtDecode } from "jwt-decode";

export default function decodedToken() {
  const authToken = localStorage.getItem("authToken") || "";
  if (authToken) {
    try {
      const decoded = jwtDecode(authToken) as { roles: string[] };
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
}
