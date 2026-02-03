// app/controllers/forgotController.js
import axios from "axios";

export const handleForgotPassword = async (data) => {
  // Extract email from data object
  const email = data?.email || data;

  if (!email) {
    throw new Error("Email is required");
  }

  try {
    const response = await axios.post("/api/auth/forgotPassword", { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};
