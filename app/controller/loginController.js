// app/controllers/loginController.js
import axios from "axios";

export const handleSubmitLogin = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and Password are required");
  }

  try {
    const response = await axios.post("/api/auth/login", { email, password });
    return response.data; // { user, session }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
