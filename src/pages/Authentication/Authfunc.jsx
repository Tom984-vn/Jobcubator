import API from "../../api.jsx";

export async function registerUser({ username, email, password }) {
  return API.post("/auth/register", { username, email, password });
}

export async function loginUser({ username, password }) {
  const { data } = await API.post("/auth/login", { username, password });
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  return data;
}
export async function logoutUser() {
  const refreshToken = localStorage.getItem("refreshToken");
  await API.post("/auth/logout", { token: refreshToken });
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
export async function getCourses() {
  return API.get("/courses");
}
export async function getProtectedData() {
  return API.get("/protected");
}
