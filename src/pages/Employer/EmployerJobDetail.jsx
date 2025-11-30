import { useState } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import JobStat from "../../components/Employer/JobStat";
import { FaEye } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";

function JobDetailsTab() {
  return (
    <div>
      <div className="flex gap-5">
        <JobStat
          label="Số lượt xem"
          count={123}
          icon={<FaEye className="text-3xl" />}
          className="bg-primary-400 text-white w-fit gap-5"
        />
        <JobStat
          label="Số lượt yêu thích"
          count={123}
          icon={<FaHeart className="text-3xl" />}
          className="bg-secondary-2-200 text-black w-fit gap-5"
        />
        <JobStat
          label="Lượt ứng tuyển"
          count={123}
          icon={<IoPeopleSharp className="text-3xl" />}
          className="bg-green-600 text-white w-fit gap-5"
        />
      </div>
    </div>
  );
}
function ApplicantsTab() {
  return <div>Applicants Content</div>;
}
function SettingsTab() {
  return <div>Settings Content</div>;
}
export default function EmployerJobDetail() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("jobDetails");
  return (
    <div className="w-full box-border">
      <div className="bg-white raleway-bold text-xl border-b border-gray-500 w-full p-5 flex items-center gap-3">
        <button
          className="text-primary-400 hover:text-secondary-2-300 transition-colors duration-200 text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <FaArrowCircleLeft />
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
        {selectedTab === "jobDetails" && <JobDetailsTab />}
        {selectedTab === "applicants" && <ApplicantsTab />}
        {selectedTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
