import { IoMdCheckmark } from "react-icons/io";
import { CiClock2 } from "react-icons/ci";
import { BsWallet2 } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { AiOutlineExperiment } from "react-icons/ai";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Job = (props) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  return (
    <div className="h-42 relative bg-[#f4f5ff] border border-[#1C229E] hover:bg-white rounded-lg p-4 shadow-lg hover:border-[#E48309] hover:border-2 transition-all duration-100 cursor-pointer group">
      <button
        onClick={() => {
          props.ask(props.jobData);
        }}
        className="absolute opacity-0 group-hover:opacity-100 transition duration-200 right-5 top-[40%] bg-[#d2d5ff] text-[#1C229E] p-1 px-3 rounded-full hover:bg-white hover:border-[#E48309] hover:border hover:text-[#E48309]"
      >
        Hỏi AI {">>"}
      </button>
      <div className="flex gap-4 mb-2">
        <img
          src={props.jobData.logo}
          alt="company logo"
          className="h-auto w-[17%] border border-gray-300 rounded-lg p-1"
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
              navigate("2");
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

export default function JobDisplay(props) {
  const [selectedFilter, setSelectedFilter] = useState("job");
  return (
    <div className="col-span-2 ">
      <div className="flex items-center gap-3 ">
        <p className="text-md raleway-bold mt-1">Tìm kiếm theo:</p>
        <button
          className={` ${
            selectedFilter == "job"
              ? "bg-white border border-secondary-2-300 text-secondary-2-300"
              : "bg-gray-300 hover:bg-gray-400"
          } px-3 p-1 rounded-full flex items-center gap-1 `}
          onClick={() => setSelectedFilter("job")}
        >
          {selectedFilter == "job" && <IoMdCheckmark />}Việc làm
        </button>
        <button
          className={` ${
            selectedFilter == "company"
              ? "bg-white border border-secondary-2-300 text-secondary-2-300"
              : "bg-gray-300 hover:bg-gray-400"
          } px-3 p-1 rounded-full flex items-center gap-1 `}
          onClick={() => setSelectedFilter("company")}
        >
          {selectedFilter == "company" && <IoMdCheckmark />}Công ty
        </button>
        <button
          className={` ${
            selectedFilter == "both"
              ? "bg-white border border-secondary-2-300 text-secondary-2-300"
              : "bg-gray-300 hover:bg-gray-400"
          } px-3 p-1 rounded-full flex items-center gap-1 `}
          onClick={() => setSelectedFilter("both")}
        >
          {selectedFilter == "both" && <IoMdCheckmark />}Cả hai
        </button>
      </div>
      <div className="mt-4 space-y-4 max-h-[100vh] overflow-y-scroll">
        <Job
          jobData={{
            jobname: "Chuyên Viên Phát Triển Phần Mềm",
            company: "Công Ty ABC",
            category: "Công Nghệ Thông Tin",
            type: "Toàn thời gian",
            salaryMin: "15 tr",
            salaryMax: "25 tr",
            experience: "1 năm",
            location: "Hà Nội",
            extraTags: ["Công nghệ thông tin", "Chuyên viên"],
            tags: ["Hot", "1 giờ trước"],
            logo: "/images/exampleLogo.png",
          }}
          ask={(data) => {
            props.addData(data);
          }}
        />
        <Job
          jobData={{
            jobname: "Chuyên Viên Phát Triển Phần Mềm 2",
            company: "Công Ty ABC",
            category: "Công Nghệ Thông Tin",
            type: "Toàn thời gian",
            salaryMin: "15 tr",
            salaryMax: "25 tr",
            experience: "1 năm",
            location: "Hà Nội",
            extraTags: ["Công nghệ thông tin", "Chuyên viên"],
            tags: ["Hot", "1 giờ trước"],
            logo: "/images/exampleLogo.png",
          }}
          ask={(data) => {
            props.addData(data);
          }}
        />
        <Job
          jobData={{
            jobname: "Chuyên Viên Phát Triển Phần Mềm",
            company: "Công Ty ABC",
            category: "Công Nghệ Thông Tin",
            type: "Toàn thời gian",
            salaryMin: "15 tr",
            salaryMax: "25 tr",
            experience: "1 năm",
            location: "Hà Nội",
            extraTags: ["Công nghệ thông tin", "Chuyên viên"],
            tags: ["Hot", "1 giờ trước"],
            logo: "/images/exampleLogo.png",
          }}
          ask={(data) => {
            props.addData(data);
          }}
        />
        <Job
          jobData={{
            jobname: "Chuyên Viên Phát Triển Phần Mềm",
            company: "Công Ty ABC",
            category: "Công Nghệ Thông Tin",
            type: "Toàn thời gian",
            salaryMin: "15 tr",
            salaryMax: "25 tr",
            experience: "1 năm",
            location: "Hà Nội",
            extraTags: ["Công nghệ thông tin", "Chuyên viên"],
            tags: ["Hot", "1 giờ trước"],
            logo: "/images/exampleLogo.png",
          }}
          ask={(data) => {
            props.addData(data);
          }}
        />
        <Job
          jobData={{
            jobname: "Chuyên Viên Phát Triển Phần Mềm",
            company: "Công Ty ABC",
            category: "Công Nghệ Thông Tin",
            type: "Toàn thời gian",
            salaryMin: "15 tr",
            salaryMax: "25 tr",
            experience: "1 năm",
            location: "Hà Nội",
            extraTags: ["Công nghệ thông tin", "Chuyên viên"],
            tags: ["Hot", "1 giờ trước"],
            logo: "/images/exampleLogo.png",
          }}
          ask={(data) => {
            props.addData(data);
          }}
        />
        <Job
          jobData={{
            jobname: "Chuyên Viên Phát Triển Phần Mềm",
            company: "Công Ty ABC",
            category: "Công Nghệ Thông Tin",
            type: "Toàn thời gian",
            salaryMin: "15 tr",
            salaryMax: "25 tr",
            experience: "1 năm",
            location: "Hà Nội",
            extraTags: ["Công nghệ thông tin", "Chuyên viên"],
            tags: ["Hot", "1 giờ trước"],
            logo: "/images/exampleLogo.png",
          }}
          ask={(data) => {
            props.addData(data);
          }}
        />
      </div>
    </div>
  );
}
