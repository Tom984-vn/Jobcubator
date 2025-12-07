import { useState } from "react";
import CVTextInput from "./CVTextinput";
function SkillForm({ skill, index, updateSkill }) {
  const handleNameChange = (value) => {
    updateSkill(index, { ...skill, name: value });
  };

  const handleDetailChange = (detailIndex, value) => {
    const updatedDetails = [...skill.details];
    updatedDetails[detailIndex] = value;

    updateSkill(index, { ...skill, details: updatedDetails });
  };

  const addDetail = () => {
    updateSkill(index, { ...skill, details: [...skill.details, ""] });
  };

  const removeDetail = () => {
    if (skill.details.length > 1) {
      updateSkill(index, {
        ...skill,
        details: skill.details.slice(0, -1),
      });
    }
  };

  return (
    <div className="border-t-10 border-primary-400 pt-5">
      <CVTextInput
        label="Kỹ năng"
        placeholder="Nhập tên kỹ năng (VD: React, Node.js)"
        value={skill.name}
        onChange={(e) => handleNameChange(e.target.value)}
      />

      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Chi tiết kỹ năng
        </label>

        {skill.details.map((detail, detailIndex) => (
          <div key={detailIndex} className="flex gap-3 mb-2 items-start">
            <input
              type="text"
              placeholder="Nhập chi tiết kỹ năng (VD: 2 năm kinh nghiệm)"
              value={detail}
              onChange={(e) => handleDetailChange(detailIndex, e.target.value)}
              className="shadow appearance-none border rounded w-[75%] py-2 px-3 text-gray-700 focus:bg-blue-50 focus:border-primary-400"
            />

            {detailIndex === skill.details.length - 1 && (
              <div className="flex gap-2">
                <button
                  className="mt-2 text-lg text-primary-400 border border-primary-400 rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary-400 hover:text-white"
                  onClick={addDetail}
                >
                  +
                </button>

                <button
                  className={`mt-2 text-lg text-primary-400 border border-primary-400 rounded-full w-8 h-8 flex items-center justify-center ${
                    skill.details.length === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary-400 hover:text-white"
                  }`}
                  onClick={removeDetail}
                >
                  -
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CVSkill({ resumeData, changeResumeField }) {
  const skills = resumeData || [];

  const updateSkill = (index, updatedSkill) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = updatedSkill;

    changeResumeField("skills", null, updatedSkills);
  };

  const addSkill = () => {
    const newSkill = { name: "", details: [""] };

    changeResumeField("skills", null, [...skills, newSkill]);
  };

  const removeSkill = () => {
    if (skills.length > 0) {
      changeResumeField("skills", null, skills.slice(0, -1));
    }
  };

  return (
    <div className="bg-white p-5 w-[30%] max-h-screen overflow-y-auto sticky top-15">
      <h1 className="raleway-bold text-lg mb-5">Kỹ năng của bạn</h1>

      {skills.map((skill, index) => (
        <SkillForm
          key={index}
          skill={skill}
          index={index}
          updateSkill={updateSkill}
        />
      ))}

      <div className="mt-5 flex gap-3">
        <button
          onClick={addSkill}
          className="border-primary-400 border rounded text-primary-400 hover:bg-primary-400 hover:text-white px-2 p-1"
        >
          Thêm kỹ năng
        </button>

        <button
          onClick={removeSkill}
          className="border-red-500 border rounded text-red-500 hover:bg-red-500 hover:text-white px-2 p-1"
        >
          Xóa kỹ năng
        </button>
      </div>
    </div>
  );
}
