import { useState } from 'react';
import { formatCPF } from '../../utils/formatCPF';

type CpfInputProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const CpfInput: React.FC<CpfInputProps> = ({ placeholder = 'Digite seu CPF', value, disabled = false, onChange }) => {
  const [inputValue, setInputValue] = useState(value || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setInputValue(formatted);
    onChange(formatted);
  };

  return (
    <div className="mb-4 w-full">
      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full p-2 border border-gray-600 rounded bg-white text-black
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-text'}
        `}
      />
    </div>
  );
};

export default CpfInput;
