import api from "../api.jsx";
export async function fetchTopCompanies(pageable) {
  const response = await api.get("/company/get-by-most-vacancy", {
    params: pageable,
  });
  return response.data;
}
export async function fetchCompanyById(companyId) {
  const response = await api.get(`/company/get-by-id/${companyId}`);
  return response.data;
}
export async function createCompany(data, accessToken) {
  const response = await api.post("/company/create", data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
