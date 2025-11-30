import { NavLink } from "react-router-dom";
import SearchBar from "../Findjob/SearchBar";
import { RxCaretRight } from "react-icons/rx";
import { GiTwoCoins } from "react-icons/gi";
import { IoLocationSharp } from "react-icons/io5";
import { IoMdPaperPlane } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa6";
import { IoPeople } from "react-icons/io5";
import { FaCube } from "react-icons/fa";
import { FaMedal } from "react-icons/fa6";
import { GiGraduateCap } from "react-icons/gi";
import { IoBriefcase } from "react-icons/io5";

import Job from "../../components/NavBar/Job";
import Course from "../../components/Course/Course";
import { CgSandClock } from "react-icons/cg";
import { applyJob } from "../../utils/Job";
import { useEffect } from "react";
const testJobData = {
  jobname: "Java Backend Developer (Junior-Middle-Senior)",
  salaryMin: "15 triệu",
  salaryMax: "25 triệu",
  type: "Toàn thời gian",
  location: "Hà Nội",
  experience: "Không yêu cầu",
  deadline: "30/12/2025",
  education: "Đại học",
  requirements: [
    "Tốt nghiệp đại học chuyên ngành Công nghệ Thông tin hoặc các ngành liên quan.",
    "Có kiến thức vững về ngôn ngữ lập trình Java và các framework phổ biến như Spring, Hibernate.",
    "Hiểu biết về cơ sở dữ liệu quan hệ (MySQL, PostgreSQL) và NoSQL (MongoDB).",
    "Kinh nghiệm làm việc với các công cụ quản lý phiên bản như Git.",
    "Kỹ năng giải quyết vấn đề và tư duy logic tốt.",
    "Khả năng làm việc nhóm và giao tiếp hiệu quả.",
  ],
  benefits: [
    "Mức lương cạnh tranh và thưởng theo hiệu suất làm việc.",
    "Cơ hội thăng tiến và phát triển nghề nghiệp.",
    "Môi trường làm việc năng động, sáng tạo và thân thiện.",
    "Chế độ bảo hiểm và phúc lợi đầy đủ theo quy định của pháp luật.",
    "Các hoạt động team-building và sự kiện công ty thường xuyên.",
  ],
  schedule: "Thứ Hai - Thứ Sáu, 9:00 AM - 6:00 PM",
  description: [
    {
      name: "Fresher-Junior",
      content:
        "- Tham gia phát triển, bảo trì và nâng cấp các ứng dụng backend sử dụng ngôn ngữ Java.\n- Hỗ trợ trong việc thiết kế kiến trúc hệ thống và tối ưu hiệu suất ứng dụng.\n- Làm việc chặt chẽ với các nhóm frontend và QA để đảm bảo chất lượng sản phẩm.\n- Tham gia vào quá trình code review và viết tài liệu kỹ thuật liên quan đến dự án.\n- Học hỏi và áp dụng các công nghệ mới trong quá trình phát triển phần mềm.\n",
    },
    {
      name: "Middle-Senior",
      content:
        "- Thiết kế, phát triển và triển khai các ứng dụng backend phức tạp sử dụng Java.\n- Lãnh đạo nhóm phát triển, hướng dẫn và hỗ trợ các thành viên trong nhóm.\n- Đảm bảo kiến trúc hệ thống đáp ứng các yêu cầu về hiệu suất, bảo mật và khả năng mở rộng.\n- Tham gia vào quá trình đánh giá mã nguồn, tối ưu hóa hiệu suất và giải quyết các vấn đề kỹ thuật.\n- Cộng tác với các nhóm khác để đảm bảo tích hợp liền mạch giữa frontend và backend.\n- Nghiên cứu và áp dụng các công nghệ mới để cải thiện quy trình phát triển phần mềm.\n",
    },
  ],
  detailedLocation: "Số 123, Đường ABC, Quận XYZ, Hà Nội",
  applyMethod:
    "Ứng viên nộp hồ sơ trực tuyến bằng cách bấm Ứng tuyển ngay dưới đây.",
  vacancies: 5,
};
const testCompanyData = {
  name: "Công Ty ABC",
  logo: "/images/exampleLogo.png",
  description:
    "Công Ty ABC là một trong những công ty hàng đầu trong lĩnh vực công nghệ thông tin tại Việt Nam, chuyên cung cấp các giải pháp phần mềm và dịch vụ tư vấn công nghệ cho khách hàng trong và ngoài nước.",
  website: "www.congtyabc.com",
  location: "Hà Nội, Việt Nam",
  employees: "200-500 nhân viên",
  field: " Công nghệ thông tin",
};
const Tag = ({ name }) => {
  return (
    <span className="bg-gray-200 text-gray-700 text-sm font-medium mr-2 px-2.5 py-0.5 rounded hover:bg-gray-300 cursor-pointer">
      {name}
    </span>
  );
};
const formatToMillions = (value) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "tr VND";
  }
  return value;
};
import { useState } from "react";
import { useParams } from "react-router-dom";
import { fetchJobById } from "../../utils/Job";
import { fetchCompanyById } from "../../utils/Company";
import JobApplicationModal from "./JobApplicationForm";
const mapJobTypeToVietnamese = {
  "full-time": "Toàn thời gian",
  "part-time": "Bán thời gian",
};
export default function JobDetail() {
  const [jobData, setJobData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const jobId = useParams().id;
  const [companyData, setCompanyData] = useState(null);
  useEffect(() => {
    // Fetch job data by ID here
    const fetchData = async () => {
      const data = await fetchJobById(jobId); // Replace 2 with dynamic ID as needed
      setJobData(data);
    };
    if (jobId) {
      fetchData();
    }
  }, []);
  const sendApplication = async (coverLetter) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Vui lòng đăng nhập để ứng tuyển.");
        return;
      }
      await applyJob(jobId, coverLetter, accessToken);
      alert("Ứng tuyển thành công!");
      setOpenModal(false);
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Ứng tuyển thất bại. Vui lòng thử lại sau.");
    }
  };
  useEffect(() => {
    // Fetch company data by ID here
    const fetchCompanyData = async () => {
      if (jobData && jobData.companyId) {
        const data = await fetchCompanyById(jobData.companyId);
        setCompanyData(data);
      }
    };
    fetchCompanyData();
  }, [jobData]);
  return (
    jobData &&
    companyData && (
      <div className="bg-gray-100 pb-10">
        <JobApplicationModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          jobData={jobData}
          sendApplication={sendApplication}
        />
        <SearchBar useFilter={false} />
        <div className="w-[85%] mx-auto">
          <div className="flex items-center gap-2 text-md text-gray-500 py-4 ">
            <NavLink className={"raleway-bold text-primary-400"} to={"/"}>
              Trang chủ
            </NavLink>
            <RxCaretRight className="text-xl" />
            <NavLink className={"raleway-bold text-primary-400"} to={"/jobs"}>
              Tìm việc
            </NavLink>
            <RxCaretRight className="text-xl" />
            <p> {jobData.title}</p>
          </div>
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              <div className="bg-white rounded-lg p-5">
                <h1 className="raleway-bold text-2xl">{jobData.title}</h1>
                <div className="grid grid-cols-3 mt-5">
                  <div className="flex items-center gap-3 ">
                    <div className="bg-linear-to-t from-primary-100 to-primary-400 rounded-full p-2 ">
                      <GiTwoCoins className="text-2xl text-white " />
                    </div>
                    <div>
                      <p>Mức lương</p>
                      <p className="inline text-md font-semibold text-primary-400">
                        {formatToMillions(jobData.minSalary)} -{" "}
                        {formatToMillions(jobData.maxSalary)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ">
                    <div className="bg-linear-to-t from-primary-100 to-primary-400 rounded-full p-2 ">
                      <IoLocationSharp className="text-2xl text-white " />
                    </div>
                    <div>
                      <p>Địa điểm</p>
                      <p className="inline text-md font-semibold text-primary-400">
                        {jobData.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ">
                    <div className="bg-linear-to-t from-primary-100 to-primary-400 rounded-full p-2 ">
                      <CgSandClock className="text-2xl text-white " />
                    </div>
                    <div>
                      <p>Kinh nghiệm</p>
                      <p className="inline text-md font-semibold text-primary-400">
                        1 năm
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 mt-2">
                  Hạn nộp hồ sơ:{" "}
                  <span className="text-primary-300 font-bold">
                    {new Date(jobData.applicationDeadline).toLocaleDateString()}
                  </span>
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => {
                      setOpenModal(true);
                    }}
                    className="bg-secondary-2-300 flex items-center justify-center w-[75%] text-white px-4 py-1 rounded-md hover:bg-secondary-2-400 transition"
                  >
                    <IoMdPaperPlane className="inline mr-2" />
                    Ứng tuyển ngay
                  </button>
                  <button className="raleway-bold flex items-center border border-secondary-2-300 bg-white text-secondary-2-300 px-4 py-2 rounded-md hover:border-2 transition">
                    <CiHeart className="inline mr-2 text-xl" />
                    Lưu việc làm
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-lg p-5 mt-10">
                <div className="flex justify-between">
                  <h1 className="border-l-6 border-secondary-2-300 text-xl raleway-bold px-2">
                    Chi tiết tin tuyển dụng
                  </h1>
                  <p className="flex items-center gap-1 text-primary-300 raleway-bold cursor-pointer">
                    <FaRegBell /> Nhắc tôi về công việc tương tự
                  </p>
                </div>
                <div className="mt-5">
                  <p className="raleway-bold">Mô tả công việc:</p>
                  {jobData.description ||
                    testJobData.description.map((section, index) => (
                      <div key={index} className="mt-2">
                        <p className="font-semibold">{section.name}:</p>
                        <pre className="whitespace-pre-wrap text-justify">
                          {section.content}
                        </pre>
                      </div>
                    ))}
                </div>
                <div className="mt-5">
                  <p className="raleway-bold">Yêu cầu ứng viên:</p>
                  <ul className="list-disc list-inside mt-2">
                    {jobData.requirements ||
                      testJobData.requirements.map((req, index) => (
                        <li key={index} className="text-justify">
                          {req}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="mt-5">
                  <p className="raleway-bold">Quyền lợi được hưởng:</p>
                  <ul className="list-disc list-inside mt-2">
                    {jobData.benefits ||
                      testJobData.benefits.map((benefit, index) => (
                        <li key={index} className="text-justify">
                          {benefit}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="mt-5">
                  <p className="raleway-bold">Địa chỉ làm việc:</p>
                  <p className="mt-2 text-justify">
                    - {testJobData.detailedLocation}
                  </p>
                </div>
                <div className="mt-5">
                  <p className="raleway-bold">Lịch làm việc:</p>
                  <p className="mt-2 text-justify">- {testJobData.schedule}</p>
                </div>
                <div className="mt-5">
                  <p className="raleway-bold">Hướng dẫn ứng tuyển:</p>
                  <p className="mt-2 text-justify">
                    - {testJobData.applyMethod}
                  </p>
                </div>
                <p className="mt-3">
                  Hạn nộp hồ sơ:{" "}
                  {new Date(jobData.applicationDeadline).toLocaleDateString()}
                </p>
                <div className="flex gap-4 mt-4">
                  <button className="bg-secondary-2-300 flex items-center justify-center w-[75%] text-white px-4 py-1 rounded-md hover:bg-secondary-2-400 transition">
                    <IoMdPaperPlane className="inline mr-2" />
                    Ứng tuyển ngay
                  </button>
                  <button className="raleway-bold flex items-center border border-secondary-2-300 bg-white text-secondary-2-300 px-4 py-2 rounded-md hover:border-2 transition">
                    <CiHeart className="inline mr-2 text-xl" />
                    Lưu việc làm
                  </button>
                </div>
                <h1 className="border-l-6 border-secondary-2-300 text-xl raleway-bold px-2 mt-10">
                  Việc Làm Liên Quan
                </h1>
                <div className="mt-5 space-y-5">
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
                  />
                </div>
                <h1 className="border-l-6 border-secondary-2-300 text-xl raleway-bold px-2 mt-10">
                  Các khóa học hữu ích
                </h1>
                <div className="mt-5 mb-10 overflow-x-scroll overflow-y-clip">
                  <div className="flex items-center w-fit gap-4">
                    <Course
                      courseData={{
                        name: "Lập Trình Viên Java Từ Cơ Bản Đến Nâng Cao",
                        provider: "Udemy",
                        providerLogo: "/images/exampleLogo.png",
                        price: "499,000 VND",
                        rating: 4.5,
                        reviews: 1500,
                        students: 1200,
                        image: "/images/fullstackBanner.jpg",
                        skills: ["Java", "Backend", "Spring"],
                      }}
                    />
                    <Course
                      courseData={{
                        name: "Lập Trình Viên Java Từ Cơ Bản Đến Nâng Cao",
                        provider: "Udemy",
                        providerLogo: "/images/exampleLogo.png",
                        price: "499,000 VND",
                        rating: 4.5,
                        reviews: 1500,
                        students: 1200,
                        image: "/images/fullstackBanner.jpg",
                        skills: ["Java", "Backend", "Spring"],
                      }}
                    />
                    <Course
                      courseData={{
                        name: "Lập Trình Viên Java Từ Cơ Bản Đến Nâng Cao",
                        provider: "Udemy",
                        providerLogo: "/images/exampleLogo.png",
                        price: "499,000 VND",
                        rating: 4.5,
                        reviews: 1500,
                        students: 1200,
                        image: "/images/fullstackBanner.jpg",
                        skills: ["Java", "Backend", "Spring"],
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 ml-5 sticky top-20 h-fit">
              <div className="bg-white rounded-lg p-5">
                <div className="flex gap-2">
                  <img
                    src={testCompanyData.logo}
                    alt="company logo"
                    className="w-20 border border-gray-300 rounded-lg p-1"
                  />
                  <h2 className="raleway-bold text-lg">{companyData.name}</h2>
                </div>
                <div className="flex items-center mt-5 gap-2">
                  <IoPeople className="text-gray-500" />{" "}
                  <p className="text-gray-500"> Quy mô:</p>{" "}
                  <p className="font-semibold">{companyData.size}</p>
                </div>
                <div className="flex items-center mt-5 gap-2">
                  <FaCube className="text-gray-500" />{" "}
                  <p className="text-gray-500"> Lĩnh vực:</p>{" "}
                  <p className="font-semibold">{testCompanyData.field}</p>
                </div>
                <div className="flex items-center mt-5 gap-2">
                  <IoLocationSharp className="text-gray-500" />{" "}
                  <p className="text-gray-500"> Địa chỉ:</p>{" "}
                  <p className="font-semibold">{testCompanyData.location}</p>
                </div>
                <div className="flex items-center mt-5 gap-2">
                  <FaCube className="text-gray-500" />{" "}
                  <p className="text-gray-500"> Website:</p>{" "}
                  <a
                    href={`https://${companyData.website}`}
                    className="font-semibold text-primary-400 hover:underline"
                  >
                    {companyData.website}
                  </a>
                </div>
              </div>
              <div className="bg-white rounded-lg p-5 mt-5">
                <h1 className="raleway-bold text-xl">Thông tin chung</h1>

                <div className="grid grid-cols-2 gap-1 mt-2">
                  <div className="flex items-center gap-3 mt-5">
                    <div className="bg-linear-to-t from-primary-100 to-primary-400 rounded-full p-2 ">
                      <FaMedal className="text-2xl text-white " />
                    </div>
                    <div>
                      <p>Cấp bậc</p>
                      <p className="inline text-md font-semibold text-primary-400">
                        Nhân viên
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="bg-linear-to-t from-primary-100 to-primary-400 rounded-full p-2 ">
                      <GiGraduateCap className="text-2xl text-white " />
                    </div>
                    <div>
                      <p>Học vấn</p>
                      <p className="inline text-md font-semibold text-primary-400">
                        {testJobData.education}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="bg-linear-to-t from-primary-100 to-primary-400 rounded-full p-2 ">
                      <IoPeople className="text-2xl text-white " />
                    </div>
                    <div>
                      <p>Số lượng tuyển</p>
                      <p className="inline text-md font-semibold text-primary-400">
                        {jobData.numberOfVacancies} người
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="bg-linear-to-t from-primary-100 to-primary-400 rounded-full p-2 ">
                      <IoBriefcase className="text-2xl text-white " />
                    </div>
                    <div>
                      <p>Hình thức làm việc</p>
                      <p className="inline text-md font-semibold text-primary-400">
                        {mapJobTypeToVietnamese[jobData.jobType]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
