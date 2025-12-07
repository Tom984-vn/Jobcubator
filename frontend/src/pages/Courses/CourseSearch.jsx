import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { RxCaretDown } from "react-icons/rx";
import { BiSearchAlt2 } from "react-icons/bi";
import { RxCaretRight } from "react-icons/rx";
const testJobGroups = [
  "Công nghệ thông tin",
  "Tiếp thị",
  "Bán hàng",
  "Thiết kế",
  "Hành chính - Văn phòng",
  "Dịch vụ khách hàng",
  "Kỹ thuật",
  "Sản xuất",
  "Tài chính - Kế toán",
  "Nhân sự",
];

const JobsDropdown = (props) => {
  return (
    <div className="absolute top-[100%] left-0 bg-white shadow-lg rounded-md mt-2 p-4 pb-0 w-full z-20 w-200 max-h-120">
      <button
        onClick={() => {
          props.cancel();
        }}
        className="absolute text-sm right-2 top-2 rounded-full bg-gray-300 p-1 px-3 aspect-square hover:bg-gray-400"
      >
        X
      </button>
      <h2 className="raleway-bold">Chọn nhóm nghề, nghề và kĩ năng</h2>
      <div className="relative my-3">
        <input
          className="w-full rounded-full p-2 px-10 border border-gray-300 focus:outline-0 focus:border-secondary-2-300 focus:border-2"
          placeholder="Nhập từ khóa cần tìm kiếm"
        />
        <BiSearchAlt2 className="absolute top-3 left-4 text-gray-400" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className=" border-r border-gray-300 col-span-1 overflow-y-scroll max-h-70">
          <h2 className="text-gray-500">Nhóm ngành</h2>
          {testJobGroups.map((group) => (
            <p
              key={group}
              className="my-2 hover:text-secondary-2-300 cursor-pointer flex justify-between items-center"
            >
              <div className="flex gap-2">
                <input type="checkbox" />
                {group}
              </div>
              <RxCaretRight className="inline-block ml-2 text-xl" />
            </p>
          ))}
        </div>
        <div className="col-span-1 border-r border-gray-300">
          <h2 className="text-gray-500">Nghề</h2>
        </div>
        <div className="col-span-2">
          <h2 className="text-gray-500">Kĩ năng</h2>
        </div>
      </div>
      <div className="flex justify-end mt-4 border-t border-gray-300 py-3">
        <button
          onClick={() => {
            props.cancel();
          }}
          className="bg-gray-200 text-gray-700 px-8 py-2 rounded-full mr-4 hover:bg-gray-300"
        >
          Hủy
        </button>
        <button className="bg-secondary-2-300 text-white  py-2 rounded-full px-10 hover:bg-secondary-2-400">
          Chọn
        </button>
      </div>
    </div>
  );
};
export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  return (
    <div className="bg-primary-300 py-5 z-20 sticky top-0 w-full shadow-md">
      <div className="flex justify-center bg-white w-fit rounded-xl space-x-3 mx-auto h-12 relative">
        {open && (
          <JobsDropdown
            cancel={() => {
              setOpen(false);
            }}
          />
        )}
        <button
          onClick={() => {
            setOpen(!open);
          }}
          className="flex items-center gap-3 bg-gray-200 raleway-bold px-4 h-full rounded-l-2xl"
        >
          <FaList />
          Danh mục kĩ năng
          <RxCaretDown
            size={25}
            className={`${open && "-scale-y-100"} transition duration-300`}
          />
        </button>
        <div className="flex items-center">
          <IoSearch className="text-gray-500" />
          <input
            placeholder="Nhập khóa học muốn học hoặc những kỹ năng bạn muốn tìm hiểu"
            className="w-150 focus:outline-0 p-2"
          />
        </div>
        <button className="bg-secondary-2-300 px-3 text-white flex items-center gap-1 rounded-r-xl">
          <IoSearch />
          Tìm kiếm
        </button>
      </div>
    </div>
  );
}
