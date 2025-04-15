type TextInputProps = {
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
};

const TextInput: React.FC<TextInputProps> = ({ id, placeholder = '', value, disabled = false, onChange }) => {
  return (
    <div className="mb-4 w-full">
      <input
        type="text"
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className={`w-full p-2 border border-gray-600 rounded bg-white text-black
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-text'}
        `}
      />
    </div>
  );
};

export default TextInput;