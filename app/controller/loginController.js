import axios from "axios";

export const handleSubmitLogin = async (e, { email, password }) => {
  e.preventDefault();

  console.log("Login credentials:", {
    email,
    password,
  });
  try {
    const response = await axios.post("/api/login", {
      email,
      password,
    });
    const { user } = response.data;
    alert(
      `Login Successful!\nRole: ${user.role.toUpperCase()}\nWelcome, ${user.name}!`,
    );

    localStorage.setItem("user", JSON.stringify(user));

    window.location.href = "/Dashboard";
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
