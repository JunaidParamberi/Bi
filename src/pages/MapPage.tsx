import MapComponent from "../components/Map.tsx";
import { Link } from "react-router-dom";
import Button from "../components/Button.tsx";
import { useState } from "react";
import { useKeyboard } from "../hooks/useKeyboard";
import { AnimatePresence, motion } from "framer-motion";

// Define the ButtonProps interface for the activate function
interface ButtonProps {
  activate: () => void;
}

// Imeta component
export const Imeta: React.FC<ButtonProps> = ({ activate }) => {
  return (
    <div className="bg-dark-green border-accent-green border-[0.5px] w-full px-[10%] xl:py-20 py-[15%] flex flex-col gap-5 rounded-none text-white">
      <h1 className="text-[2cqw] xl:text-[2cqw] ">IMETA</h1>
      <h2 className="text-[1cqw] xl:text-[0.9cqw] ">
        The IMETA region is unique in its rich cultural and demographic
        diversity; however, it also encompasses some of the world’s most
        underserved communities. The Boehringer Ingelheim team in IMETA is
        comprised of close to 1,600 exceptional team members from 45
        nationalities who proudly serve over 70 countries. <br /> <br />
      </h2>
      <button
        type="button"
        className="read-more self-start text-[0.8cqw]"
        onClick={activate} // Trigger the activate function when clicking "Read More"
      >
        Read More
      </button>
    </div>
  );
};

const modalPanel = {
  hidden: { opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delayChildren: 0.15, staggerChildren: 0.08 },
  },
  exit: { opacity: 0, scale: 0.94, y: 24, filter: "blur(8px)", transition: { duration: 0.25, ease: "easeIn" } },
} as const;

const modalLine = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
} as const;

const modalRule = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
} as const;

const modalClose = {
  hidden: { opacity: 0, rotate: -90 },
  show: { opacity: 1, rotate: 0, transition: { duration: 0.4, ease: "easeOut" } },
} as const;

function MapPage() {
  // Initialize the isActive state with false
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleClick = () => {
    setIsActive(true); // Set the state to true when clicked
  };

  useKeyboard({ Escape: () => setIsActive(false) }, isActive);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }} // Start off above
        animate={{ opacity: 1, y: 0 }} // Slide in smoothly
        exit={{ opacity: 0, y: 50 }} // Slide out below
        transition={{ duration: 0.6, ease: "easeOut" }} // Smooth and quick transition
        className="w-full relative h-full flex flex-col py-7 justify-center items-center"
      >
        {/* The Imeta component */}
        <div className="absolute w-[22%] xl:w-[20%] z-50 bottom-[-4%] gap-5 xl:gap-8 left-0 flex flex-col">
          <Imeta activate={handleClick} />{" "}
          <div className="flex flex-col gap-1">
            <span className="text-gray-300 text-[0.8cqw]">DISCLIMER </span>
            <span className="text-gray-300 text-[0.8cqw]">
              *The data provided on this platform are updated as of October 27,
              2025”
            </span>
          </div>
          {/* Passing handleClick to the Imeta component */}
          <div className="flex flex-col gap-3 justify-start w-[80%]">
            <Link to="/more">
              <Button
                text={"More Stories"}
                onClick={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </Link>
            <Link to="/team">
              <Button
                text={"SD4G IMETA Team"}
                onClick={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} // Start below
          animate={{ opacity: 1, y: 0 }} // Slide in from below
          exit={{ opacity: 0, y: 20 }} // Slide out below
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex justify-between items-center h-full w-full xl:gap-10 xl:mt-30 flex-col"
        >
          <h1 className=" text-[2.6cqw] w-full font-bold  ">
            India, Middle East, Turkey, and Africa (IMETA)
          </h1>
          <div className=" w-[85cqw] ] object-contain">
            <MapComponent />
          </div>
        </motion.div>
      </motion.div>

      {/* IMETA modal: backdrop blurs in, panel rises out of the IMETA card's corner, text staggers in */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="imeta-modal"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.3, delay: 0.1 } }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-dark-green/85 w-screen absolute z-100 h-[110cqh] flex justify-center items-center"
            onClick={() => setIsActive(false)}
          >
            <motion.div
              variants={modalPanel}
              initial="hidden"
              animate="show"
              exit="exit"
              style={{ transformOrigin: "left bottom" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[55%] bg-dark-green border-accent-green border-[0.5px] p-[5%] flex justify-center items-center shadow-2xl"
            >
              <motion.button
                type="button"
                aria-label="Close (Esc)"
                variants={modalClose}
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-[10%] right-[5%] xl:right-[3%] cursor-pointer text-white hover:text-accent-green hover:bg-white/10 transition-colors p-[0.8cqw] -m-[0.8cqw] rounded-full"
                onClick={() => setIsActive(false)}
              >
                {/* Same path and sizing as the MUI Close icon it replaces */}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="currentColor"
                  className="imeta-close-icon w-8.75 h-8.75 inline-block shrink-0"
                >
                  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </motion.button>
              <div className="flex flex-col gap-3 xl:gap-16 text-white">
                <motion.h2 variants={modalLine} className="text-[2.5cqw]">IMETA</motion.h2>
                <motion.span
                  variants={modalRule}
                  className="block h-px w-[6cqw] bg-accent-green origin-left"
                />
                <motion.p variants={modalLine} className="text-[1.150cqw] font-extralight flex flex-col gap-3 ">
                  The IMETA region is unique in its rich cultural and demographic
                  diversity; however, it also encompasses some of the world’s most
                  underserved communities. The Boehringer Ingelheim team in IMETA
                  is comprised of close to 1,600 exceptional team members from 45
                  nationalities who proudly serve over 70 countries.
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MapPage;
