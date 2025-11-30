import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";

export default function ApplicantTable(props) {
  const [statuses, setStatuses] = useState(
    props.applicants.map((applicant) => "PENDING")
  );
  return (
    <table className="bg-white rounded-lg m-5 text-sm w-[95%] mx-auto">
      <thead>
        <tr className="text-left border-b border-gray-300">
          <th className="p-3">Tên ứng viên</th>
          <th className="p-3">Công việc ứng tuyển</th>
          <th className="p-3">Email</th>
          <th className="p-3">Link CV</th>
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
              <td className="p-3">{applicant.candidateName}</td>
              <td className="p-3">{applicant.jobTitle}</td>
              <td className="p-3">{applicant.candidateEmail}</td>
              <td className="p-3 text-primary-400 raleway-bold hover:underline">
                <a
                  href={"http://localhost:9000/" + applicant.candidateCV}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Link CV
                </a>
              </td>
              <select
                className={
                  "p-3 border border-gray-300 rounded-lg" +
                  (statuses[index] === "PENDING"
                    ? " text-yellow-500 raleway-bold"
                    : "") +
                  (statuses[index] === "ACCEPTED"
                    ? " text-green-500 raleway-bold"
                    : "") +
                  (statuses[index] === "REJECTED"
                    ? " text-red-500 raleway-bold"
                    : "")
                }
                value={statuses[index]}
                onChange={(e) => {
                  const newStatuses = [...statuses];
                  newStatuses[index] = e.target.value;
                  setStatuses(newStatuses);
                }}
              >
                <option
                  value="PENDING"
                  className="text-yellow-500 raleway-bold"
                >
                  Đang chờ
                </option>
                <option
                  value="ACCEPTED"
                  className="text-green-500 raleway-bold"
                >
                  Tiếp nhận
                </option>
                <option value="REJECTED" className="text-red-500 raleway-bold">
                  Từ chối
                </option>
              </select>
              {/* <td
                className={`p-3 ${
                  applicant.status == "Từ chối"
                    ? " text-red-500 raleway-bold"
                    : ""
                } ${
                  applicant.status == "Tiếp nhận"
                    ? " text-green-500 raleway-bold"
                    : ""
                }
                 ${
                   applicant.status == "PENDING"
                     ? " text-yellow-500 raleway-bold"
                     : ""
                 }`}
              >
                {applicant.status == "PENDING" ? "Đang chờ" : applicant.status}
              </td> */}
              <td className="p-3">
                {new Date(applicant.appliedAt).toLocaleDateString()}
              </td>
              <td
                className={`p-3 text-green-500 raleway-bold
                `}
              >
                Tiềm năng
              </td>
              <td className="p-3 flex">
                <button className="ml-2 text-lg flex w-8 justify-center items-center aspect-square bg-primary-400 rounded-lg text-white hover:bg-secondary-2-300 transition-colors duration-200">
                  <IoChatbubbleEllipses />
                </button>
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
