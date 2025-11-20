import { useEffect } from "react";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { getUserData } from "../../pages/Authentication/Authfunc";
import { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaRegSave } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import { GoArrowRight } from "react-icons/go";
import { FaBriefcase } from "react-icons/fa";
import { BsBuildings } from "react-icons/bs";
import { PiRanking } from "react-icons/pi";

export default function NavBar() {
  const accessToken = localStorage.getItem("accessToken");
  const [userData, setUserData] = useState(null);
  const [jobDropdownOpen, setJobDropdownOpen] = useState(false);
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
        <div
          className="relative"
          onMouseLeave={() => {
            setJobDropdownOpen(false);
          }}
        >
          <NavLink
            to="/jobs"
            className={({ isActive }) => {
              return isActive
                ? "font-bold underline underline-offset-10 group"
                : "text-gray-500 hover:text-primary-200 transition-all transition-duration-300 group";
            }}
            onMouseEnter={() => {
              setJobDropdownOpen(true);
            }}
          >
            Tìm việc
            <FaAngleDown
              className="inline-block ml-1 group-hover:-scale-y-100 transition-all duration-300"
              size={12}
            />
          </NavLink>
          {jobDropdownOpen && (
            <div className="absolute">
              <div className=" mt-2 flex flex-col w-80 p-5 bg-white border border-gray-200 rounded-md shadow-lg">
                <h3 className="text-gray-500">Việc Làm</h3>
                <ul>
                  <NavLink
                    className={({ isActive }) => {
                      return isActive
                        ? "group py-2 raleway-bold text-primary-200 hover:bg-gray-100 cursor-pointer flex items-center rounded-lg px-2 my-2 justify-between"
                        : "group py-2 text-black hover:text-primary-200 hover:bg-gray-100 cursor-pointer flex items-center rounded-lg px-2 my-2 justify-between";
                    }}
                    to={"/jobs"}
                  >
                    <div className="flex items-center gap-2">
                      <FaMagnifyingGlass /> Tìm việc làm
                    </div>

                    <GoArrowRight className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </NavLink>
                  <li className="group py-2 text-black hover:text-primary-200 hover:bg-gray-100 cursor-pointer flex items-center rounded-lg px-2 my-2 justify-between">
                    <div className="flex items-center gap-2">
                      <FaRegSave /> Việc làm đã lưu
                    </div>

                    <GoArrowRight className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </li>
                  <li className="group py-2 text-black hover:text-primary-200 hover:bg-gray-100 cursor-pointer flex items-center rounded-lg px-2 my-2 justify-between">
                    <div className="flex items-center gap-2">
                      <IoNewspaperOutline /> Việc làm đã ứng tuyển
                    </div>
                    <GoArrowRight className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </li>
                  <li className="group py-2 text-black hover:text-primary-200 hover:bg-gray-100 cursor-pointer flex items-center rounded-lg px-2 my-2 justify-between">
                    <div className="flex items-center gap-2">
                      <FaBriefcase /> Việc làm phù hợp
                    </div>
                    <GoArrowRight className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </li>
                </ul>
                <h3 className="text-gray-500">Công ty</h3>
                <ul>
                  <li className="group py-2 text-black hover:text-primary-200 hover:bg-gray-100 cursor-pointer flex items-center rounded-lg px-2 my-2 justify-between">
                    <div className="flex items-center gap-2">
                      <BsBuildings /> Danh sách công ty
                    </div>
                    <GoArrowRight className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </li>
                  <li className="group py-2 text-black hover:text-primary-200 hover:bg-gray-100 cursor-pointer flex items-center rounded-lg px-2 my-2 justify-between">
                    <div className="flex items-center gap-2">
                      <PiRanking /> Xếp hạng công ty
                    </div>
                    <GoArrowRight className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <NavLink
          to="/courses"
          className={({ isActive }) => {
            return isActive
              ? "font-bold underline underline-offset-10"
              : "text-gray-500 hover:text-primary-200 transition-all transition-duration-300";
          }}
        >
          Khóa học
          <FaAngleDown className="inline-block ml-1" size={12} />
        </NavLink>
        <NavLink
          to="/resume-builder"
          className={({ isActive }) => {
            return isActive
              ? "font-bold underline underline-offset-10"
              : "text-gray-500 hover:text-primary-200 transition-all transition-duration-300";
          }}
        >
          Tạo resume
          <FaAngleDown className="inline-block ml-1" size={12} />
        </NavLink>
        <NavLink
          to="/about-us"
          className={({ isActive }) => {
            return isActive
              ? "font-bold underline underline-offset-10"
              : "text-gray-500 hover:text-primary-200 transition-all transition-duration-300";
          }}
        >
          Về chúng tôi
          <FaAngleDown className="inline-block ml-1" size={12} />
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
