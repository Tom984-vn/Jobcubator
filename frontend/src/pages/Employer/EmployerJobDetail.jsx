import { useEffect, useState } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import JobDetailsTab from "./JobDetailsTab";
import { fetchJobById } from "../../utils/Job";
import { useParams } from "react-router-dom";

function ApplicantsTab() {
  return <div>Applicants Content</div>;
}
function SettingsTab() {
  return <div>Settings Content</div>;
}
import { fetchApplicantsByJobId } from "../../utils/Job";
export default function EmployerJobDetail() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [selectedTab, setSelectedTab] = useState("jobDetails");
  const jobId = useParams().id;
  const [jobData, setJobData] = useState({});
  const [applicants, setApplicants] = useState([]);
  useEffect(() => {
    fetchJobById(jobId).then((data) => setJobData(data));
    fetchApplicantsByJobId(jobId, accessToken).then((data) =>
      setApplicants(data)
    );
  }, [jobId]);

  return (
    <div className="w-full box-border">
      <div className="bg-white raleway-bold text-xl border-b border-gray-500 w-full p-5 flex items-center gap-3">
        <button
          className="text-primary-400 hover:text-secondary-2-300 transition-colors duration-200 text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <FaArrowCircleLeft />
        </button>
        <button
          onClick={() => {
            fetchApplicantsByJobId(jobId, accessToken);
          }}
        >
          Test button
        </button>
        <p
          className={
            selectedTab === "jobDetails"
              ? "font-bold underline-offset-4 border-b-2 border-primary-400 text-primary-400 cursor-pointer"
              : "cursor-pointer hover:text-secondary-2-300 transition-colors duration-200"
          }
          onClick={() => {
            setSelectedTab("jobDetails");
          }}
        >
          Chi tiết việc làm
        </p>
        <p
          className={
            selectedTab === "applicants"
              ? "font-bold underline-offset-4 border-b-2 border-primary-400 text-primary-400 cursor-pointer"
              : "cursor-pointer hover:text-secondary-2-300 transition-colors duration-200 "
          }
          onClick={() => {
            setSelectedTab("applicants");
          }}
        >
          Người ứng tuyển
        </p>
        <p
          className={
            selectedTab === "settings"
              ? "font-bold underline-offset-4 border-b-2 border-primary-400 text-primary-400 cursor-pointer"
              : "cursor-pointer hover:text-secondary-2-300 transition-colors duration-200 "
          }
          onClick={() => {
            setSelectedTab("settings");
          }}
        >
          Cài đặt việc làm
        </p>
      </div>
      <div className="p-5">
        {selectedTab === "jobDetails" && jobData && (
          <JobDetailsTab
            jobData={jobData}
            numberOfApplicants={applicants.length}
          />
        )}
        {selectedTab === "applicants" && <ApplicantsTab />}
        {selectedTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
