import Course from "../../components/Course/Course";
import { RiFilterFill } from "react-icons/ri";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";

function CourseFilter(props) {
  return (
    <p
      className={
        "font-medium text-sm cursor-pointer hover:bg-blue-50 hover:text-primary-400 hover:border-primary-400 border border-gray-500 rounded-full px-3 py-2"
      }
    >
      <RiFilterFill className="inline mb-1 mr-1" />
      Lọc và sắp xếp
    </p>
  );
}
function Select(props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-fit h-fit">
      <select
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
        className="text-sm font-bold appearance-none border flex border-gray-500 rounded-full p-1 pl-3 hover:bg-blue-50 hover:border-primary-400 w-fit focus:outline-0 cursor-pointer"
      >
        <option>{props.name}</option>
        <option>Mới bắt đầu</option>
        <option>Trung bình</option>
        <option>Nâng cao</option>
      </select>

      <FaChevronDown
        className={`
          pointer-events-none absolute right-1.5 top-4 -translate-y-1/2
          transition-transform duration-300 text-gray-500
          ${open ? "scale-y-[-1]" : "scale-y-[1]"}
        `}
        size={16}
      />
    </div>
  );
}

export default function Sponsored() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(16 / itemsPerPage);
  return (
    <div className="w-[90%] mx-auto pb-10 ">
      <h1 className="raleway-bold text-2xl">
        Các khóa học được tài trợ bởi công ty
      </h1>
      <p className="w-[75%]">
        Khám phá các khóa học được các công ty hàng đầu tài trợ để nâng cao kỹ
        năng và phát triển sự nghiệp của bạn. Hoàn thiện khóa học để có cơ hội
        được ứng tuyển vào các vị trí trong công ty!
      </p>
      <div className="flex items-center gap-3 mt-5">
        <div className="border-r pr-5 border-gray-400">
          <CourseFilter />
        </div>
        <Select name="Chủ đề" />
        <Select name="Thời lượng" />
        <Select name="Cấp độ" />
        <Select name="Đầu ra" />
      </div>
      <div className="grid grid-cols-4 gap-5 mt-5">
        <Course
          courseData={{
            name: "Lập Trình Viên Java Từ Cơ Bản Đến Nâng Cao",
            provider: "Udemy",
            providerLogo: "/images/exampleLogo.png",
            price: "499,000 VND",
            rating: 4.5,
            reviews: 1500,
            students: 1200,
            image: "/images/fullstackBanner.jpg",
            skills: ["Java", "Backend", "Spring"],
          }}
        />
        <Course
          courseData={{
            name: "Lập Trình Viên Java Từ Cơ Bản Đến Nâng Cao",
            provider: "Udemy",
            providerLogo: "/images/exampleLogo.png",
            price: "499,000 VND",
            rating: 4.5,
            reviews: 1500,
            students: 1200,
            image: "/images/fullstackBanner.jpg",
            skills: ["Java", "Backend", "Spring"],
          }}
        />
        <Course
          courseData={{
            name: "Lập Trình Viên Java Từ Cơ Bản Đến Nâng Cao",
            provider: "Udemy",
            providerLogo: "/images/exampleLogo.png",
            price: "499,000 VND",
            rating: 4.5,
            reviews: 1500,
            students: 1200,
            image: "/images/fullstackBanner.jpg",
            skills: ["Java", "Backend", "Spring"],
          }}
        />
        <Course
          courseData={{
            name: "Lập Trình Viên Java Từ Cơ Bản Đến Nâng Cao",
            provider: "Udemy",
            providerLogo: "/images/exampleLogo.png",
            price: "499,000 VND",
            rating: 4.5,
            reviews: 1500,
            students: 1200,
            image: "/images/fullstackBanner.jpg",
            skills: ["Java", "Backend", "Spring"],
          }}
        />
        <Course
          courseData={{
            name: "Lập Trình Viên Java Từ Cơ Bản Đến Nâng Cao",
            provider: "Udemy",
            providerLogo: "/images/exampleLogo.png",
            price: "499,000 VND",
            rating: 4.5,
            reviews: 1500,
            students: 1200,
            image: "/images/fullstackBanner.jpg",
            skills: ["Java", "Backend", "Spring"],
          }}
        />
        <Course
          courseData={{
            name: "Lập Trình Viên Java Từ Cơ Bản Đến Nâng Cao",
            provider: "Udemy",
            providerLogo: "/images/exampleLogo.png",
            price: "499,000 VND",
            rating: 4.5,
            reviews: 1500,
            students: 1200,
            image: "/images/fullstackBanner.jpg",
            skills: ["Java", "Backend", "Spring"],
          }}
        />
        <Course
          courseData={{
            name: "Lập Trình Viên Java Từ Cơ Bản Đến Nâng Cao",
            provider: "Udemy",
            providerLogo: "/images/exampleLogo.png",
            price: "499,000 VND",
            rating: 4.5,
            reviews: 1500,
            students: 1200,
            image: "/images/fullstackBanner.jpg",
            skills: ["Java", "Backend", "Spring"],
          }}
        />
        <Course
          courseData={{
            name: "Lập Trình Viên Java Từ Cơ Bản Đến Nâng Cao",
            provider: "Udemy",
            providerLogo: "/images/exampleLogo.png",
            price: "499,000 VND",
            rating: 4.5,
            reviews: 1500,
            students: 1200,
            image: "/images/fullstackBanner.jpg",
            skills: ["Java", "Backend", "Spring"],
          }}
        />
      </div>
      <div className="flex justify-center items-center gap-3 mt-10">
        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
          className={`px-4 py-2 rounded-full border border-gray-400 ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-200"
          }`}
        >
          <RxCaretLeft className="inline mb-1" />
        </button>
        <p className="font-bold">
          Trang {currentPage} trên {totalPages}
        </p>
        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
          className={`px-4 py-2 rounded-full border border-gray-400 ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-200"
          }`}
        >
          <RxCaretRight className="inline mb-1" />
        </button>
      </div>
    </div>
  );
}
