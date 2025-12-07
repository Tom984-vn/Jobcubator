import { useNavigate } from "react-router-dom";
import { SlPeople } from "react-icons/sl";
import { PiReadCvLogoBold } from "react-icons/pi";
import { IoIosArrowRoundForward } from "react-icons/io";
import { GrDocumentTest } from "react-icons/gr";
import { FaRobot } from "react-icons/fa";

const Suggestion = (props) => {
  const navigate = useNavigate();
  return (
    <div
      className="
    flex w-[48%] gap-5 p-5 rounded-xl
    border-2 border-transparent
    transition-all duration-300 ease-out
    hover:border-[#E48309]
    hover:shadow-[0_0_15px_1px_#E48309]
    group
    items-center
  "
      style={{
        background: "linear-gradient(90deg, #e6e9f0 0%, #c9d6ff 100%)",
        transition: "background 0.7s ease, box-shadow 0.7s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(90deg, \
      #ffffff 0%, \
      #fff4e6 60%, \
      #ffd7a3 90%, \
      #E48309 120%)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(90deg, \
      #e6e9f0 0%, \
      #dfe3f7 60%, \
      #d0d8ff 90%, \
      #c9d6ff 120%)";
      }}
    >
      <div className="flex flex-col h-[100%] items-start justify-between w-[80%]">
        <div>
          <h2 className="raleway-bold text-2xl text-[#1C229E] group-hover:text-[#E48309]">
            {props.title}
          </h2>
          <p className="text-gray-500">{props.description}</p>
        </div>
        <button
          className="bg-[#1C229E] text-white p-2 mt-2 rounded-xl flex gap-2 items-center text-md hover:bg-[#E48309]"
          onClick={() => navigate(props.link)}
        >
          {props.buttonText}
          <IoIosArrowRoundForward size={25} />
        </button>
      </div>
      {props.image}
    </div>
  );
};
export default function Suggestions() {
  return (
    <div className="w-[85%] py-10 mx-auto">
      <h1 className="raleway-bold text-3xl text-[#1C229E]">
        Tạo resume và hồ sơ cá nhân!
      </h1>
      <div className="flex mt-10 justify-between">
        <Suggestion
          title="Điền thông tin cá nhân"
          description="Tạo hồ sơ cá nhân để nhà tuyển dụng dễ dàng tìm thấy bạn. Cung cấp thông tin chi tiết về kỹ năng và kinh nghiệm của bạn."
          buttonText="Tạo hồ sơ cá nhân"
          link="/profile"
          image={
            <SlPeople
              size={100}
              className="group-hover:text-[#E48309] text-[#1C229E]"
            />
          }
        />
        <Suggestion
          title="Tạo Resume chuyên nghiệp"
          description="Sử dụng công cụ tạo resume của chúng tôi để có một bản resume ấn tượng."
          buttonText="Tạo Resume"
          link="/resume-builder"
          image={
            <PiReadCvLogoBold
              size={100}
              className="group-hover:text-[#E48309] text-[#1C229E]"
            />
          }
        />
      </div>
      <h1 className="raleway-bold text-3xl text-[#1C229E] mt-10">
        Tìm hiểu công việc phù hợp với bạn!
      </h1>
      <div className="flex mt-10 justify-between">
        <Suggestion
          title="Bài trắc nghiệm tính cách"
          description="Khám phá công việc phù hợp với tính cách và sở thích của bạn thông qua bài trắc nghiệm chuyên sâu. Tìm hiểu thêm về bản thân và định hướng nghề nghiệp. "
          buttonText="Làm bài trắc nghiệm"
          link="/profile"
          image={
            <GrDocumentTest
              size={100}
              className="group-hover:text-[#E48309] text-[#1C229E]"
            />
          }
        />
        <Suggestion
          title="Học tập thông qua khóa học"
          description="Nâng cao kỹ năng và kiến thức của bạn với các khóa học chuyên sâu được thiết kế để giúp bạn phát triển nghề nghiệp, trò chuyện với AI để làm rõ định hướng học tập và công việc phù hợp."
          buttonText="Khóa học"
          link="/resume-builder"
          image={
            <FaRobot
              size={100}
              className="group-hover:text-[#E48309] text-[#1C229E]"
            />
          }
        />
      </div>
    </div>
  );
}
