import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import Role from "../../components/Course/Role";
const testJobGroups = [
  "Công nghệ thông tin",
  "Tiếp thị",
  "Bán hàng",
  "Thiết kế",
  "Hành chính - Văn phòng",
  "Dịch vụ khách hàng",
  "Kỹ thuật",
  "Tài chính - Kế toán",
];

function DifficultySelect() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-fit h-fit">
      <select
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
        className="text-sm font-bold appearance-none border flex border-gray-500 rounded-full p-1 pl-3 pr-6 hover:bg-blue-50 hover:border-primary-400 w-full focus:outline-0 cursor-pointer"
      >
        <option>Chọn độ khó</option>
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
function JobGroupFilter(props) {
  return (
    <p
      onClick={() => {
        props.select();
      }}
      className={
        "text-sm cursor-pointer hover:bg-blue-50 hover:text-primary-400 hover:border-primary-400 border border-gray-500 rounded-full px-2 py-1" +
        (props.selected
          ? " bg-blue-50 text-primary-400 border-primary-400 font-bold"
          : " bg-white text-gray-700")
      }
    >
      {props.name}
    </p>
  );
}

export default function FindByRole() {
  const [chosenJobGroup, setChosenJobGroup] = useState(null);
  return (
    <div className="w-[90%] mx-auto py-10 pt-5">
      <h1 className="text-2xl raleway-bold">Lộ Trình Học Theo Nghề</h1>
      <p>
        Tìm kiếm lộ trình học theo nghề bạn muốn theo đuổi, giúp bạn phát triển
        kỹ năng và đạt được mục tiêu nghề nghiệp.
      </p>
      <div className="flex items-center gap-1 mt-5">
        <DifficultySelect />
        <JobGroupFilter
          name="Tất cả"
          select={() => setChosenJobGroup(null)}
          selected={chosenJobGroup === null}
        />
        {testJobGroups.map((group) => (
          <JobGroupFilter
            key={group}
            name={group}
            select={() => setChosenJobGroup(group)}
            selected={chosenJobGroup === group}
          />
        ))}
      </div>
      <div className="grid grid-cols-4 mt-5 gap-5">
        <Role
          roleData={{
            banner: "/images/courseBanner.jpg",
            name: "Lập Trình Viên",
            description:
              "Trở thành lập trình viên chuyên nghiệp với các kỹ năng cần thiết để phát triển phần mềm.",
            tasks: ["Lập trình", "Phát triển phần mềm", "Kiểm thử"],
            courses: [
              {
                id: 1,
                logo: "/images/exampleLogo.png",
                name: "Khóa học Lập trình Cơ bản",
              },
              {
                id: 2,
                logo: "/images/exampleLogo.png",
                name: "Khóa học Lập trình Nâng cao",
              },
              {
                id: 3,
                logo: "/images/exampleLogo.png",
                name: "Khóa học Lập trình Chuyên sâu",
              },
            ],
          }}
        />
        <Role
          roleData={{
            banner: "/images/courseBanner.jpg",
            name: "Lập Trình Viên",
            description:
              "Trở thành lập trình viên chuyên nghiệp với các kỹ năng cần thiết để phát triển phần mềm.",
            tasks: ["Lập trình", "Phát triển phần mềm", "Kiểm thử"],
            courses: [
              {
                id: 1,
                logo: "/images/exampleLogo.png",
                name: "Khóa học Lập trình Cơ bản",
              },
              {
                id: 2,
                logo: "/images/exampleLogo.png",
                name: "Khóa học Lập trình Nâng cao",
              },
              {
                id: 3,
                logo: "/images/exampleLogo.png",
                name: "Khóa học Lập trình Chuyên sâu",
              },
            ],
          }}
        />
        <Role
          roleData={{
            banner: "/images/courseBanner.jpg",
            name: "Lập Trình Viên",
            description:
              "Trở thành lập trình viên chuyên nghiệp với các kỹ năng cần thiết để phát triển phần mềm.",
            tasks: ["Lập trình", "Phát triển phần mềm", "Kiểm thử"],
            courses: [
              {
                id: 1,
                logo: "/images/exampleLogo.png",
                name: "Khóa học Lập trình Cơ bản",
              },
              {
                id: 2,
                logo: "/images/exampleLogo.png",
                name: "Khóa học Lập trình Nâng cao",
              },
              {
                id: 3,
                logo: "/images/exampleLogo.png",
                name: "Khóa học Lập trình Chuyên sâu",
              },
            ],
          }}
        />
        <Role
          roleData={{
            banner: "/images/courseBanner.jpg",
            name: "Lập Trình Viên",
            description:
              "Trở thành lập trình viên chuyên nghiệp với các kỹ năng cần thiết để phát triển phần mềm.",
            tasks: ["Lập trình", "Phát triển phần mềm", "Kiểm thử"],
            courses: [
              {
                id: 1,
                logo: "/images/exampleLogo.png",
                name: "Khóa học Lập trình Cơ bản",
              },
              {
                id: 2,
                logo: "/images/exampleLogo.png",
                name: "Khóa học Lập trình Nâng cao",
              },
              {
                id: 3,
                logo: "/images/exampleLogo.png",
                name: "Khóa học Lập trình Chuyên sâu",
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
