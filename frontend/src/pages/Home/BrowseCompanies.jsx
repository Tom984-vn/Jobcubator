import { IoBriefcaseOutline } from "react-icons/io5";
import { useState } from "react";
import { PiCaretLeft } from "react-icons/pi";
import { PiCaretRight } from "react-icons/pi";
import { useEffect } from "react";
import { fetchTopCompanies } from "../../utils/Company";
const Company = (props) => {
  return (
    <div
      className="p-4 rounded-lg shadow-md hover:border-2 hover:border-[#E48309] transition-all duration-50 box-border cursor-pointer"
      style={{
        background: "radial-gradient(circle, #ffffff 60%, #E4830933 100%)",
      }}
    >
      <div className="flex gap-5 items-start">
        <img
          src={props.logo}
          alt={props.name}
          className="w-20 h-20 object-contain rounded-lg border-1 border-gray-300 "
        />
        <div>
          <h3 className="raleway-bold text-lg mt-2 text-[#1C229E]">
            {props.name}
          </h3>
          <p className="text-sm text-gray-500">{props.industry}</p>
        </div>
      </div>
      <p className="flex items-center gap-2 mt-2 raleway-bold text-[#1C229E]">
        <IoBriefcaseOutline /> {props.jobCount} việc làm
      </p>
    </div>
  );
};
const searchTags = [
  "Tất cả",
  "Công nghệ thông tin",
  "Marketing",
  "Thiết kế",
  "Bán hàng",
];
export default function BrowseCompanies() {
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPage, setCompaniesPage] = useState([]);
  const [currentCompaniesPage, setCurrentCompaniesPage] = useState(1);
  const [animationDirection, setAnimationDirection] = useState("");
  const maxPage = 1;
  const maxCompaniesPage = Math.ceil(companiesPage.length / 9);

  useEffect(() => {
    const fetchTopCompaniesData = async () => {
      try {
        const data = await fetchTopCompanies({
          page: currentCompaniesPage - 1,
          size: 9,
        });
        console.log(data.content);
        setCompaniesPage(data.content);
      } catch (error) {
        console.error("Error fetching top companies:", error);
      }
    };
    fetchTopCompaniesData();
  }, [currentCompaniesPage]);

  return (
    <div className="bg-[#f3f5f7] py-10">
      <div className="w-[85%] mx-auto">
        <h1 className="raleway-bold text-3xl text-[#1C229E]">
          Các Công Ty Hàng Đầu
        </h1>
        <p>Khám phá các công ty hàng đầu đang tuyển dụng ngay hôm nay!</p>

        {/* TOP FILTER + PAGINATION */}
        <div className="flex justify-between items-center mt-4 mb-6">
          <div>
            {searchTags.map((tag) => (
              <button
                key={tag}
                className="bg-white text-[#1C229E] border-2 border-[#1C229E] rounded-full px-4 py-2 mr-2 mt-4 hover:bg-[#E48309] hover:border-[#E48309] hover:text-white transition-all duration-100"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-baseline ">
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

        {/* COMPANIES SECTION */}
        <div className="relative">
          {/* LEFT ARROW */}
          <button
            className={`${
              currentCompaniesPage > 1
                ? "text-[#E48309] rounded-full border-1 p-1 hover:text-white hover:bg-[#E48309] transition-all duration-100"
                : "hidden"
            } absolute -left-15 text-4xl top-[50%]`}
            onClick={() => {
              if (currentCompaniesPage === 1) return;
              setAnimationDirection("left");
              setCurrentCompaniesPage((prev) => prev - 1);
            }}
          >
            <PiCaretLeft />
          </button>

          {/* VIEWPORT (MASK) */}
          <div className="overflow-hidden my-10 bg-white p-6 rounded-lg">
            {/* SLIDING CONTENT */}
            <div
              className={`
                grid grid-cols-3 grid-rows-3 gap-6 relative transition-transform duration-800 ease-in-out
                ${animationDirection === "left" ? "-translate-x-[120%]" : ""}
                ${animationDirection === "right" ? "translate-x-[120%]" : ""}
              `}
              onTransitionEnd={() => setAnimationDirection("")}
            >
              {companiesPage.map((company, index) => (
                <Company
                  key={index}
                  logo={"/images/exampleLogo.png"}
                  name={company.name}
                  industry={"Công nghệ thông tin"}
                  jobCount={company.totalVacancies}
                />
              ))}
            </div>
          </div>

          {/* RIGHT ARROW */}
          <button
            className={`${
              currentCompaniesPage < maxCompaniesPage
                ? "text-[#E48309] rounded-full border-1 p-1 hover:text-white hover:bg-[#E48309] transition-all duration-100"
                : "hidden"
            } absolute -right-15 text-4xl top-[50%]`}
            onClick={() => {
              if (currentCompaniesPage >= maxCompaniesPage) return;
              setAnimationDirection("right");
              setCurrentCompaniesPage((prev) => prev + 1);
            }}
          >
            <PiCaretRight />
          </button>
        </div>
      </div>
    </div>
  );
}
