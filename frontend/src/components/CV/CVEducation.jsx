import CVTextInput from "./CVTextinput";
function EducationForm({ data, index, updateItem }) {
  return (
    <div className="border-t-10 border-primary-400 pt-5">
      <CVTextInput
        label="Tên trường học"
        value={data.schoolName || ""}
        onChange={(e) =>
          updateItem(index, { ...data, schoolName: e.target.value })
        }
      />

      <CVTextInput
        label="Chuyên ngành"
        value={data.major || ""}
        onChange={(e) => updateItem(index, { ...data, major: e.target.value })}
      />

      <CVTextInput
        label="Bằng cấp"
        value={data.degree || ""}
        onChange={(e) => updateItem(index, { ...data, degree: e.target.value })}
      />

      <CVTextInput
        label="GPA"
        value={data.gpa || ""}
        onChange={(e) => updateItem(index, { ...data, gpa: e.target.value })}
      />

      <CVTextInput
        label="Ngày bắt đầu"
        value={data.startDate || ""}
        onChange={(e) =>
          updateItem(index, { ...data, startDate: e.target.value })
        }
      />

      <CVTextInput
        label="Ngày kết thúc"
        value={data.endDate || ""}
        onChange={(e) =>
          updateItem(index, { ...data, endDate: e.target.value })
        }
      />
    </div>
  );
}
export default function CVEducation({ resumeData, changeResumeField }) {
  const education = resumeData?.education || [];

  // Update one item inside the array
  const updateEducationItem = (index, newItem) => {
    const updated = [...education];
    updated[index] = newItem;

    changeResumeField("education", null, updated);
    // The 2nd field is "key" when updating nested objects, but here education IS the array
  };

  // Add empty item
  const addEducation = () => {
    const updated = [
      ...education,
      {
        schoolName: "",
        major: "",
        degree: "",
        gpa: "",
        startDate: "",
        endDate: "",
      },
    ];

    changeResumeField("education", null, updated);
  };

  // Delete last item
  const deleteEducation = () => {
    if (education.length === 0) return;
    const updated = education.slice(0, -1);
    changeResumeField("education", null, updated);
  };

  return (
    <div className="bg-white p-5 w-[30%] max-h-screen overflow-y-auto sticky top-15">
      <h1 className="raleway-bold text-lg mb-5">Học vấn của bạn</h1>

      {education.map((edu, index) => (
        <EducationForm
          key={index}
          data={edu}
          index={index}
          updateItem={updateEducationItem}
        />
      ))}

      <div className="mt-5 flex gap-3">
        <button
          onClick={addEducation}
          className="border-primary-400 border rounded text-primary-400 hover:bg-primary-400 hover:text-white px-2 p-1"
        >
          Thêm trường
        </button>

        <button
          onClick={deleteEducation}
          className="border-red-500 border rounded text-red-500 hover:bg-red-500 hover:text-white px-2 p-1"
        >
          Xóa trường
        </button>
      </div>
    </div>
  );
}
