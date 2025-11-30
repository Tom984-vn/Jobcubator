const testData = {
  title:
    "Báo cáo tư vấn CV - Phù hợp nhất với Senior Data Scientist (Python/Hà Nội)",
  summary:
    "Nguyễn Văn A có 5 năm kinh nghiệm trong lĩnh vực AI, từng lãnh đạo đội xây dựng mô hình NLP và có bằng Thạc sĩ Khoa học Máy tính. Ứng viên phù hợp với công việc Senior Data Scientist tại Hà Nội với mức lương mong muốn trong khoảng 2000-3000 USD.",
  job_details: [
    {
      id: "job_001",
      title: "Không có tiêu đề",
      description:
        "Tiêu đề: Senior Data Scientist (Python/Hà Nội). Mô tả: Yêu cầu kinh nghiệm xây dựng và triển khai các mô hình học máy (Deep Learning) trong môi trường sản xuất. Đánh giá và tối ưu hóa hiệu suất mô hình liên tục. Chịu trách nhiệm về pipeline dữ liệu.. Yêu cầu: Chưa có. Quyền lợi: Lương 2500 - 3500 USD, làm việc hybrid, bảo hiểm sức khỏe cao cấp.",
      category: "Data & AI",
      location: "Hanoi",
      min_salary: 2500,
      job_type: "Full-time",
    },
    {
      id: "job_002",
      title: "Không có tiêu đề",
      description:
        "Tiêu đề: Backend Developer (Node.js/TypeScript) - TP.HCM. Mô tả: Thiết kế và phát triển các API hiệu suất cao cho ứng dụng di động và web. Duy trì và cải thiện kiến trúc microservices hiện có.. Yêu cầu: Chưa có. Quyền lợi: Môi trường trẻ trung, thưởng dự án, làm việc linh hoạt. Lương 1500 - 2000 USD.",
      category: "Web Development",
      location: "Ho Chi Minh",
      min_salary: 1500,
      job_type: "Full-time",
    },
  ],
  recommendations:
    "**Phân tích Điểm mạnh và Điểm yếu**\nĐiểm mạnh: Kinh nghiệm lãnh đạo, xây dựng mô hình NLP, và kiến thức về AI và Machine Learning. Điểm yếu: Thiếu kinh nghiệm trực tiếp với Python và các công nghệ liên quan đến Data Science. Cần bổ sung kỹ năng về Deep Learning và Scikit-learn để phù hợp với yêu cầu công việc.\n\n**Lời khuyên Phát triển Kỹ năng/Khóa học**\nNên tham gia các khóa học về Deep Learning, Scikit-learn, và Python để nâng cao kỹ năng. Ngoài ra, cần bổ sung kiến thức về SQL và các công nghệ dữ liệu khác để trở thành một Data Scientist toàn diện.\n\n**Chiến lược Ứng tuyển & Phỏng vấn**\nNên điều chỉnh CV để nhấn mạnh kinh nghiệm lãnh đạo và kỹ năng về AI, đồng thời chuẩn bị kỹ lưỡng về kiến thức Deep Learning và các công nghệ liên quan. Trong quá trình phỏng vấn, nên thể hiện khả năng học hỏi và thích nghi nhanh với các công nghệ mới.",
};
import { useNavigate } from "react-router-dom";
import { CiClock2 } from "react-icons/ci";
import { BsWallet2 } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { useState } from "react";
const Job = (props) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className="relative bg-white rounded-lg box-content p-4 shadow-lg 
                border-2 border-transparent 
                hover:border-[#E48309] w-fit
                transition-all duration-100 cursor-pointer group col-span-2"
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

function formatToHTML(inputText) {
  if (!inputText && inputText !== "") return "";

  // 1) Escape HTML to avoid XSS
  const escapeHtml = (str) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  let s = escapeHtml(String(inputText));

  // 2) Convert **bold** -> <strong>...</strong>
  // Use a non-greedy match and single-line modifier so '.' matches newlines inside the group if needed.
  // Note: If you prefer not to allow newlines inside bold, remove the 's' flag and adjust pattern.
  s = s.replace(/\*\*(.+?)\*\*/gs, "<strong>$1</strong>");

  // 3) Split into paragraphs on 2 or more newlines, convert single newline -> <br/>
  const paragraphs = s.split(/\n{2,}/).map((p) => p.replace(/\n/g, "<br/>"));

  // 4) Wrap paragraphs with <p>
  return paragraphs.map((p) => `<p>${p}</p>`).join("\n");
}
export default function JobSuggestions() {
  return (
    <div className="p-5 min-h-screen">
      <div className="w-[90%] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Tư vấn việc làm</h1>
        <p>
          Cùng tìm hiểu những việc làm và nhận xét mà Jobcubator dành cho bạn
        </p>
        <h1 className="text-xl raleway-bold my-4">{testData.title}</h1>
        <p className="mb-4">{testData.summary}</p>
        {formatToHTML(testData.recommendations) && (
          <div
            className="mb-6"
            dangerouslySetInnerHTML={{
              __html: formatToHTML(testData.recommendations),
            }}
          ></div>
        )}
        <h2 className="text-lg raleway-bold mb-4">Việc làm phù hợp</h2>
        <div className=" gap-4">
          {testData.job_details.map((job) => (
            <div className="grid grid-cols-6 mb-6 gap-4">
              <Job
                key={job.id}
                id={job.id}
                jobname={job.title}
                type={job.job_type}
                salaryMin={job.min_salary}
                location={job.location}
                company="Công ty ABC"
                logo="/images/exampleLogo.png"
                tags={["Hot"]}
              />
              <p className="raleway-bold text-xl">Giới thiệu</p>
              <p className="col-span-3">{job.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
