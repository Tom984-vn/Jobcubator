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
import { FaWandMagicSparkles } from "react-icons/fa6";
function ApplicantTable(props) {
  return (
    <table className="bg-white rounded-lg m-5 text-sm w-[95%] mx-auto">
      <thead>
        <tr className="text-left border-b border-gray-300">
          <th className="p-3">Tên ứng viên</th>
          <th className="p-3">Công việc ứng tuyển</th>
          <th className="p-3">Email</th>
          <th className="p-3">Số điện thoại</th>
          <th className="p-3">Trạng thái</th>
          <th className="p-3">Ngày ứng tuyển</th>
          <th className="p-3">Nhãn</th>
          <th className="p-3">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {props.applicants && props.applicants.length ? (
          props.applicants.map((applicant, index) => (
            <tr
              key={index}
              className="border-b border-gray-300 hover:bg-gray-100 cursor-pointer"
            >
              <td className="p-3">{applicant.name}</td>
              <td className="p-3">{applicant.jobApplied}</td>
              <td className="p-3">{applicant.email}</td>
              <td className="p-3">{applicant.phone}</td>
              <td
                className={`p-3 ${
                  applicant.status == "Từ chối"
                    ? " text-red-500 raleway-bold"
                    : ""
                } ${
                  applicant.status == "Tiếp nhận"
                    ? " text-green-500 raleway-bold"
                    : ""
                }`}
              >
                {applicant.status}
              </td>
              <td className="p-3">{applicant.applicationDate}</td>
              <td
                className={`p-3 ${
                  applicant.label == "Tiềm năng"
                    ? "text-green-500 raleway-bold"
                    : ""
                } ${
                  applicant.label == "Ít tiềm năng"
                    ? "text-red-500 raleway-bold"
                    : ""
                }`}
              >
                {applicant.label}
              </td>
              <td className="p-3">
                <button className="ml-2 text-lg flex w-8 justify-center items-center aspect-square bg-red-500 rounded-lg text-white  hover:bg-red-800 transition-colors duration-200">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="p-3 text-center text-gray-500">
              Không có ứng viên nào
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
export default function Applicants() {
  const [jobList, setJobList] = useState([]);
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
      <ApplicantTable
        applicants={[
          {
            name: "Nguyễn Văn A",
            jobApplied: "Lập trình viên Frontend",
            email: "nguyenvana@example.com",
            phone: "0123456789",
            status: "Tiếp nhận",
            applicationDate: "2024-06-01",
            label: "Tiềm năng",
          },
          {
            name: "Trần Thị B",
            jobApplied: "Chuyên viên Marketing",
            email: "tranthib@example.com",
            phone: "0987654321",
            status: "Từ chối",
            applicationDate: "2024-06-02",
            label: "Ít tiềm năng",
          },
        ]}
      />
    </div>
  );
}
