import { CiClock2 } from "react-icons/ci";
import { BsWallet2 } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { useEffect, useState } from "react";
import "./RecentJob.css";
import { PiCaretLeft } from "react-icons/pi";
import { PiCaretRight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { fetchRecentJobs } from "../../utils/Job";
const Job = (props) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className="relative bg-white rounded-lg box-content p-4 shadow-lg 
                border-2 border-transparent 
                hover:border-[#E48309] 
                transition-all duration-100 cursor-pointer group"
      onClick={() => navigate(`/jobs/${props.id}`)}
    >
      <div
        onClick={() => {
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
            {props.tags.map((tag) => {
              return (
                <p
                  className={`${
                    tag == "Hot" ? "bg-[#E48309]" : "bg-[#1C229E]"
                  } text-white rounded-xl p-1 text-sm px-2 `}
                >
                  {tag}
                </p>
              );
            })}
          </div>
          <h3 className="raleway-bold group-hover:text-[#E48309]">
            {props.jobname}
          </h3>
          <p className="text-sm text-gray-500">{props.company}</p>
        </div>
      </div>
      <div className="flex justify-around gap-2 w-full">
        <p className="flex items-center gap-1">
          <CiClock2 color="#E48309" /> {props.type}
        </p>
        <p className="flex items-center gap-1">
          <BsWallet2 color="#E48309" /> {props.salaryMin} - {props.salaryMax}{" "}
          VND
        </p>
        <p className="flex items-center gap-1">
          <IoLocationOutline color="#E48309" /> {props.location}
        </p>
      </div>
    </div>
  );
};
function formatToMillions(amount) {
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1) + "tr";
  } else if (amount >= 1_000) {
    return (amount / 1_000).toFixed(1) + "K";
  }
  return amount.toString();
}
export default function RecentJob() {
  const [currentPage, setCurrentPage] = useState(0);
  const maxPage = 5;
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function getJobs() {
      try {
        const data = await fetchRecentJobs({ page: currentPage, size: 9 });
        setJobs(data.content);
      } catch (error) {
        console.error("Error fetching recent jobs:", error);
      }
    }
    getJobs();
  }, [currentPage]);

  return (
    <div className="bg-[#f3f5f7] py-10">
      <div className="w-[85%] mx-auto">
        <h1 className="raleway-bold text-3xl text-[#1C229E]">
          Công Việc Mới Gần Đây
        </h1>
        <p>Hãy tham khảo những công việc mới nhất, được cập nhật hàng giờ!</p>
        <p className="text-[#1C229E] text-right underline hover:font-bold text-lg">
          Xem thêm
        </p>
        <div className="grid grid-cols-3 gap-4 my-10">
          {jobs &&
            jobs.map((job) => (
              <Job
                key={job.id}
                id={job.id}
                logo={"/images/exampleLogo.png"}
                jobname={job.title}
                company={"Google"}
                tags={["Hot", "1 giờ trước"]}
                type={job.jobType}
                salaryMin={formatToMillions(job.minSalary)}
                salaryMax={formatToMillions(job.maxSalary)}
                location={job.location}
              />
            ))}
        </div>
        <div className="flex justify-center items-center gap-2">
          <button
            className={`${
              currentPage > 0
                ? "text-[#E48309] rounded-full border-1 p-1 text-2xl hover:text-white hover:bg-[#E48309] transition-all duration-100"
                : "text-gray-300 rounded-full border-1 p-1 text-2xl cursor-not-allowed"
            }`}
            onClick={() => {
              if (currentPage <= 0) return;
              setCurrentPage(currentPage - 1);
            }}
          >
            <PiCaretLeft />
          </button>
          <p>
            <span className="text-[#E48309] font-bold">{currentPage + 1}</span>{" "}
            / {maxPage} trang
          </p>
          <button
            className={`${
              currentPage < maxPage
                ? "text-[#E48309] rounded-full border-1 p-1 text-2xl hover:text-white hover:bg-[#E48309] transition-all duration-100"
                : "text-gray-300 rounded-full border-1 p-1 text-2xl cursor-not-allowed"
            }`}
            onClick={() => {
              if (currentPage >= maxPage) return;
              setCurrentPage(currentPage + 1);
            }}
          >
            <PiCaretRight />
          </button>
        </div>
      </div>
    </div>
  );
}
