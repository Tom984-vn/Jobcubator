import { IoMdCheckmark } from "react-icons/io";
import { useState } from "react";
export default function JobDisplay() {
  const [selectedFilter, setSelectedFilter] = useState("job");
  return (
    <div className="col-span-2">
      <div className="flex items-center gap-3 ">
        <p className="text-md raleway-bold mt-1">Tìm kiếm theo:</p>
        <button
          className={` ${
            selectedFilter == "job"
              ? "bg-white border border-secondary-2-300 text-secondary-2-300"
              : "bg-gray-300 hover:bg-gray-400"
          } px-3 p-1 rounded-full flex items-center gap-1 `}
          onClick={() => setSelectedFilter("job")}
        >
          {selectedFilter == "job" && <IoMdCheckmark />}Việc làm
        </button>
        <button
          className={` ${
            selectedFilter == "company"
              ? "bg-white border border-secondary-2-300 text-secondary-2-300"
              : "bg-gray-300 hover:bg-gray-400"
          } px-3 p-1 rounded-full flex items-center gap-1 `}
          onClick={() => setSelectedFilter("company")}
        >
          {selectedFilter == "company" && <IoMdCheckmark />}Công ty
        </button>
        <button
          className={` ${
            selectedFilter == "both"
              ? "bg-white border border-secondary-2-300 text-secondary-2-300"
              : "bg-gray-300 hover:bg-gray-400"
          } px-3 p-1 rounded-full flex items-center gap-1 `}
          onClick={() => setSelectedFilter("both")}
        >
          {selectedFilter == "both" && <IoMdCheckmark />}Cả hai
        </button>
      </div>
    </div>
  );
}
