import { LuBriefcaseBusiness } from "react-icons/lu";
import { FaBell } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { TbFileCv } from "react-icons/tb";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
export default function TopBar() {
  const navigate = useNavigate();
  return (
    <div className="bg-secondary-2-100 p-2 pr-5 flex justify-between items-center sticky top-0 z-10">
      <div className="header-name text-xl font-bold ml-2 flex items-center gap-0.5 text-primary-300">
        <LuBriefcaseBusiness size={40} color="#1C229E" />
        Jobcubator
      </div>
      <div className="flex flex-row-reverse gap-2">
        <button className="bg-primary-400  rounded-full p-2 hover:bg-primary-200 transition-colors duration-300">
          <FaBell size={20} className="text-white" />
        </button>
        <button className="bg-primary-400 flex items-center px-4 gap-1 text-white  rounded-full p-2 hover:bg-primary-200 transition-colors duration-300">
          <IoChatbubbleEllipsesOutline size={20} className="text-white" />
          Tin nhắn
        </button>
        <button className="bg-primary-400 flex items-center px-4 gap-1 text-white  rounded-full p-2 hover:bg-primary-200 transition-colors duration-300">
          <TbFileCv size={20} className="text-white" />
          Tìm CV
        </button>
        <button
          onClick={() => {
            navigate("/employer/jobs/add");
          }}
          className="bg-primary-400 flex items-center px-4 gap-1 text-white  rounded-full p-2 hover:bg-primary-200 transition-colors duration-300"
        >
          <FaPencil size={20} className="text-white" />
          Đăng tin
        </button>
      </div>
    </div>
  );
}
