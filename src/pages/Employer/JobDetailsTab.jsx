import Course from "../../components/Course/Course";
import JobStat from "../../components/Employer/JobStat";
import { FaEye } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { GiTwoCoins } from "react-icons/gi";
import { IoLocationSharp } from "react-icons/io5";
import { CgSandClock } from "react-icons/cg";
import { FaRegBell } from "react-icons/fa6";
import { IoMdPaperPlane } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { FaMedal } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { IoPeople } from "react-icons/io5";
import { FaCube } from "react-icons/fa";
import { IoBriefcase } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

const formatToMillions = (value) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "tr VND";
  }
  return value;
};
const mapJobTypeToVietnamese = {
  "full-time": "Toàn thời gian",
  "part-time": "Bán thời gian",
  internship: "Thực tập",
};
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

export default function JobDetailsTab(props) {
  return (
    <div>
      <div className="grid grid-cols-3">
        <div className="col-span-2">
          <div className="bg-white rounded-lg p-5">
            <h1 className="raleway-bold text-2xl">{props.jobData.title}</h1>
            <div className="grid grid-cols-3 mt-5">
              <div className="flex items-center gap-3 ">
                <div className="bg-linear-to-t from-primary-100 to-primary-400 rounded-full p-2 ">
                  <GiTwoCoins className="text-2xl text-white " />
                </div>
                <div>
                  <p>Mức lương</p>
                  <p className="inline text-md font-semibold text-primary-400">
                    {formatToMillions(props.jobData.minSalary)} -{" "}
                    {formatToMillions(props.jobData.maxSalary)}
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
                    {props.jobData.location}
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
                {new Date(
                  props.jobData.applicationDeadline
                ).toLocaleDateString()}
              </span>
            </p>
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
              {props.jobData.description ||
                testJobData.description.map((section) => (
                  <div key={section.name} className="mt-4">
                    <h2 className="raleway-bold text-md">[{section.name}]</h2>
                    <p className="whitespace-pre-line mt-2 text-justify">
                      {section.content}
                    </p>
                  </div>
                ))}
            </div>
            <div className="mt-5">
              <p className="raleway-bold">Yêu cầu ứng viên:</p>
              <ul className="list-disc list-inside mt-2">
                {props.jobData.requirements ||
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
                {props.jobData.benefits ||
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
                -{" "}
                {props.jobData.detailedLocation || testJobData.detailedLocation}
              </p>
            </div>
            <div className="mt-5">
              <p className="raleway-bold">Lịch làm việc:</p>
              <p className="mt-2 text-justify">
                - {props.jobData.schedule || testJobData.schedule}
              </p>
            </div>
            <div className="mt-5">
              <p className="raleway-bold">Hướng dẫn ứng tuyển:</p>
              <p className="mt-2 text-justify">
                - {props.jobData.applyMethod || testJobData.applyMethod}
              </p>
            </div>
            <p className="mt-3">
              Hạn nộp hồ sơ:{" "}
              {new Date(
                props.jobData.applicationDeadline ||
                  testJobData.applicationDeadline
              ).toLocaleDateString()}
            </p>
            <div className="flex justify-between items-baseline">
              <h1 className="border-l-6 border-secondary-2-300 text-xl raleway-bold px-2 mt-10">
                Đính kèm các khóa học hỗ trợ cho công việc này
              </h1>
              <button className="bg-primary-400 text-white hover:bg-secondary-2-300 text-md transition-all duration-200 p-2 px-4 rounded-full mt-10 flex items-center gap-2">
                Thêm khóa học
              </button>
            </div>
            <div className="mt-5 mb-10 overflow-x-scroll overflow-y-clip">
              <div className="flex items-center w-fit gap-4">
                <div className="relative">
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
                  <button className="absolute text-xl bg-red-500 p-1 text-white rounded-lg absolute top-3 right-3 hover:bg-red-600">
                    <MdDelete />
                  </button>
                </div>
                <div className="relative">
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
                  <button className="absolute text-xl bg-red-500 p-1 text-white rounded-lg absolute top-3 right-3 hover:bg-red-600">
                    <MdDelete />
                  </button>
                </div>
                <div className="relative">
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
                  <button className="absolute text-xl bg-red-500 p-1 text-white rounded-lg absolute top-3 right-3 hover:bg-red-600">
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 ml-5 sticky top-20 h-fit">
          <div className="flex flex-col gap-2">
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
              count={props.numberOfApplicants || 0}
              icon={<IoPeopleSharp className="text-3xl" />}
              className="bg-green-600 text-white w-fit gap-5"
            />
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
                    {props.jobData.numberOfVacancies} người
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
                    {mapJobTypeToVietnamese[props.jobData.jobType]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
