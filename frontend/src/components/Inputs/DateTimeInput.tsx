import { useState } from 'react';

type DateTimeInputProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
};

const DateTimeInput: React.FC<DateTimeInputProps> = ({
  placeholder = 'Selecione a data e hora',
  value,
  disabled = false,
  onChange,
  label,
}) => {
  const [inputValue, setInputValue] = useState(value || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value;
    setInputValue(formatted);
    onChange(formatted);
  };

  return (
    <div className="mb-4 md:max-w-[320px] w-full">
      {label && <label className="mb-1 block text-sm font-bold text-white">{label}</label>}

      <input
        type="datetime-local"
        value={inputValue}
        placeholder={placeholder}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full rounded border border-gray-600 bg-white p-2 text-black
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-text opacity-100'}
        `}
      />
    </div>
  );
};

export default DateTimeInput;
