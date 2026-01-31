import axios from "axios";

export const handleSubmitRegister = async (e, formData) => {
  e.preventDefault();
  console.log("Register Data:", formData);

  try {
    const response = await axios.post("/api/register", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    alert(response.data.message || "Account Created Successfully!");
    window.location.href = "/";
  } catch (error) {
    if (error.response) {
      alert("Error: " + error.response.data);
    } else if (error.request) {
      alert("No Response From Server. Please Try Again");
    } else {
      alert("Error: " + error.message);
    }
  }
};
