import { FaPlusCircle } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function EmployerSearch() {
  return (
    <div className="bg-white grid grid-cols-3 p-3 gap-4">
      <div className="border border-gray-300 rounded-lg p-2 w-full flex items-center">
        <input
          type="text"
          placeholder="Tìm kiếm tên việc đăng tuyển"
          className="  w-full"
        />
        <IoSearch className="inline -ml-8 text-gray-400 text-xl" />
      </div>
      <select className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400">
        <option value="">Tất cả trạng thái</option>
        <option value="active">Đang đăng tuyển</option>
        <option value={"pending"}>Chờ duyệt</option>
        <option value="inactive">Hoàn thành đăng tuyển</option>
      </select>
      <div className="flex items-baseline w-full gap-2">
        <input
          placeholder="Mức lương tối thiểu"
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400"
        />
        <p>-</p>
        <input
          placeholder="Mức lương tối đa"
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400"
        />
      </div>
      <div>
        <select className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400">
          <option value="">Kinh nghiệm</option>
          <option value="0">Chưa có kinh nghiệm</option>
          <option value="1">1 năm</option>
          <option value="2">2 năm</option>
          <option value="3">3 năm</option>
          <option value="4">4 năm</option>
          <option value="5">5 năm</option>
          <option value=">5">Trên 5 năm</option>
        </select>
      </div>
      <div>
        <select className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400">
          <option value="">Loại hình công việc</option>
          <option value="Full-time">Toàn thời gian</option>
          <option value="Part-time">Bán thời gian</option>
          <option value="Internship">Thực tập</option>
        </select>
      </div>
      <div>
        <select className="border border-gray-300 rounded-lg p-2 w-full focus:outline-primary-400">
          <option value="">Mức độ ưu tiên</option>
          <option value="high">Cao</option>
          <option value="medium">Trung bình</option>
          <option value="low">Thấp</option>
        </select>
      </div>
    </div>
  );
}
function EmployerJobList(props) {
  const navigate = useNavigate();
  return (
    <table className="bg-white rounded-lg m-5 text-sm">
      <thead>
        <tr>
          <th className="text-left p-3 border-b border-gray-300">Tiêu đề</th>
          <th className="text-left p-3 border-b border-gray-300">Trạng thái</th>
          <th className="text-left p-3 border-b border-gray-300">Loại hình</th>
          <th className="text-left p-3 border-b border-gray-300">
            Kinh nghiệm
          </th>
          <th className="text-left p-3 border-b border-gray-300">Mức lương</th>
          <th className="text-left p-3 border-b border-gray-300">Ngày đăng</th>
          <th className="text-left p-3 border-b border-gray-300">
            Số lượng cần tuyển
          </th>
          <th className="text-left p-3 border-b border-gray-300">
            Số lượng ứng tuyển
          </th>
          <th className="text-left p-3 border-b border-gray-300">Ưu tiên</th>
          <th className="text-left p-3 border-b border-gray-300">Hành động</th>
        </tr>
        {props.jobs.map((job) => (
          <tr
            key={job.id}
            onClick={() => navigate(`${job.id}`)}
            className="hover:bg-gray-100 transition-colors duration-150 cursor-pointer border-b border-gray-300"
          >
            <td className="p-3">{job.title}</td>
            <td className="p-3 ">{job.status}</td>
            <td className="p-3 ">{job.jobType}</td>
            <td className="p-3 ">{job.experience} năm</td>
            <td className="p-3 ">{job.salary}</td>
            <td className="p-3 ">{job.postedDate}</td>
            <td className="p-3 ">{job.positions}</td>
            <td className="p-3 ">{job.applicants}</td>
            <td
              className={
                "p-3 " +
                (job.priority == "Cao" ? " text-green-500 font-bold" : "") +
                (job.priority == "Trung bình"
                  ? " text-yellow-500 font-bold"
                  : "") +
                (job.priority == "Thấp" ? " text-red-500 font-bold" : "")
              }
            >
              {job.priority}
            </td>
            <td className="p-3  flex">
              <button className="text-lg flex justify-center p-1 w-8 items-center aspect-square bg-primary-400 rounded-lg text-white hover:bg-secondary-2-100 transition-colors duration-200">
                <MdModeEdit />
              </button>
              <button className="ml-2 text-lg flex w-8 justify-center items-center aspect-square bg-red-500 rounded-lg text-white  hover:bg-red-800 transition-colors duration-200">
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </thead>
    </table>
  );
}
export default function EmployerJobs() {
  const navigate = useNavigate();
  return (
    <div className="w-full box-border">
      <div className="bg-white raleway-bold text-xl border-b border-gray-500 w-full p-5 flex justify-between items-center">
        <p>Quản lý việc làm</p>
        <button
          onClick={() => {
            navigate("add");
          }}
          className="bg-primary-400 text-white px-4 py-2 rounded-lg text-sm hover:bg-secondary-2-100 transition-colors duration-200"
        >
          <FaPlusCircle className="inline mr-2" />
          Thêm việc làm
        </button>
      </div>
      <EmployerSearch />
      <EmployerJobList
        jobs={[
          {
            id: 1,
            title: "Lập trình viên Frontend",
            status: "Đang đăng tuyển",
            jobType: "Full-time",
            experience: 2,
            salary: "15-20 triệu",
            postedDate: "2024-06-01",
            positions: 3,
            applicants: 25,
            priority: "Cao",
          },
          {
            id: 2,
            title: "Chuyên viên Marketing",
            status: "Chờ duyệt",
            jobType: "Part-time",
            experience: 1,
            salary: "10-15 triệu",
            postedDate: "2024-05-28",
            positions: 2,
            applicants: 10,
            priority: "Trung bình",
          },
        ]}
      />
    </div>
  );
}
