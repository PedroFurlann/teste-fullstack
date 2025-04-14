import { useState } from 'react';
import { Eye, EyeSlash } from 'phosphor-react';

type PasswordInputProps = {
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

const PasswordInput: React.FC<PasswordInputProps> = ({ value, placeholder = 'Digite sua senha', onChange, disabled = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative mb-4 w-full">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className={`w-full p-2 pr-10 border border-gray-600 rounded bg-white text-black
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-text'}
        `}
      />
      {showPassword ? (
        <EyeSlash
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-700"
          size={20}
          onClick={handleTogglePassword}
        />
      ) : (
        <Eye
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-700"
          size={20}
          onClick={handleTogglePassword}
        />
      )}
    </div>
  );
};

export default PasswordInput;
