import { IoSend } from "react-icons/io5";

export default function AskAI() {
  return (
    <div className="bg-white absolute z-10 w-[25%] h-[100%] right-0 top-0 border-l-2 border-primary-400">
      <div className="flex items-center justify-center h-[80%]">
        <p className="raleway-bold text-gray-400">
          Trò chuyện với AI để tìm công việc bạn muốn!
        </p>
      </div>
      <div>
        <textarea
          className="border-t-2 w-full border-primary-400 p-3"
          placeholder="Hãy nhập mô tả công việc bạn muốn tìm, hay bất cứ câu hỏi nào"
        />
        <button className="flex text-white bg-primary-400 right-2 rounded-full absolute bottom-2 p-2 items-center px-5 gap-2 hover:bg-secondary-2-300">
          <IoSend />
          Gửi
        </button>
      </div>
    </div>
  );
}
