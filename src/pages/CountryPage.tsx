import { Key, useState } from 'react';
import cardImg from '../assets/images/Asset 24.png';
import smImg from '../assets/images/Asset 28.png';
import smImg2 from '../assets/images/Asset 29.png';
import smImg3 from '../assets/images/Asset 30.png';
import smImg4 from '../assets/images/Asset 31.png';
import { useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { motion } from 'framer-motion';

// Define the types for Article and CurrentData
interface Article {
  heading: string;
  article: string;
}

interface CurrentData {
  country: string;
  articles: Article[];
}

const CountryPage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null); // Track image index instead of image itself
  const location = useLocation();
  const currentData = location.state as CurrentData; // Use type assertion
  const [data, setData] = useState<Article>(currentData.articles[0]); // Specify type for data

  const img = [smImg, smImg2, smImg3, smImg4];

  const handleClick = (item: Article) => {
    setData(item);
  };

  const handleNextImage = () => {
    if (currentImageIndex !== null && currentImageIndex < img.length - 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex ?? 0) + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex !== null && currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex ?? 1) - 1);
    }
  };

  const handleCloseImage = () => {
    setCurrentImageIndex(null);
  };

  const styles = {
    icon: {
      '@media (min-width: 3840px)': {
        width: '5rem', // Width for xl screens (min-width: 3840px)
        height: '5rem', // Height for xl screens
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start below
      animate={{ opacity: 1, y: 0 }} // Slide in from below
      exit={{ opacity: 0, y: 20 }} // Slide out below
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative w-full h-full flex justify-center items-center"
    >
      {currentImageIndex !== null && (
        <div
          className={`fixed full-image inset-0 flex justify-center items-center bg-dark-green bg-opacity-30 z-50 text-accent-green
          ${currentImageIndex !== null ? 'imeta-futuristic-enter' : 'imeta-futuristic-exit'}
        `}
        >
          <div
            className="absolute xl:right-20 xl:top-20 right-10 top-10 cursor-pointer"
            onClick={handleCloseImage}
          >
            <CloseIcon
              sx={styles.icon}
              fontSize="large"
             
              color="inherit"
            />
          </div>

          {/* Previous Arrow */}
          <button
            onClick={handlePreviousImage}
            disabled={currentImageIndex === 0} // Disable if at the first image
            className={`absolute left-8 xl:left-16 cursor-pointer z-50 text-accent-green ${
              currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowBackIosNewIcon  color="inherit" sx={styles.icon} />
          </button>

          {/* Image */}
          <img
            src={img[currentImageIndex]} // Display current image
            alt="image"
            className="h-[90%] w-auto"
          />

          {/* Next Arrow */}
          <button
            onClick={handleNextImage}
            disabled={currentImageIndex === img.length - 1} // Disable if at the last image
            className={`absolute right-8 xl:right-16 cursor-pointer z-50 text-accent-green ${
              currentImageIndex === img.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowForwardIosIcon  color="inherit" sx={styles.icon} />
          </button>
        </div>
      )}

      <div className="bg-dark-green border-accent-green border-[0.5px] w-full flex justify-center items-center h-[90%]">
        <div className="w-[90%] h-[90%] flex gap-5">
          <img src={cardImg} alt="" className="h-full w-[35%] object-cover" />

          <div className="h-full w-full text-[#ffffff81] flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }} // Start below
              animate={{ opacity: 1, y: 0 }} // Slide in from below
              exit={{ opacity: 0, y: 20 }} // Slide out below
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full h-full flex flex-col justify-items-end items-baseline"
            >
              <h1 className="text-[40px] font-bold w-full text-left xl:text-[100px] text-white my-4">
                {currentData.country}
              </h1>

              <div className="flex w-full items-end">
                {currentData.articles.map((item: Article, index: Key) => (
                  <button
                    key={index}
                    onClick={() => handleClick(item)}
                    className={`${
                      data?.heading === item.heading
                        ? 'bg-accent-green text-dark-green px-5 py-2 font-semibold xl:text-[35px] text-[14px]'
                        : 'bg-black xl:text-[32px] text-white text-[13px] px-5 py-[7px] font-semibold bg-opacity-20'
                    }`}
                  >
                    {item.heading}
                  </button>
                ))}
              </div>

              <div className="border-accent-green border-[0.5px] h-[80%] w-full flex justify-center items-center mb-3">
                <div className="overflow-y-auto custom-scrollbar h-[80%] w-[95%] xl:text-[40px]">
                  <p className="text-white p-3">{data?.article}</p>
                </div>
              </div>

              {/* Image Slider */}
              <div className="flex w-full h-[30%] overflow-x-auto gap-4 custom-scrollbar-y">
                {img.map((imageSrc: string, index: number) => (
                  <img
                    onClick={() => setCurrentImageIndex(index)} // Set index when an image is clicked
                    src={imageSrc}
                    alt=""
                    key={index}
                    className="w-[300px] xl:w-[513px] h-full object-cover cursor-zoom-in"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CountryPage;
