import { IoSend } from "react-icons/io5";
import { FaPaperclip } from "react-icons/fa6";

export default function AskAI(props) {
  return (
    <div className="bg-white absolute z-10 w-[25%] h-[100%] right-0 top-0 border-l-2 border-primary-400 shadow-md">
      <div
        className={`flex items-center justify-center ${
          props.askData.length ? "h-[72%]" : "h-[80%]"
        }`}
      >
        <p className="raleway-bold text-gray-400">
          Trò chuyện với AI để tìm công việc bạn muốn!
        </p>
      </div>
      <div className="border-t-2 w-full border-primary-400">
        {props.askData && (
          <div className="flex">
            {props.askData.map((item) => {
              return (
                <div className="relative w-fit p-1 border rounded-lg border-gray-300 mt-2 mx-2 group">
                  <img src={item.logo} className="w-12" />

                  {/* Tooltip */}
                  <div
                    className="
    absolute left-1/2 -translate-x-1/2 -top-2 
    -translate-y-full 
    bg-black text-white text-xs rounded-md px-2 py-1 
    opacity-0 invisible 
    group-hover:opacity-100 group-hover:visible 
    group-hover:-translate-y-[110%]
    transition-all duration-200
    whitespace-nowrap
    pointer-events-none
  "
                  >
                    {item.jobname}
                  </div>

                  {/* Close button */}
                  <p
                    onClick={() => props.removeData(item)}
                    className="absolute top-1 right-1 bg-gray-300 rounded-full aspect-square w-4 flex items-center justify-center text-[10px] hover:bg-gray-400 cursor-pointer"
                  >
                    ✕
                  </p>
                </div>
              );
            })}
          </div>
        )}
        <textarea
          className="h-24 w-full focus:outline-0 pb-3 pl-2"
          placeholder="Hãy nhập mô tả công việc bạn muốn tìm, hay bất cứ câu hỏi nào"
        />
        <div className="absolute bottom-0 flex items-center justify-between w-full px-2 pb-2">
          <FaPaperclip
            size={33}
            className="hover:bg-gray-300 rounded-full p-2"
          />
          <button className="flex text-white bg-primary-400 rounded-full p-1 items-center px-4 gap-2 hover:bg-secondary-2-300">
            <IoSend />
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
