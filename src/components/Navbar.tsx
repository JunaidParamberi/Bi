
import { useNavigate, NavLink } from "react-router-dom";
import ArrowLeft from "../assets/icons/arrow_left.svg";
import ArrowRight from "../assets/icons/arrow_right.svg";
import Home from "../assets/icons/home.svg";
import Globe from "../assets/icons/globe.svg";
import More from "../assets/icons/more.svg";
import { motion } from "framer-motion";

// One ring shared by all items (layoutId), so it glides to the active icon on route change
function NavItem({ to, icon, alt }: { to: string; icon: string; alt: string }) {
  return (
    <NavLink
      to={to}
      className="relative inline-flex items-center justify-center rounded-full hover:scale-110 active:scale-95 active:rotate-10 transition-transform duration-300 p-2 xl:p-6"
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="navActiveRing"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="nav-active-ring"
            />
          )}
          <img
            src={icon}
            alt={alt}
            className="relative w-[1.4cqw] h-[1.4cqw] xl:w-[50px] xl:h-[50px] duration-300 transition-all"
          />
        </>
      )}
    </NavLink>
  );
}

function Navbar() {
  const navigate = useNavigate();

  const goBackward = () => {
    navigate(-1); // Go back to the previous page
  };

  const goForward = () => {
    navigate(1); // Go forward to the next page if it exists
  };



  return (
    <div className=" card-wrapper " data-app-navbar>
      <div className=" card-content">

    <div className=" active:opacity-70 duration-300 transition-all">

      <img
        src={ArrowLeft}
        alt="arrow-left"
        className="w-[1.4cqw] h-[1.4cqw]  cursor-pointer  mr-[3.1cqw] "
        onClick={goBackward} // Call goBackward on click
        />
    </div>

      <div className="flex items-center gap-[1.5cqw] ">
        <NavItem to="/more" icon={More} alt="more" />
        <NavItem to="/" icon={Globe} alt="globe" />
        <NavItem to="/world" icon={Home} alt="home" />
      </div>

    <div className="">

      <img
        src={ArrowRight}
        alt="arrow-right"
        className="w-[1.4cqw] h-[1.4cqw] cursor-pointer ml-[3.1cqw]"
        onClick={goForward} // Call goForward on click
        />
    </div>
        </div>
    </div>
  );
}

export default Navbar;
