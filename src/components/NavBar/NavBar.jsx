import { useEffect } from "react";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { getUserData } from "../../pages/Authentication/Authfunc";
import { useState } from "react";
export default function NavBar() {
  const accessToken = localStorage.getItem("accessToken");
  const [userData, setUserData] = useState(null);
  // useEffect(() => {
  //   console.log("Access Token:", accessToken);
  //   if (accessToken) {
  //     getUserData({ accessToken: accessToken }).then((data) => {
  //       console.log(data);
  //       setUserData(data);
  //     });
  //   }
  // }, [accessToken]);
  return (
    <header className="bg-white p-4 flex items-center text-primary-200 shadow-md sticky top-0 w-full z-100">
      <div className="header-name text-xl font-bold ml-2 flex items-center gap-0.5">
        <LuBriefcaseBusiness size={40} color="#1C229E" />
        Jobcubator
      </div>

      <div className="grow w-[50%] flex justify-center gap-6 text-lg">
        <NavLink
          to="/"
          className={({ isActive }) => {
            return isActive
              ? "font-bold underline underline-offset-10"
              : "text-gray-500 hover:text-primary-200 transition-all transition-duration-300";
          }}
        >
          Trang chủ
        </NavLink>
        <NavLink
          to="/jobs"
          className={({ isActive }) => {
            return isActive
              ? "font-bold underline underline-offset-10"
              : "text-gray-500 hover:text-primary-200 transition-all transition-duration-300";
          }}
        >
          Tìm việc
        </NavLink>
        <NavLink
          to="/jobs"
          className={({ isActive }) => {
            return isActive
              ? "font-bold underline underline-offset-10"
              : "text-gray-500 hover:text-primary-200 transition-all transition-duration-300";
          }}
        >
          Khóa học
        </NavLink>
        <NavLink
          to="/jobs"
          className={({ isActive }) => {
            return isActive
              ? "font-bold underline underline-offset-10"
              : "text-gray-500 hover:text-primary-200 transition-all transition-duration-300";
          }}
        >
          Tạo resume
        </NavLink>
        <NavLink
          to="/jobs"
          className={({ isActive }) => {
            return isActive
              ? "font-bold underline underline-offset-10"
              : "text-gray-500 hover:text-primary-200 transition-all transition-duration-300";
          }}
        >
          Về chúng tôi
        </NavLink>
      </div>
      <div>
        <Link to="/login">
          <button className="btn bg-gray-100 text-black outline outline-gray-300 active:text-primary-200 py-2 px-4">
            Đăng nhập
          </button>
        </Link>

        <Link to="/signup">
          <button className="btn bg-primary-300 text-white active:bg-primary-200 active:outline-primary-100 py-2 px-4 ml-3">
            Đăng ký
          </button>
        </Link>
      </div>
    </header>
  );
}
