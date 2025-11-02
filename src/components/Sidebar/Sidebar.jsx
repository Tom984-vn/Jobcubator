import React from "react";
import { Link } from "react-router-dom";
// import "./Sidebar.css";

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-primary-400 flex flex-col pt-16 z-50 transition-all duration-300 ease-in-out ${isOpen ? "w-64" : "w-0 overflow-hidden"}
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
        className="py-4 px-6 text-xl text-white block transition-colors duration-200 hover:bg-gray-500"
        onClick={toggleSidebar}
      >
        Profile
      </Link>
    </div>
  );
}

export default Sidebar;
