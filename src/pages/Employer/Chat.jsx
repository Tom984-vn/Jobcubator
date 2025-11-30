import { useLocation } from "react-router-dom";
import {
  IoChatbox,
  IoChevronForward,
  IoPeople,
  IoSearch,
} from "react-icons/io5";
import "../Home/Homepage.css";
import { useState } from "react";

function PeerChatBubble(props) {
  return (
    <div
      className="
      flex
      flex-col
      p-2
      rounded-md
      bg-white
      border
      border-primary-300
      shadow-sm
      max-w-[60%]
      w-fit
      ml-0.5
      mb-2
      "
    >
      <p
        className="
        text-md
        text-gray-700
        "
      >
        {props.messageContent}
      </p>
      <p
        className="
        text-sm
        text-gray-400
        self-end
        "
      >
        {props.sentHour}:{props.sentMinute}
      </p>
    </div>
  );
}

function UserChatBubble(props) {
  return (
    <div
      className="
      flex
      flex-col
      p-2
      rounded-md
      border
      border-primary-500
      bg-primary-100
      shadow-sm
      max-w-[60%]
      w-fit
      ml-auto
      mb-2
      justify-end
      "
    >
      <p
        className="
        text-md
        text-white
        "
      >
        {props.messageContent}
      </p>
      <p
        className="
        text-sm
        text-gray-400
        self-end
        "
      >
        {props.sentHour}:{props.sentMinute}
      </p>
    </div>
  );
}

function CandidateButton(props) {
  return (
    <div
      className={`
        flex
        rounded-md
        border
        border-primary-300
        hover:shadow-md
        p-4
        gap-2
        cursor-pointer
        transition-all
        ease-in-out
        ${props.isSelected ? "bg-primary-300 text-white " : "bg-white"}
      `}
      onClick={props.onClick}
    >
      {props.icon}
      <div
        className="
        texts
        raleway-bold
        flex
        flex-col
        flex-1
        "
      >
        <p
          className="
            text-md
            "
        >
          {props.candidateName}
        </p>
        <p
          className="
            text-sm
            "
        >
          Vị trí: {props.position}
        </p>
      </div>
      {props.isSelected && <IoChevronForward className="self-center end-0" />}
    </div>
  );
}

export default function ChatPage(props) {
  const location = useLocation();
  const [selectedCandidateId, setSelectedCandidateId] = useState(1);
  const [messageInput, setMessageInput] = useState("");

  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleSendMessage = () => {
    console.log("Sending message: ", messageInput);
    setMessageInput("");
    const textarea = document.querySelector(".chat-input-area textarea");
    if (textarea) {
      textarea.style.height = "48px";
    }
  };

  const currentPeerName = "Nguyễn Văn A";
  const currentPeerPosition = "Nhân sự";
  const candidates = [
    {
      id: 1,
      icon: <IoPeople className="size-12" />,
      candidateName: "Nguyễn Văn A",
      position: "Nhân sự",
    },
    {
      id: 2,
      icon: <IoPeople className="size-12" />,
      candidateName: "Jan",
      position: "CEO",
    },
  ];

  const handleCandidateClick = (id) => {
    setSelectedCandidateId(id);
  };

  return (
    <div
      className="
      whole-page
      min-h-screen
      bg-gray-100
      "
    >
      <div
        className="
        contains-three-sections
        flex
        divide-x
        divide-slate-300
        min-h-screen
        "
      >
        <div
          className="
            first-sect-candidates-messaging
            flex
            flex-col
            p-4
            w-[25%]
            gap-4
            "
        >
          <div
            className="
                search-bar
                flex
                items-center
                rounded-full
                border
                border-slate-200
                bg-white
                gap-4
                h-10
                px-4
                hover:drop-shadow-sm
                transition-all
                "
          >
            <IoSearch className="size-6" />
            <input
              className="
              focus:outline-0
              "
              placeholder="Tìm kiếm ứng viên..."
            ></input>
          </div>
          <div
            className="
            buttons-container
            flex
            gap-2
            "
          >
            <button
              className="
                bg-white
                text-primary-300
                border-2
                border-primary-300
                rounded-full
                px-4
                py-2
                hover:bg-[#E48309]
                hover:border-[#E48309]
                hover:text-white
                transition-all
                duration-100
                "
            >
              Tất cả
            </button>
            <button
              className="
                bg-white
                text-primary-300
                border-2
                border-primary-300
                rounded-full
                px-4
                py-2
                hover:bg-[#E48309]
                hover:border-[#E48309]
                hover:text-white
                transition-all
                duration-100
                "
            >
              Chưa đọc
            </button>
          </div>
          {candidates.map((candidate) => (
            <CandidateButton
              key={candidate.id}
              icon={candidate.icon}
              candidateName={candidate.candidateName}
              position={candidate.position}
              isSelected={selectedCandidateId === candidate.id}
              onClick={() => handleCandidateClick(candidate.id)}
            />
          ))}
        </div>
        <div
          className="
          second-sect-messages
          flex
          flex-col
          w-[50%]
          p-4
          "
        >
          <p>{currentPeerName}</p>
          {currentPeerPosition && (
            <p className="text-sm text-slate-500">
              Vị trí ứng tuyển: {currentPeerPosition}
            </p>
          )}
          <div
            className="
            just-a-horizontal-divider
            my-4
            mx-0.5
            h-px
            w-full
            bg-slate-400
            "
          ></div>
          <div
            className="
            messages-container
            flex-1
            "
          >
            <PeerChatBubble
              messageContent="Tin nhắn từ bên kia 1"
              sentHour="19"
              sentMinute="25"
            />
            <PeerChatBubble
              messageContent="Tin nhắn bên kia very long abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz "
              sentHour="19"
              sentMinute="25"
            />
            <UserChatBubble
              messageContent="Tin nhắn từ bên mình 1"
              sentHour="19"
              sentMinute="25"
            />
          </div>
          <div
            className="
            chat-input-area
            flex
            items-center
            rounded-full
            border
            border-slate-300
            h-fit
            min-h-20
            px-8
            py-2
            hover:drop-shadow-sm
            transition-all
            ease-in-out
            gap-2
            "
          >
            <IoChatbox className="size-8" />
            <textarea
              className="
                flex-1
                py-2
                focus:outline-0
                resize-none
                min-h-12
                max-h-20
                bg-yellow-400
                hover:shadow-none!
                "
              placeholder="Nhập tin nhắn..."
              rows={1}
              value={messageInput}
              onChange={handleMessageInputChange}
            ></textarea>
            <button
              className="
              bg-white
              text-primary-300
              rounded-full
              border
              border-primary-300
              px-4
              py-2
              hover:bg-secondary-2-300
              hover:text-white
              hover:border-secondary-2-300
              transition-all
              duration-100
              cursor-pointer
              "
              onClick={handleSendMessage}
            >
              Gửi
            </button>
          </div>
        </div>
        <div
          className="
          last-sect
          w-[25%]
          "
        ></div>
      </div>
    </div>
  );
}
