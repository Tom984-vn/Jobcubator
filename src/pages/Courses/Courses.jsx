import CourseSearch from "./CourseSearch.jsx";
import FindByRole from "./FindByRole.jsx";
import Sponsored from "./Sponsored.jsx";
import Trending from "./Trending.jsx";
import { NavLink } from "react-router-dom";
import { RxCaretRight } from "react-icons/rx";
export default function Courses() {
  return (
    <div className="bg-gray-100">
      <CourseSearch />
      <div className="flex items-center gap-2 text-md text-gray-500 mt-4 w-[90%] mx-auto">
        <NavLink className={"raleway-bold text-primary-400"} to={"/"}>
          Trang chủ
        </NavLink>
        <RxCaretRight className="text-xl" />
        <p>Khóa học</p>
      </div>

      <FindByRole />
      <Trending />
      <Sponsored />
    </div>
  );
}
