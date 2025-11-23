import API from "../../api.jsx";

export async function registerUser({ fullName, username, email, password }) {
  const { data } = await API.post("/auth/register", {
    fullName,
    username,
    password,
    email,
  });
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  return data;
}
export async function getUserData({ accessToken }) {
  const { data } = await API.get("/user/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
}
export async function loginUser({ username, password }) {
  const { data } = await API.post("/auth/login", { username, password });
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  return data;
}
export async function logoutUser() {
  const refreshToken = localStorage.getItem("refreshToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
export async function getCourses() {
  return API.get("/courses");
}
export async function getProtectedData() {
  return API.get("/protected");
}
