import { useState } from "react";
import { CiClock2 } from "react-icons/ci";
import { AiOutlineExperiment } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
const Job = (props) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  return (
    <div className="h-42 relative bg-[#f4f5ff] border border-[#1C229E] hover:bg-white rounded-lg p-4 shadow-lg hover:border-[#E48309] hover:border-2 transition-all duration-100 cursor-pointer group">
      <div className="flex gap-4 mb-2">
        <img
          src={props.jobData.logo}
          alt="company logo"
          className="h-auto w-[12%] border border-gray-300 rounded-lg p-1"
        />
        <div className="border-b border-gray-300 w-full">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {props.jobData.tags.map((tag) => {
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
            <p className="text-primary-400 font-bold group-hover:text-[#E48309]">
              {props.jobData.salaryMin} - {props.jobData.salaryMax}
            </p>
          </div>
          <h3 className="raleway-bold group-hover:text-[#E48309]">
            {props.jobData.jobname}
          </h3>
          <p className="text-sm text-gray-500">{props.jobData.company}</p>
          <div className="flex justify-around gap-2 w-fit">
            <p className="flex items-center gap-1">
              <CiClock2 color="#E48309" /> {props.jobData.type}
            </p>
            <p className="flex items-center gap-1">
              <AiOutlineExperiment color="#E48309" /> {props.jobData.experience}
            </p>
            <p className="flex items-center gap-1">
              <IoLocationOutline color="#E48309" /> {props.jobData.location}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex w-max-[60%] overflow-auto">
          {props.jobData.extraTags &&
            props.jobData.extraTags.map((tag) => {
              return (
                <p className="text-gray-500 border-r border-gray-300 px-1 text-sm hover:underline">
                  {tag}
                </p>
              );
            })}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigate("/jobs/2");
            }}
            className="bg-primary-200 text-white p-1 px-2 rounded-full hover:bg-secondary-2-300"
          >
            Ứng tuyển
          </button>
          <div
            onClick={() => {
              setIsFavorite(!isFavorite);
            }}
            className={
              isFavorite
                ? "rounded-full border-1 border-red-500 p-2 bg-[rgba(255,0,0,0.1)] text-red-500 hover:text-red-700 hover:bg-[rgba(255,0,0,0.2)] transition-all duration-300"
                : "rounded-full border-1 border-[#E48309] p-2  text-[#E48309] hover:text-red-500 hover:bg-[rgba(255,0,0,0.1)] transition-all duration-300"
            }
          >
            <FaRegHeart />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Job;
