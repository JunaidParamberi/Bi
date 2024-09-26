
import { useNavigate, NavLink } from "react-router-dom";
import ArrowLeft from "../assets/icons/arrow_left.svg";
import ArrowRight from "../assets/icons/arrow_right.svg";
import Home from "../assets/icons/home.svg";
import Globe from "../assets/icons/globe.svg";
import More from "../assets/icons/more.svg";

function Navbar() {
  const navigate = useNavigate();

  const goBackward = () => {
    navigate(-1); // Go back to the previous page
  };

  const goForward = () => {
    navigate(1); // Go forward to the next page if it exists
  };



  return (
    <div className=" card-wrapper ">
      <div className=" card-content">

    <div className=" active:opacity-70 duration-300 transition-all">

      <img
        src={ArrowLeft}
        alt="arrow-left"
        className="w-[1.4vw] h-[1.4vw]  cursor-pointer  mr-[3.1vw] "
        onClick={goBackward} // Call goBackward on click
        />
    </div>

      <div className="flex items-center gap-[1.5vw] ">
        <NavLink to="more" className={ ({isActive}) => ` ${isActive && "icon-gradient-border"}  hover:scale-110 active:scale-95 active:rotate-[10deg] transition-transform duration-300 p-2 xl:p-6`}>
          <img src={More} alt="more" className={ `w-[1.4vw] h-[1.4vw]  xl:w-[50px] xl:h-[50px] duration-300 transition-all`} />
        </NavLink>

        <NavLink to="/" className={ ({isActive}) => ` ${isActive && "icon-gradient-border"} hover:scale-110 active:scale-95 active:rotate-[10deg] transition-transform duration-300 p-2 xl:p-6`}>
          <img src={Globe} alt="globe" className={ `w-[1.4vw] h-[1.4vw]   xl:w-[50px] xl:h-[50px] duration-300 transition-all`} />
        </NavLink>

        <NavLink 
        to="world"
        
        className={ ({isActive}) => ` ${isActive && "icon-gradient-border"} hover:scale-110 active:scale-95 active:rotate-[10deg] transition-transform duration-300 p-2 xl:p-6`}>
          <img src={Home} alt="home" className={ `w-[1.4vw] h-[1.4vw]   xl:w-[50px] xl:h-[50px] duration-300 transition-all`} />
        </NavLink>
      </div>

    <div className="">

      <img
        src={ArrowRight}
        alt="arrow-right"
        className="w-[1.4vw] h-[1.4vw] cursor-pointer ml-[3.1vw]"
        onClick={goForward} // Call goForward on click
        />
    </div>
        </div>
    </div>
  );
}

export default Navbar;
