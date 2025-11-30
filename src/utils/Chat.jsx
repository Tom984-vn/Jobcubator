export async function sendGeneralChatRequest(payload) {
  console.log("Sending payload:", payload);
  const response = await fetch("http://localhost:3000/api/v1/chat/general", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  // Unwrap nested text if necessary
  if (data.text && data.text.text) {
    return data.text.text; // fix nested object
  } else if (data.text) {
    return data.text;
  }
  return JSON.stringify(data); // fallback
}
export function buildGeneralChatPayload(text, userId, context = {}) {
  console.log("Building payload with userId:", userId);
  return {
    text,
    user_id: userId,
    context: {
      cv_industry: context.cv_industry ?? "",
      interested_industry: context.interested_industry ?? "",
      age_range: context.age_range ?? "",
      experience_level: context.experience_level ?? "",
      last_conversation_summary: context.last_conversation_summary ?? "",
    },
  };
}
import { useState } from "react";

export function useGeneralChat(userId) {
  const [streamingText, setStreamingText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function ask(text, context) {
    setStreamingText("");
    setIsLoading(true);
    text =
      text +
      `Đây là thông tin của tôi, làm hơn hãy ghi nhớ và recommend tôi thông tin công việc dựa vào đấy, nhớ không được nhắc lại rằng tôi đã đưa bạn nhé {
  "cv_text": "NGUYỄN VĂN A\nSoftware Engineer\nEmail: a.nguyen@email.com | SĐT: 0909123456\n\nKỸ NĂNG\n- Ngôn ngữ: Java, Python, JavaScript\n- Framework: Spring Boot, Django, ReactJS\n- Database: PostgreSQL, MongoDB\n- Công cụ: Git, Docker, Jenkins\n\nKINH NGHIỆM LÀM VIỆC\n1. Công ty ABC Tech (01/2022 - Hiện tại)\n   Vị trí: Backend Developer\n   - Phát triển hệ thống RESTful API sử dụng Java Spring Boot phục vụ hơn 10.000 user.\n   - Tối ưu hóa câu lệnh SQL giúp giảm thời gian phản hồi API xuống 30%.\n   - Triển khai quy trình CI/CD với Jenkins.\n\n2. Công ty XYZ Solutions (06/2020 - 12/2021)\n   Vị trí: Junior Developer\n   - Tham gia phát triển giao diện người dùng với ReactJS.\n   - Viết unit test và document kỹ thuật cho dự án.\n\nHỌC VẤN\n- Đại học Bách Khoa Hà Nội (2016 - 2020)\n- Chuyên ngành: Khoa học máy tính\n\nCHỨNG CHỈ\n- AWS Certified Developer - Associate",
  "user_id": "user_987654",
  "top_k": 3,
  "filters": {
    "selectedJobGroups": [
      "Software Development",
      "Backend Engineer",
      "IT Consultant"
    ],
    "selectedCities": [
      "Hanoi",
      "Ho Chi Minh City"
    ],
    "salaryRange": {
      "min": 15000000,
      "max": 40000000
    },
    "workType": "Hybrid"
  }
}`;
    const payload = buildGeneralChatPayload(text, "user_001", context);

    try {
      const finalResponse = await sendGeneralChatRequest(payload);
      setStreamingText(finalResponse); // just set the final string
      setIsLoading(false);
      return finalResponse;
    } catch (e) {
      console.error("Chat error:", e);
      setIsLoading(false);
    }
  }

  return { ask, streamingText, isLoading };
}
