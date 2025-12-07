import { TbFileCv } from "react-icons/tb";
import { FaUndo } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";

export default function ResumeInteractions(props) {
  return (
    <div className=" flex justify-between border-y border-gray-300 bg-blue-50 p-2 px-8 sticky top-0 z-50">
      <div className="flex items-center text-xl raleway-bold gap-4">
        <TbFileCv size={30} className="text-secondary-2-300" />
        <input
          value={props.resumeName}
          type="text"
          placeholder="CV chưa đặt tên"
          className="px-2 focus:outline-0 focus:border-2 focus:border-primary-400 rounded-md w-100 h-10"
        />
      </div>
      <div className="flex items-center">
        <FaUndo
          size={20}
          className="inline-block mr-2 cursor-pointer text-gray-300"
        />
        <FaRedo
          size={20}
          className="inline-block cursor-pointer text-gray-300"
        />
        <button className="bg-primary-400 hover:bg-secondary-2-300 rounded-full p-2 pr-4 text-white cursor-pointer ml-4 flex gap-2 items-center">
          <IoIosSave size={20} className="inline-block ml-2 cursor-pointer" />
          Lưu CV
        </button>
      </div>
    </div>
  );
}
