import { NavLink } from "react-router-dom";
import { RxCaretRight } from "react-icons/rx";
import { BsBoxes } from "react-icons/bs";
import { FaRegCircle } from "react-icons/fa";
import { FaSuitcase } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";
import { HiPaintBrush } from "react-icons/hi2";
import { useState } from "react";
import Resume from "../../components/Resume/Resume";
const ResumeFilter = (props) => {
  return (
    <div
      className={
        "flex  raleway-bold p-2 rounded-full px-4 gap-2 shadow-lg hover:bg-secondary-2-300 hover:text-white cursor-pointer transition-all duration-200 items-center" +
        (props.selected
          ? " bg-secondary-2-300 text-white"
          : "bg-white text-black")
      }
      onClick={props.onClick}
    >
      {props.icon}
      <p>{props.content}</p>
    </div>
  );
};
export default function ResumeBuilder() {
  const [selectedFilter, setSelectedFilter] = useState("Tất cả");
  return (
    <div className="bg-gray-100 p-5">
      <div className="w-[85%] mx-auto">
        <div className="flex items-center gap-2 text-md text-gray-500 ">
          <NavLink className={"raleway-bold text-primary-400"} to={"/"}>
            Trang chủ
          </NavLink>
          <RxCaretRight className="text-xl" />
          <p>Mẫu CV</p>
        </div>
        <h1 className="text-3xl raleway-bold my-3">
          Khám phá các mẫu CV xin việc phù hợp với bạn!
        </h1>
        <p>
          Tuyển chọn từ các mẫu CV đa dạng, phong cách, và chuyên nghiệp để tạo
          dấu ấn cá nhân và kết nối mạnh mẽ hơn với nhà tuyển dụng.
        </p>
        <div className="flex mt-5 gap-3">
          <ResumeFilter
            content="Tất cả"
            icon={<BsBoxes size={20} />}
            selected={selectedFilter === "Tất cả"}
            onClick={() => setSelectedFilter("Tất cả")}
          />
          <ResumeFilter
            content="Đơn giản"
            icon={<FaRegCircle size={20} />}
            selected={selectedFilter === "Đơn giản"}
            onClick={() => setSelectedFilter("Đơn giản")}
          />
          <ResumeFilter
            content="Chuyên nghiệp"
            icon={<FaSuitcase size={20} />}
            selected={selectedFilter === "Chuyên nghiệp"}
            onClick={() => setSelectedFilter("Chuyên nghiệp")}
          />
          <ResumeFilter
            content="Hiện đại"
            icon={<RiRobot2Line size={20} />}
            selected={selectedFilter === "Hiện đại"}
            onClick={() => setSelectedFilter("Hiện đại")}
          />
          <ResumeFilter
            content="Sáng tạo"
            icon={<HiPaintBrush size={20} />}
            selected={selectedFilter === "Sáng tạo"}
            onClick={() => setSelectedFilter("Sáng tạo")}
          />
        </div>
        <div className="grid grid-cols-3 mt-5 gap-5">
          <Resume
            exampleImage={"/images/exampleCV.png"}
            name={"Tiêu chuẩn"}
            tags={["Chi tiết", "Đơn giản", "Tiêu chuẩn"]}
          />
          <Resume
            exampleImage={"/images/exampleCV.png"}
            name={"Tiêu chuẩn"}
            tags={["Chi tiết", "Đơn giản", "Tiêu chuẩn"]}
          />
          <Resume
            exampleImage={"/images/exampleCV.png"}
            name={"Tiêu chuẩn"}
            tags={["Chi tiết", "Đơn giản", "Tiêu chuẩn"]}
          />
          <Resume
            exampleImage={"/images/exampleCV.png"}
            name={"Tiêu chuẩn"}
            tags={["Chi tiết", "Đơn giản", "Tiêu chuẩn"]}
          />
          <Resume
            exampleImage={"/images/exampleCV.png"}
            name={"Tiêu chuẩn"}
            tags={["Chi tiết", "Đơn giản", "Tiêu chuẩn"]}
          />
          <Resume
            exampleImage={"/images/exampleCV.png"}
            name={"Tiêu chuẩn"}
            tags={["Chi tiết", "Đơn giản", "Tiêu chuẩn"]}
          />
        </div>
      </div>
    </div>
  );
}
