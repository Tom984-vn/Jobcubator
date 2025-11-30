import { FaPowerOff } from "react-icons/fa";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaBriefcase } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";
import { TbFileCv } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { getUserData } from "../../pages/Authentication/Authfunc";
import { useEffect } from "react";
import { useState } from "react";
export default function Sidebar() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const fetchData = async () => {
      const data = await getUserData(accessToken);
      setUserData(data);
    };
    fetchData();
  }, []);
  return (
    <div className="w-60 bg-primary-500 h-screen p-2 py-5 border-r text-white shrink-0 sticky top-14">
      <div className="flex items-center pb-4 gap-4 border-b border-secondary-2-100">
        <img
          src={"images/defaultAvatar.jpg"}
          alt="Logo"
          className="w-12 rounded-full"
        />
        <div>
          <h2 className="text-sm font-bold mb-1">
            {userData ? userData.fullName : "Tên người tuyển dụng"}
          </h2>
          <p className="text-sm text-gray-300">Nhà tuyển dụng</p>
        </div>
      </div>
      <ul className="space-y-3 mt-2">
        <label className="mt-6 text-gray-300 uppercase text-md">
          Tính năng
        </label>
        <NavLink
          to={"/employer"}
          end
          className={({ isActive }) => {
            return isActive
              ? "text-primary-400 cursor-pointer mt-2 flex items-center gap-2 bg-secondary-2-100 p-2 rounded-lg"
              : "hover:text-primary-400 bg-none text-white cursor-pointer mt-2 flex items-center gap-2 hover:bg-secondary-2-100 p-2 rounded-lg transition-colors duration-300";
          }}
        >
          <HiMiniSquares2X2 className="text-xl" /> Trang chủ
        </NavLink>
        <NavLink
          to="/employer/chat"
          className={({ isActive }) => {
            return isActive
              ? "text-primary-400 cursor-pointer mt-2 flex items-center gap-2 bg-secondary-2-100 p-2 rounded-lg"
              : "hover:text-primary-400 bg-none text-white cursor-pointer mt-2 flex items-center gap-2 hover:bg-secondary-2-100 p-2 rounded-lg transition-colors duration-300";
          }}
        >
          <IoChatbubbleEllipsesOutline className="text-xl" /> Tin nhắn
        </NavLink>
        <label className="mt-6 text-gray-300 uppercase text-md">
          Tuyển dụng
        </label>
        <NavLink
          to="/employer/jobs"
          className={({ isActive }) => {
            return isActive
              ? "text-primary-400 cursor-pointer mt-2 flex items-center gap-2 bg-secondary-2-100 p-2 rounded-lg"
              : "hover:text-primary-400 bg-none text-white cursor-pointer mt-2 flex items-center gap-2 hover:bg-secondary-2-100 p-2 rounded-lg transition-colors duration-300";
          }}
        >
          <FaBriefcase className="text-xl" /> Quản lý việc làm
        </NavLink>
        <NavLink
          to="/employer/applicants"
          className={({ isActive }) => {
            return isActive
              ? "text-primary-400 cursor-pointer mt-2 flex items-center gap-2 bg-secondary-2-100 p-2 rounded-lg"
              : "hover:text-primary-400 bg-none text-white cursor-pointer mt-2 flex items-center gap-2 hover:bg-secondary-2-100 p-2 rounded-lg transition-colors duration-300";
          }}
        >
          <IoPeople className="text-xl" /> Quản lí ứng viên
        </NavLink>
        <li className="hover:text-primary-400 cursor-pointer mt-2 flex items-center gap-2 hover:bg-secondary-2-100 p-2 rounded-lg transition-colors duration-300">
          <TbFileCv className="text-xl" /> Quản lí CV
        </li>
        <label className="mt-6 text-gray-300 uppercase text-md">Cài đặt</label>
        <li className="hover:text-primary-400 cursor-pointer mt-2 flex items-center gap-2 hover:bg-secondary-2-100 p-2 rounded-lg transition-colors duration-300">
          <IoSettings className="text-xl" /> Cài đặt chung
        </li>
      </ul>
      <button className="bg-red-500 text-white w-full p-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-800 mt-10 transition-colors duration-300">
        <FaPowerOff />
        Đăng xuất
      </button>
    </div>
  );
}
