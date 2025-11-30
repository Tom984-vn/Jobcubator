import NavBar from "../../components/NavBar/NavBar";
import {
  IoSearch,
  IoMail,
  IoBriefcase,
  IoPeople,
  IoNewspaper,
} from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { HiDotsVertical } from "react-icons/hi";
import "../Home/Homepage.css";

function BigBox({ className = "", ...props }) {
  return (
    <div
      className={`
        big-block
        flex
        items-center
        gap-2
        bg-blue-300
        h-28
        w-[25%]
        px-4
        shadow-lg
        rounded-lg
        ${className}
        `}
    >
      {props.icon}
      <div
        className="
        big-box-texts
        "
      >
        <p className="text-3xl">{props.showNumber}</p>
        <p className="">{props.showText}</p>
      </div>
    </div>
  );
}

function OnePost(props) {
  return (
    <div
      className="
      flex
      place-content-between
      items-center
      cursor-pointer
      bg-blue-200
      h-20
      rounded-lg
      gap-2
      py-2
      px-4
      "
    >
      {props.icon}
      <div
        className="
        main-texts
        flex-1
        "
      >
        <p
          className="
          post-text
          text-lg
          "
        >
          {props.postText}
        </p>
        {props.position && (
          <p className="text-sm self-end">Vị trí: {props.position}</p>
        )}
      </div>
      {props.timeStamp && (
        <p className="text-sm self-end">{props.timeStamp} phút trước</p>
      )}
    </div>
  );
}

export default function CompanyProfile(props) {
  const jobPosts = [
    {
      id: 1,
      icon: <FcGoogle className="size-12" />,
      postText: "CEO",
      timeStamp: "9",
    },
    {
      id: 2,
      icon: <FcGoogle className="size-12" />,
      postText: "Software Engineer",
      timeStamp: "5",
    },
    {
      id: 3,
      icon: <FcGoogle className="size-12" />,
      postText: "Manager",
      timeStamp: "13",
    },
  ];

  const candidates = [
    {
      id: 1,
      icon: <IoPeople className="size-12" />,
      postText: "Jan",
      position: "Specialist",
    },
    {
      id: 2,
      icon: <IoPeople className="size-12" />,
      postText: "Alice",
      position: "UX",
    },
  ];
  return (
    <div
      className="
      relative
      w-full
      bg-gray-100
      items-center
      pt-8
      "
    >
      <div
        className="
        search-box
        flex
        
        mx-auto
        rounded-lg
        "
      >
        <div
          className="
          categories-box
          h-16
          w-[30%]
          bg-primary-300
          rounded-l-lg
          text-center
          content-center
          text-white
          raleway-bold
          "
        >
          Lọc ứng viên
        </div>
        <div
          className="
          categories-box
          flex
          place-content-between
          items-center
          h-16
          w-[70%]
          px-8
          bg-white
          text-black
          raleway-bold
          rounded-r-lg
          "
        >
          <input placeholder="Tìm kiếm..." className="focus:outline-0"></input>
          <IoSearch />
        </div>
      </div>
      <div
        className="
          entire-dash
          flex
          flex-col
          place-content-between
          w-[85%]
          gap-4
          mx-auto
          py-10
          raleway-bold
          "
      >
        <p className="text-3xl">Tổng hợp</p>
        <div
          className="
            big-boxes-container
            flex
            place-content-between
            gap-4
          "
        >
          {/* Nhờ place content between
          chỉ cần chỉnh cỡ mặc định của BigBox*/}
          <BigBox
            className="
            bg-complement-100
            "
            showNumber="8"
            icon=<IoMail className="size-18" />
            showText="Tin nhắn"
          ></BigBox>
          <BigBox
            className="
            bg-primary-300
            text-white
            "
            showNumber="1"
            icon=<IoBriefcase className="size-18" />
            showText="Công việc"
          ></BigBox>
          <BigBox
            className="
            bg-green-500
            text-white
            "
            showNumber="8"
            icon=<IoPeople className="size-18" />
            showText="Ứng viên"
          ></BigBox>
          <BigBox
            className="
            bg-black!
            text-white
            "
            showNumber="8"
            icon=<IoNewspaper className="size-18" />
            showText="Hồ sơ"
          ></BigBox>
        </div>

        <div
          className="
          2-info-cols-container
          flex
          mt-2
          mx-6
          gap-6
          "
        >
          <div
            className="
              first-info-col
              flex
              flex-col
              gap-16
              px-4
              py-6
              bg-white
              w-[50%]
              rounded-lg
              shadow-lg
              "
          >
            <div
              className="
              posted-jobs-area
              flex
              flex-col
              gap-2
              "
            >
              <div
                className="
                headering
                flex
                place-content-between
                px-4
                items-center
                "
              >
                <p className="text-lg ">Việc đã đăng</p>
                <HiDotsVertical
                  className="
                size-10
                cursor-pointer
                rounded-full
                hover:bg-gray-200
                p-2
                "
                />
              </div>
              {jobPosts.map((post) => (
                <OnePost
                  key={post.id}
                  icon={post.icon}
                  postText={post.postText}
                  timeStamp={post.timeStamp}
                />
              ))}
            </div>
            <div
              className="
              candidates-area
              flex
              flex-col
              gap-2
              "
            >
              <div
                className="
                  headering
                  flex
                  place-content-between
                  px-4
                  items-center
                  "
              >
                <p className="text-lg ">Ứng viên</p>
                <HiDotsVertical
                  className="
                size-10
                cursor-pointer
                rounded-full
                hover:bg-gray-200
                p-2
                "
                />
              </div>
              {candidates.map((post) => (
                <OnePost
                  key={post.id}
                  icon={post.icon}
                  postText={post.postText}
                  position={post.position}
                />
              ))}
            </div>
          </div>
          <div
            className="
              second-info-col
              flex
              flex-col
              gap-4
              w-[50%]
              rounded-lg
              "
          >
            <div
              className="
              employees-box
              flex
              flex-col
              gap-2
              bg-white
              px-4
              py-6
              rounded-lg
              shadow-lg
              "
            >
              <div
                className="
                headering
                flex
                place-content-between
                px-4
                items-center
                "
              >
                <p className="text-lg">Nhân viên</p>
                <HiDotsVertical
                  className="
                self-center
                size-10
                cursor-pointer
                rounded-full
                hover:bg-gray-200
                p-2
                "
                />
              </div>
              <OnePost
                icon=<IoPeople
                  className="
                  size-12
                  "
                />
                postText="Collier"
                position="Specialist Software"
              />
            </div>
            <div
              className="
              courses-box
              flex
              flex-col
              gap-2
              bg-white
              px-4
              py-6
              rounded-lg
              shadow-lg
              "
            >
              <div
                className="
                headering
                flex
                place-content-between
                px-4
                items-center
                "
              >
                <p className="text-lg">Khóa học</p>
                <HiDotsVertical
                  className="
                size-10
                cursor-pointer
                rounded-full
                hover:bg-gray-200
                p-2
                "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// Mã số thuế
// Các công việc mở
//  - Thời gian
//  - Mức lương
