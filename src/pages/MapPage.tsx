import MapComponent from '../components/Map.tsx';
import { Link } from 'react-router-dom';
import Button from '../components/Button.tsx';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { motion } from 'framer-motion';

// Define the ButtonProps interface for the activate function
interface ButtonProps {
  activate: () => void;
}

// Imeta component
export const Imeta: React.FC<ButtonProps> = ({ activate }) => {
  return (
    <div 
      className='bg-dark-green border-accent-green border-[0.5px] w-full px-[10%]  xl:py-20  py-[15%] flex flex-col gap-5 rounded-none text-white'>
      <h1 className='text-[2vw] xl:text-[2vw] '>IMETA</h1>
      <h2 className='text-[1vw] xl:text-[0.9vw] '>
        The IMETA region is unique in its rich cultural and demographic diversity; however, it also encompasses some of the world’s most underserved communities.
      </h2>
      <div
        className='text-accent-green text-[0.8vw] cursor-pointer '
        onClick={activate} // Trigger the activate function when clicking "Read More"
      >
        Read More
      </div>
    </div>
  );
};

function MapPage() {
  // Initialize the isActive state with false
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleClick = () => {
    setIsActive(true); // Set the state to true when clicked
  };



  const styles = {
    icon: {
      '@media (min-width: 3840px)': {
        width: '4rem', // Width for xl screens (min-width: 3840px)
        height: '4rem', // Height for xl screens
      }
    }
  };


  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -50 }}  // Start off above
        animate={{ opacity: 1, y: 0 }}    // Slide in smoothly
        exit={{ opacity: 0, y: 50 }}      // Slide out below
        transition={{ duration: 0.6, ease: "easeOut" }}  // Smooth and quick transition
        className="w-full relative h-full flex flex-col py-7 justify-center items-center"
      >
        {/* The Imeta component */}
        <div className="absolute w-[22%] xl:w-[20%] z-50 bottom-[-4%] gap-5 xl:gap-8 left-0 flex flex-col">
          <Imeta activate={handleClick} /> {/* Passing handleClick to the Imeta component */}
          <div className='flex flex-col gap-3 justify-start w-[80%]'>
            <Link to="/more">
              <Button text={"More Stories"} onClick={function (): void {
                throw new Error('Function not implemented.');
              } } />
            </Link>
            <Link to='/team'>
              <Button text={"SD4G IMETA Team"} onClick={function (): void {
                throw new Error('Function not implemented.');
              } } />
            </Link>
          </div>
        </div>

        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}  // Start below
          animate={{ opacity: 1, y: 0 }}   // Slide in from below
          exit={{ opacity: 0, y: 20 }}     // Slide out below
          transition={{ duration: 0.7, ease: "easeOut" }}
          className='flex justify-between items-center h-full w-full xl:gap-10 xl:mt-30 flex-col'
        >
              <h1 className=" text-[2.6vw] w-full font-bold  ">India, Middle East, Turkey, and Africa (IMETA)</h1>
              <div className=' w-[95vw]  h-[80vw] object-contain'>

           <MapComponent />
              </div>
        </motion.div>
      </motion.div>

      {/* Modal with cool animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateX: 30 }}  // Backdrop starts with a scale and 3D rotation
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}     // Animates to normal scale and rotation
        exit={{ opacity: 0, scale: 0.8, rotateX: -30 }}    // Exit with reverse effects
        transition={{ duration: 0.7, ease: "easeOut" }}    // Smooth transition
        className={`bg-dark-green w-screen absolute z-[100] h-[110vh] bg-opacity-85 flex justify-center items-center
        ${isActive ? 'imeta-futuristic-enter' : 'imeta-futuristic-exit hidden'}
      `}
      >
        <div className='relative w-[55%] bg-dark-green border-accent-green border-[0.5px] p-[5%]  flex justify-center items-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}  // Modal content scales in
            animate={{ opacity: 1, scale: 1 }}    // Scales up with a bounce effect
            exit={{ opacity: 0, scale: 0.9 }}     // Scales down when exiting
            transition={{ duration: 0.5, ease: "easeInOut", bounce: 0.3 }}  // Bounce effect for smoothness

            className=' flex'
          >
            <div className='absolute top-[10%] right-[5%] xl:right-[3%] cursor-pointer'
              onClick={() => setIsActive(false)}
            >
              <CloseIcon sx={styles.icon} fontSize='large' className=' xl:w-11 xl:h-11' color='inherit' />
            </div>
            <div className='flex flex-col gap-3 xl:gap-16 text-white'>
              <h2 className='text-[2.5vw]'>IMETA</h2>
              <p className='text-[1vw] xl:text-[0.9vw] font-extralight flex flex-col gap-3 '>
                The IMETA region is unique in its rich cultural and demographic diversity; however, it also encompasses some of the world’s most underserved communities. <br /><br />
                The Boehringer Ingelheim team in IMETA is comprised of 1,800 exceptional team members from 26 nationalities who proudly serve over 70 countries, or 45 percent of the world’s population. <span className=' text-[1.107vw] '> Furthermore, 50 percent of Boehringer Ingelheim’s global sustainability efforts are being implemented in the region, reflecting the needs of underserved communities.</span>  
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

export default MapPage;
