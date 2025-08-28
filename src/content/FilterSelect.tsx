interface FilterSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  label?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ value, options, onChange, label }) => {
  return (
    <div className="flex items-center space-x-1">
      {label && <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300
                   focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;
