import MySvg from "../../assets/react.svg";
// import {
//   ChatBubbleLeftEllipsisIcon,
//   MagnifyingGlassIcon,
//   HomeIcon,
// } from "@heroicons/react";
import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function Homepage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <header className="bg-white p-4 flex items-center text-black">
      {/* <div className="btn">
        <img src={MySvg} alt="Icon" />
      </div>*/}
      <button className="btn " onClick={toggleSidebar}>
        <svg
          class="w-8 h-8"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="header-name text-xl font-bold ml-2">Jobcubator</div>
      <div className="grow"></div>

      <button className="btn bg-secondary-1-200 text-secondary-1-500 active:bg-secondary-1-500 active:text-secondary-1-200 py-2 px-4">
        Log in
      </button>

      <button className="btn bg-secondary-2-200 text-secondary-2-500 active:bg-secondary-2-500 active:text-secondary-2-200 py-2 px-4 ml-2">
        Sign up
      </button>
    </header>
  );
}
