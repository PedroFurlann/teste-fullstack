import Logo from '../assets/logo-icon.svg';
import { useNavigate } from "react-router-dom";

const AuthNavbar: React.FC = () => {

  const navigate = useNavigate();

  return (
    <div className="w-full h-24 bg-black flex items-center pl-8 gap-6 justify-center"
      style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)' }}
    >
      <div className="cursor-pointer" onClick={() => navigate('/')}>
        <img alt="Teste logo" src={Logo} className="bg-transparent cursor-pointer" width={60} height={60} />
      </div>
    </div>
  );
}

export default AuthNavbar