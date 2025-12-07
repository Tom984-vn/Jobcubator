import { useState } from "react";
import { PiCaretLeft } from "react-icons/pi";
import { PiCaretRight } from "react-icons/pi";
import { FaComputer } from "react-icons/fa6";
import { BsFillMegaphoneFill } from "react-icons/bs";
import { GrPaint } from "react-icons/gr";
import { GiPriceTag } from "react-icons/gi";
import { MdPeopleAlt } from "react-icons/md";
import { BsBank2 } from "react-icons/bs";
import { FaCalculator } from "react-icons/fa6";
import { FaHeadphonesSimple } from "react-icons/fa6";

const Category = (props) => {
  return (
    <div
      className="flex flex-col items-center bg-[#f3f5f7] rounded-lg p-4 shadow-lg 
             transition-all duration-200 cursor-pointer
             hover:shadow-[0_0_5px_2px_#E48309] hover:bg-white"
    >
      {props.image}
      <h3 className="raleway-bold text-lg">{props.name}</h3>
      <p className="text-sm text-[#1C229E] raleway-bold">
        {props.jobCount} việc làm
      </p>
    </div>
  );
};
const iconClass = "my-6 text-[#1C229E] w-16 h-16";
const testCategories = [
  {
    image: <FaComputer className={iconClass} />,
    name: "Công nghệ thông tin",
    jobCount: 1250,
  },
  {
    image: <BsFillMegaphoneFill className={iconClass} />,
    name: "Marketing",
    jobCount: 980,
  },
  {
    image: <GrPaint className={iconClass} />,
    name: "Thiết kế",
    jobCount: 760,
  },
  {
    image: <GiPriceTag className={iconClass} />,
    name: "Bán hàng",
    jobCount: 640,
  },
  {
    image: <MdPeopleAlt className={iconClass} />,
    name: "Nhân sự",
    jobCount: 530,
  },
  {
    image: <BsBank2 className={iconClass} />,
    name: "Tài chính",
    jobCount: 410,
  },
  {
    image: <FaCalculator className={iconClass} />,
    name: "Kế toán",
    jobCount: 380,
  },
  {
    image: <FaHeadphonesSimple className={iconClass} />,
    name: "Chăm sóc khách hàng",
    jobCount: 290,
  },
];
export default function BrowseByCategory() {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = 3;
  return (
    <div className="bg-white py-10">
      <div className="w-[85%] mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="raleway-bold text-3xl text-[#1C229E]">
              Những ngành nghề nổi bật
            </h1>
            <p>Khám phá các công việc theo danh mục phổ biến dưới đây!</p>
          </div>
          <div className="flex gap-2 items-baseline">
            <button
              className={`${
                currentPage > 1
                  ? "text-[#E48309] rounded-full border-1 p-1 text-2xl hover:text-white hover:bg-[#E48309] transition-all duration-100"
                  : "text-gray-300 rounded-full border-1 p-1 text-2xl cursor-not-allowed"
              }`}
              onClick={() => {
                if (currentPage <= 1) return;
                setCurrentPage(currentPage - 1);
              }}
            >
              <PiCaretLeft />
            </button>
            <button
              className={`${
                currentPage < maxPage
                  ? "text-[#E48309] rounded-full border-1 p-1 text-2xl hover:text-white hover:bg-[#E48309] transition-all duration-100"
                  : "text-gray-300 rounded-full border-1 p-1 text-2xl cursor-not-allowed"
              }`}
              onClick={() => {
                if (currentPage >= maxPage) return;
                setCurrentPage(currentPage + 1);
              }}
            >
              <PiCaretRight />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6 mt-8">
          {testCategories.map((category) => {
            return (
              <Category
                image={category.image}
                name={category.name}
                jobCount={category.jobCount}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
