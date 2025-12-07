export default function CVTextInput({ label, placeholder, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:bg-blue-50 focus:border-primary-400 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  );
}
