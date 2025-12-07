export default function CVRadioInput({ label, options, checked, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {options.map((opt) => (
          <div key={opt} className="flex items-center mb-2">
            <input
              type="radio"
              name={label}
              value={opt}
              checked={checked === opt}
              onChange={() => onChange(opt)}
              className="mr-2"
            />
            <span className="text-gray-700">{opt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
