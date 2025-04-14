type LoginTypeRadioInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

const LoginTypeRadioInput: React.FC<LoginTypeRadioInputProps> = ({ value, onChange, disabled = false }) => {
  return (
    <div className="mb-4 w-full flex items-center gap-4">
      <label className="flex items-center gap-2 text-white">
        <input
          type="radio"
          value="email"
          checked={value === 'email'}
          onChange={onChange}
          disabled={disabled}
          className="w-4 h-4 accent-violet-600"
        />
        E-mail
      </label>

      <label className="flex items-center gap-2 text-white">
        <input
          type="radio"
          value="cpf"
          checked={value === 'cpf'}
          onChange={onChange}
          disabled={disabled}
          className="w-4 h-4 accent-violet-600"
        />
        CPF
      </label>
    </div>
  );
};

export default LoginTypeRadioInput;
