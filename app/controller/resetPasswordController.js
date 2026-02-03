// app/controller/resetPasswordController.js
import axios from "axios";

export const handleResetPassword = async (newPassword) => {
  if (!newPassword) {
    throw new Error("Password is required");
  }

  try {
    const response = await axios.post("/api/auth/resetPassword", {
      password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to reset password",
    );
  }
};
