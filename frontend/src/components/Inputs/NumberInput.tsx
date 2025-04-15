type NumberInputProps = {
  value: number;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  id?: string;
};

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  placeholder = '',
  onChange,
  disabled = false,
  error,
  id
}) => {
  return (
    <div className="mb-4 w-full">
      <input
        type="number"
        value={value}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className={`w-full p-2 border rounded bg-white text-black
          ${error ? 'border-red-500' : 'border-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-text'}
        `}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default NumberInput;
