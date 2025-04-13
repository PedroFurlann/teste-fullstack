import { useState, useEffect, useRef } from "react";
import { List } from "phosphor-react";
import Logo from '../../public/logo-icon.svg';
import { useNavigate } from "react-router-dom";

const AuthNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-24 bg-black flex items-center pl-8 gap-6 justify-between"
      style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)' }}
    >
      <div className="cursor-pointer" onClick={() => navigate('/')}>
        <img alt="Accurate logo" src={Logo} className="bg-transparent cursor-pointer" width={180} height={180} />
      </div>

      <div>
        <button
          ref={buttonRef}
          className="text-lg font-extrabold text-white transition-all ease-in-out duration-500 cursor-pointer hover:bg-gray-950 hover:text-gray-200 py-2 px-3 rounded-2xl"
          onClick={toggleMenu}
        >
          <List weight="bold" size={28} />
        </button>
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-4 top-38 bg-black w-48 border border-white rounded-md shadow-lg"
            style={{ transform: "translateX(-10%)" }}
          >

            <a key={"Register"}>
              <p 
                className="block cursor-pointer py-2 px-4 text-white font-bold hover:bg-violet-400 transition-all ease-in-out duration-300"
                onClick={() => navigate('/login')}
              >
                
                Cadastrar-se
              </p>
            </a>


            <a key={"Login"}>
              <p 
                className="block cursor-pointer py-2 px-4 text-white font-bold hover:bg-violet-400 transition-all ease-in-out duration-300"
                onClick={() => navigate('/login')}
              >
                Login
              </p>
            </a>

          </div>
        )}
      </div>
    </div>
  );
}

export default AuthNavbar