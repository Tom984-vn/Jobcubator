import { IoSearch } from "react-icons/io5";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";
const CVSearch = (props) => {
  const [jobSearchOpen, setJobSearchOpen] = useState(false);
  return (
    <div className="bg-white grid grid-cols-3 p-3 gap-4">
      <div className="border hover:border-primary-400 gap-10 border-gray-300 rounded-lg p-2 w-full flex items-center focus-within:border-primary-400 focus-within:border-2">
        <div className="w-full">
          <input
            type="text"
            placeholder="Tìm kiếm tên, số điện thoại, email ứng viên"
            className="  w-full focus:outline-none"
          />
        </div>
        <IoSearch className="inline -ml-8 text-gray-400 text-xl" />
      </div>
      <div
        className={
          "border relative hover:border-primary-400 border-gray-300 rounded-lg p-2 w-full flex items-baseline cursor-pointer" +
          (jobSearchOpen ? " border-2 border-primary-400" : "")
        }
      >
        <p
          className="text-gray-500 w-full"
          onClick={() => setJobSearchOpen(!jobSearchOpen)}
        >
          Lọc theo công việc đã ứng tuyển
        </p>
        <FaCaretDown className="ml-auto text-gray-500" />
        {jobSearchOpen && (
          <div className="absolute mt-12 bg-white border border-gray-300 rounded-lg shadow-lg w-full z-10">
            <div className="border rounded-lg w-[95%] mx-auto my-2 px-2 flex items-center">
              <IoSearch />
              <input
                placeholder="Nhập tên công việc"
                className="w-full p-2 border-b border-gray-300 focus:outline-none"
              />
            </div>
            <ul>
              {props.jobList.length ? (
                props.jobList.map((job, index) => (
                  <li key={index}>{job.name}</li>
                ))
              ) : (
                <li className="text-gray-500 p-2">Không có công việc nào</li>
              )}
            </ul>
          </div>
        )}
      </div>
      <select className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400">
        <option value="">Trạng thái ứng viên</option>
        <option value={"accepted"}>Tiếp nhận</option>
        <option value={"suitable"}>Phù hợp</option>
        <option value={"interviewed"}>Hẹn phỏng vấn</option>
        <option value={"offered"}>Gửi đề nghị</option>
        <option value={"rejected"}>Từ chối</option>
      </select>
      <select className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400">
        <option value="">Hiển thị tất cả CV</option>
        <option value="reviewed">Chỉ hiện thị CV chưa xem</option>
      </select>
      <select className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400">
        <option value="">Tất cả nhãn</option>
        <option value="noTag">Chưa gắn nhãn</option>
        <option value="promising">Tiềm năng</option>
        <option value="notPromising">Ít tiềm năng</option>
      </select>
      <div className="flex">
        <div className="flex items-center gap-2">
          <p>Từ:</p>
          <input
            type="date"
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400"
          />
        </div>
        <div className="flex items-center gap-2 ml-4">
          <p>Đến:</p>
          <input
            type="date"
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400"
          />
        </div>
      </div>
    </div>
  );
};
import ApplicantTable from "../../components/Employer/ApplicantTable";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { getJobsByEmployer } from "../../utils/Job";
import { fetchApplicantsByJobId } from "../../utils/Job";
import { useEffect } from "react";
import { getMyCompany } from "../../utils/Company";
export default function Applicants() {
  const [jobList, setJobList] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const fetchJobs = async () => {
    const token = localStorage.getItem("accessToken");
    const company = await getMyCompany(token);
    const jobs = await getJobsByEmployer({ page: 0, size: 30 }, company[0].id);
    setJobList(jobs.content);
  };

  const fetchApplicants = async (jobId) => {
    const applicants = await fetchApplicantsByJobId(jobId);
    setApplicants((prev) => {
      //Remove duplicates
      const existingIds = new Set(prev.map((applicant) => applicant.id));
      const newApplicants = applicants.filter(
        (applicant) => !existingIds.has(applicant.id)
      );
      return [...prev, ...newApplicants];
    });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobList.length > 0) {
      jobList.forEach((job) => fetchApplicants(job.id));
    }
  }, [jobList]);
  return (
    <div className="w-full box-border">
      <div className="bg-white raleway-bold text-xl border-b border-gray-500 w-full p-5 flex justify-between items-center">
        <p>Quản lý ứng viên</p>
        <button className="bg-primary-400 text-white px-4 py-2 rounded-lg text-sm hover:bg-secondary-2-100 transition-colors duration-200">
          <FaWandMagicSparkles className="inline mr-2" />
          Lọc ứng viên bằng AI
        </button>
      </div>
      <CVSearch jobList={jobList} setJobList={setJobList} />
      <ApplicantTable applicants={applicants} />
    </div>
  );
}
