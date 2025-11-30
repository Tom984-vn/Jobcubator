import { FaWandMagicSparkles } from "react-icons/fa6";

export default function CVTextArea({ label, value, onChange, placeholder }) {
  return (
    <div className="mb-4 relative">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
        <button className="flex items-center gap-2 px-3 py-1 bg-primary-400 text-white rounded-full hover:bg-secondary-2-300 transition-all duration-150">
          <FaWandMagicSparkles /> Hỗ trợ AI
        </button>
      </div>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:bg-blue-50 focus:border-primary-400 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
      />
    </div>
  );
}
