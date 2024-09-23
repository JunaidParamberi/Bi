
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

    <div className=" active:opacity-70">

      <img
        src={ArrowLeft}
        alt="arrow-left"
        className="w-[20px] h-[20px] cursor-pointer  xl:w-[50px] xl:h-[50px] mr-14 xl:mr-24"
        onClick={goBackward} // Call goBackward on click
        />
    </div>

      <div className="flex items-center gap-6 xl:gap-11">
        <NavLink to="more" className={ ({isActive}) => ` ${isActive && "icon-gradient-border"} p-2 xl:p-6 active:opacity-70`}>
          <img src={More} alt="more" className={ `w-[20px] h-[20px]  xl:w-[50px] xl:h-[50px]`} />
        </NavLink>

        <NavLink to="/" className={ ({isActive}) => ` ${isActive && "icon-gradient-border"} p-2  xl:p-6 active:opacity-70`}>
          <img src={Globe} alt="globe" className={ `w-[20px] h-[20px]  xl:w-[50px] xl:h-[50px]`} />
        </NavLink>

        <NavLink 
        to="world"
        
        className={ ({isActive}) => ` ${isActive && "icon-gradient-border"} p-2 xl:p-5 active:opacity-70`}>
          <img src={Home} alt="home" className={ `w-[20px] h-[20px]  xl:w-[50px] xl:h-[50px]`} />
        </NavLink>
      </div>

    <div className="">

      <img
        src={ArrowRight}
        alt="arrow-right"
        className="w-[20px] h-[20px] cursor-pointer xl:w-[50px] xl:h-[50px] ml-14  xl:ml-24"
        onClick={goForward} // Call goForward on click
        />
    </div>
        </div>
    </div>
  );
}

export default Navbar;
