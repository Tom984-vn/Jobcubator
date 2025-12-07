import api from "../api.jsx";
import { fetchUserCVUrl } from "./Resume.jsx";
export async function fetchRecentJobs(pageable) {
  const response = await api.get("/job_posts/top-job-post-by-creation-time", {
    params: pageable,
  });
  return response.data;
}
export async function fetchJobsByFilter(pageable, filter) {
  const response = await api.post("/job_posts/filter", filter, {
    params: { ...pageable },
  });
  return response.data;
}
export async function fetchJobById(jobId) {
  const response = await api.get(`/job_posts/${jobId}`);
  return response.data;
}
export async function applyJob(jobId, coverLetter, accessToken) {
  const response = await api.post(
    "/applications",
    {
      jobPostId: jobId,
      coverLetter: coverLetter ?? "",
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}
export async function fetchAppliedJobs(accessToken) {
  const response = await api.get("/applications/my-applications", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
export async function fetchApplicantsByJobId(jobId, accessToken) {
  const response = await api.get(`/applications/job/${jobId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
export async function postJob(data, companyId, accessToken) {
  const response = await api.post(`/job_posts/${companyId}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
export async function getJobsByEmployer(pageable, companyId) {
  const response = await api.get(`/job_posts/by-company/${companyId}`, {
    params: pageable,
  });
  return response.data;
}
