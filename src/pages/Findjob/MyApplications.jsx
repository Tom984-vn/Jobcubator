import { useEffect } from "react";
import { fetchAppliedJobs } from "../../utils/Job";
import { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";
import { BsWallet2 } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const statusMapToVn = {
  PENDING: "Đang chờ",
  ACCEPTED: "Đã chấp nhận",
  REJECTED: "Đã từ chối",
  INTERVIEW: "Phỏng vấn",
  OFFERED: "Đã nhận đề nghị",
  REVIEWING: "Đang xem xét",
};
const Job = (props) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  return (
    <div
      className="relative bg-white rounded-lg box-content p-2 shadow-lg 
                border-2 border-transparent 
                hover:border-[#E48309] 
                transition-all duration-100 cursor-pointer group"
      onClick={() => navigate(`/jobs/${props.id}`)}
    >
      <div
        onClick={(e) => {
          e.stopPropagation(); // prevent navigating when clicking the heart
          setIsFavorite(!isFavorite);
        }}
        className={
          isFavorite
            ? "absolute right-2 top-2 rounded-full border-1 border-red-500 p-2 bg-[rgba(255,0,0,0.1)] text-red-500 hover:text-red-700 hover:bg-[rgba(255,0,0,0.2)] transition-all duration-300"
            : "absolute right-2 top-2 rounded-full border-1 border-[#E48309] p-2  text-[#E48309] hover:text-red-500 hover:bg-[rgba(255,0,0,0.1)] transition-all duration-300"
        }
      >
        <FaRegHeart />
      </div>

      <div className="flex gap-4 mb-4">
        <img src={props.logo} alt="company logo" className="h-auto w-[25%]" />

        <div>
          <div className="flex gap-2">
            <p
              className={`${
                props.status === "PENDING"
                  ? "bg-yellow-500"
                  : props.status === "ACCEPTED"
                  ? "bg-green-500"
                  : props.status === "REJECTED"
                  ? "bg-red-500"
                  : props.status === "INTERVIEW"
                  ? "bg-blue-500"
                  : props.status === "OFFERED"
                  ? "bg-purple-500"
                  : props.status === "REVIEWING"
                  ? "bg-indigo-500"
                  : "bg-gray-500"
              } text-white rounded-xl p-1 text-sm px-2`}
            >
              {statusMapToVn[props.status]}
            </p>
          </div>

          <h3 className="raleway-bold group-hover:text-[#E48309]">
            {props.jobname}
          </h3>
          <p className="text-sm text-gray-500">{props.company}</p>
          <p className="text-sm text-gray-500">
            <b className="text-black">Ứng tuyển ngày: </b>
            {formatDate(props.dateApplied)}
          </p>
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/chat");
              }}
              className="bg-primary-400 hover:bg-secondary-2-300 flex text-white text-sm items-center gap-2 px-4 py-2 rounded-md mt-3 transition-all duration-300"
            >
              <IoChatbubbleEllipsesOutline /> Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchBar = (props) => {
  return (
    <div className="w-[95%] mx-auto my-5 grid grid-cols-4 gap-4">
      <div className="border border-gray-300 rounded-lg p-2 w-full focus-within:outline-primary-400 flex gap-2">
        <BiSearchAlt size={24} className="text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm việc làm đã ứng tuyển"
          onChange={(e) => {
            props.setSearchFilter({
              ...props.searchFilter,
              keyword: e.target.value,
            });
          }}
          className="w-full focus:outline-0"
        />
      </div>

      <div className="flex gap-2 items-center col-span-2 text-sm">
        <p className="w-90">Ứng tuyển từ ngày</p>
        <input
          type="date"
          className="border border-gray-300 rounded-lg p-2 w-full"
          onChange={(e) => {
            props.setSearchFilter({
              ...props.searchFilter,
              dateApplied: e.target.value,
            });
          }}
        />

        <p className="w-45">Đến ngày</p>
        <input
          type="date"
          className="border border-gray-300 rounded-lg p-2 w-full"
          onChange={(e) => {
            props.setSearchFilter({
              ...props.searchFilter,
              dateAppliedTo: e.target.value,
            });
          }}
        />

        <p className="w-60">Trạng thái</p>
      </div>

      <select
        className="border border-gray-300 rounded-lg p-2 w-full"
        onChange={(e) => {
          props.setSearchFilter({
            ...props.searchFilter,
            status: e.target.value,
          });
        }}
      >
        <option value="">Tất cả</option>
        <option value="PENDING">Đang chờ</option>
        <option value="ACCEPTED">Đã chấp nhận</option>
        <option value="REJECTED">Đã từ chối</option>
        <option value="INTERVIEW">Phỏng vấn</option>
        <option value="OFFERED">Đã nhận đề nghị</option>
        <option value="REVIEWING">Đang xem xét</option>
      </select>
    </div>
  );
};

export default function MyApplications() {
  const [jobData, setJobData] = useState([]);
  const [searchFilter, setSearchFilter] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const data = await fetchAppliedJobs(accessToken);

        console.log("Applied Jobs:", data);
        setJobData(data);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchData();
  }, []);
  const filteredJobs = jobData.filter((job) => {
    const keywordMatch =
      !searchFilter.keyword ||
      job.jobTitle.toLowerCase().includes(searchFilter.keyword.toLowerCase()) ||
      job.companyName
        .toLowerCase()
        .includes(searchFilter.keyword.toLowerCase());

    const statusMatch =
      !searchFilter.status || job.status === searchFilter.status;

    const jobDate = job.appliedAt ? new Date(job.appliedAt) : null;

    const dateStartMatch =
      !searchFilter.dateApplied ||
      (jobDate && jobDate >= new Date(searchFilter.dateApplied));

    const dateEndMatch =
      !searchFilter.dateAppliedTo ||
      (jobDate && jobDate <= new Date(searchFilter.dateAppliedTo));

    return keywordMatch && statusMatch && dateStartMatch && dateEndMatch;
  });

  return (
    <div className="p-5 min-h-screen">
      <div className="w-[95%] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Việc làm đã ứng tuyển</h1>
        <p>Danh sách các việc làm bạn đã ứng tuyển sẽ hiển thị ở đây.</p>
      </div>

      <SearchBar
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
      />

      <div className="grid grid-cols-3 gap-4 w-[95%] mx-auto my-5">
        {filteredJobs.length ? (
          filteredJobs.map((job) => (
            <Job
              key={job.id}
              id={job.jobPostId}
              logo={job.companyLogo || "/images/exampleLogo.png"}
              jobname={job.jobTitle}
              status={job.status}
              company={job.companyName}
              dateApplied={job.appliedAt}
            />
          ))
        ) : (
          <p className="text-lg text-gray-500 text-center w-full">
            Không có việc làm nào phù hợp với bộ lọc của bạn.
          </p>
        )}
      </div>
    </div>
  );
}
