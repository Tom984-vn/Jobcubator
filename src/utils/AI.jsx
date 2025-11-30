/*POST
/api/v1/pipeline/consult
Tư vấn Job RAG chuyên sâu (JSON)

Endpoint thực hiện toàn bộ Pipeline RAG và trả về báo cáo JSON hoàn chỉnh.

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "cv_text": "string",
  "user_id": "string",
  "top_k": 3,
  "filters": {
    "selectedJobGroups": [],
    "selectedCities": [],
    "salaryRange": {
      "min": 0,
      "max": 0
    },
    "workType": "string"
  }
}*/
export const AIConsultation = async (userId) => {
  try {
    const response = await fetch(
      "https://api.jobcubator.com/api/v1/pipeline/consult",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          cv_text: "",
          user_id: userId,
          top_k: 3,
          filters: {
            selectedJobGroups: [],
            selectedCities: [],
            salaryRange: {
              min: 0,
              max: 0,
            },
            workType: "",
          },
        }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during AI consultation:", error);
    throw error;
  }
};
