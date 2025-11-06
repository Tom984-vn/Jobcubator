import React from "react";
import { Link } from "react-router-dom";
// import "./Sidebar.css";

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-primary-400 flex flex-col pt-16 z-50 transition-all duration-1000 ease-in-out ${isOpen ? "w-64" : "w-0 overflow-hidden"}
      `}
    >
      <button
        className="absolute top-2 right-4 text-white text-4xl bg-transparent border-neutral-400 cursor-pointer"
        onClick={toggleSidebar}
      >
        &times;
        {/* this is the "x" button*/}
      </button>
      <Link
        to="/profile"
        className={`py-4 px-6 text-xl text-white flex flex-row transition-all duration-1000 hover:bg-primary-200 ${isOpen ? "translate-x-0" : "-translate-x-64"}`}
        onClick={toggleSidebar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#ffffff"
          className="size-6 mr-2 fill-secondary-1-100 self-center transition-transform duration-1000 ease-in-out"
        >
          <path
            fillRule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="transition-all duration-1000 ease-in-out">
          Profile
        </span>
      </Link>
    </div>
  );
}

export default Sidebar;
