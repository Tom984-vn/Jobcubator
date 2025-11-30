import { useState, useRef, useEffect } from "react";
import { IoChatbubble } from "react-icons/io5";
import { useGeneralChat } from "../../utils/Chat";
import { getUserData } from "../../pages/Authentication/Authfunc";

export default function GeneralChat() {
  const [userId, setUserId] = useState("");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);

  const [messages, setMessages] = useState([]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const fetchData = async () => {
      const userData = await getUserData(accessToken);
      setUserId(userData.userId);
    };
    fetchData();
  }, []);

  const { ask, isLoading } = useGeneralChat(userId);

  const onSend = async () => {
    if (!input.trim()) return;

    // Add user's message
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    scrollToBottom();

    // Store input and clear field
    const userInput = input;
    setInput("");

    // Ask backend for response
    const botReply = await ask(userInput, {
      cv_industry: "",
      interested_industry: "",
      age_range: "",
      experience_level: "",
      last_conversation_summary: "",
    });

    // Add bot's response
    setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    scrollToBottom();
  };

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <IoChatbubble className="text-xl" />
      </button>

      {open && (
        <div className="z-50 fixed bottom-20 right-6 w-80 h-96 bg-white shadow-xl rounded-lg border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-3 bg-blue-600 text-white font-semibold flex justify-between items-center">
            <span>AI hỗ trợ tìm việc</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white text-xl"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 p-2 rounded-lg max-w-[75%] ${
                  msg.from === "user"
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-gray-200 text-gray-700"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 border-t bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 p-2 border rounded text-sm"
              disabled={isLoading}
            />
            <button
              onClick={onSend}
              className="px-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isLoading}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
