import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
import { IoSearch } from "react-icons/io5";
import { FaBriefcase } from "react-icons/fa6";
import { SlPeople } from "react-icons/sl";
import { BsBuildings } from "react-icons/bs";

const SearchForm = () => {
  return (
    <div className="flex justify-center bg-white w-fit rounded-xl mt-6 space-x-3 mx-auto h-15 overflow-x-hidden">
      <input
        placeholder="Mô tả ngắn công việc bạn muốn"
        className="w-100 focus:outline-0 border-r-2 border-gray-300 p-2"
      />
      <input
        placeholder="Địa điểm"
        className="focus:outline-0 border-r-2 border-gray-300 p-2"
      />
      <input placeholder="Loại công việc" className="focus:outline-0" />
      <button className="bg-[#1C229E] px-3 text-white flex items-center gap-1">
        <IoSearch />
        Tìm kiếm bằng AI
      </button>
    </div>
  );
};
export default function Banner() {
  const [chatInput, setChatInput] = useState("");
  const navigate = useNavigate();

  const handleChatButtonClick = () => {
    navigate("/chat", { state: { message: chatInput } });
  };

  return (
    <div className="banner relative place-content-baseline flex flex-col h-100 space-y-1">
      <div className="overlay" />
      <div className="py-10 z-10">
        <h1 className="text-4xl font-bold ml-8 text-white text-center raleway-bold">
          Tìm Kiếm Việc Làm Chỉ Trong Một Cú Nhấp Chuột!
        </h1>
        <p className="text-lg ml-8 text-center text-[rgba(255,255,255,0.8)] mt-4 raleway-normal">
          Tìm việc nhanh, gọn, phù hợp, không cần bằng cấp, CV với sự hỗ trợ của
          AI!
        </p>
        <SearchForm />
        <div className="flex justify-around w-[70%] mx-auto mt-10">
          <div className="flex gap-5 text-white">
            <div className="bg-[#1C229E] rounded-full flex justify-center items-center w-15 h-15">
              <FaBriefcase color="white" size={25} />
            </div>
            <div>
              <p className="raleway-bold text-xl">25,850</p>
              <p className="text-sm text-gray-300">Việc làm đa dạng</p>
            </div>
          </div>
          <div className="flex gap-5 text-white">
            <div className="bg-[#1C229E] rounded-full flex justify-center items-center w-15 h-15">
              <SlPeople color="white" size={25} />
            </div>
            <div>
              <p className="raleway-bold text-xl">25,850</p>
              <p className="text-sm text-gray-300">Việc làm đa dạng</p>
            </div>
          </div>
          <div className="flex gap-5 text-white">
            <div className="bg-[#1C229E] rounded-full flex justify-center items-center w-15 h-15">
              <BsBuildings color="white" size={25} />
            </div>
            <div>
              <p className="raleway-bold text-xl">25,850</p>
              <p className="text-sm text-gray-300">Việc làm đa dạng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
