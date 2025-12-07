import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";
import { PiStudentBold } from "react-icons/pi";

export default function CallToAction() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f3f5f7] py-30">
      <div className="w-[85%] mx-auto grid grid-cols-2 gap-15">
        <div
          className="
    flex gap-5 p-5 rounded-xl
    transition-all duration-300 ease-out
    group
    items-center
    h-fit
  "
          style={{
            background: "linear-gradient(90deg, white 40%, #c9d6ff 120%)",
            transition: "background 0.7s ease, box-shadow 0.7s ease",
          }}
        >
          <div className="flex flex-col h-[100%] items-start justify-between w-[80%]">
            <div>
              <h2 className="raleway-bold text-2xl text-[#1C229E] ">
                Đăng ký trở thành ứng viên!
              </h2>
              <p className="text-gray-500">
                Hãy đăng kí trở thành ứng viên ngay hôm nay để được nhận sự trợ
                giúp nhiệt tình nhất!
              </p>
            </div>
            <button
              className="flex flex-row items-center gap-2 p-2 mt-2 rounded-xl bg-[#1C229E] text-white hover:bg-[#131873] hidden group-hover:flex"
              onClick={() => navigate("/signUp")}
            >
              <span>Đăng ký</span>
              <IoIosArrowRoundForward size={25} />
            </button>
          </div>
          <PiStudentBold size={120} color="#1C229E" />
        </div>
        <div
          className="
    flex gap-5 p-5 rounded-xl
    transition-all duration-300 ease-out
    group
    items-center
    h-fit
  "
          style={{
            background: "linear-gradient(90deg, white 40%, #E48309 150%)",
            transition: "background 0.7s ease, box-shadow 0.7s ease",
          }}
        >
          <div className="flex flex-col h-[100%] items-start justify-between w-[80%]">
            <div>
              <h2 className="raleway-bold text-2xl text-[#E48309] ">
                Đăng ký trở thành nhà tuyển dụng!
              </h2>
              <p className="text-gray-500">
                Hãy đăng kí trở thành ứng viên ngay hôm nay để được nhận sự trợ
                giúp nhiệt tình nhất!
              </p>
            </div>
            <button
              className="flex flex-row items-center gap-2 p-2 mt-2 rounded-xl bg-[#E48309] text-white hover:bg-[#c67109] hidden group-hover:flex"
              onClick={() => navigate("/signUp")}
            >
              <span>Đăng ký</span>
              <IoIosArrowRoundForward size={25} />
            </button>
          </div>
          <PiStudentBold size={120} color="#E48309" />
        </div>
      </div>
    </div>
  );
}
