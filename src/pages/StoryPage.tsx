import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PuffLoader } from 'react-spinners';

import { storyData } from '../data/MoreStories';
import rightArrow from '../assets/images/chevron-right.svg'
import leftArrow from '../assets/images/chevron-left.svg'
import close from '../assets/images/cancel icon.svg'

export default function StoryPage() {
  const location = useLocation();
  const params = useParams();
  const state = location.state;

  const filteredData = storyData.find(data => data.title === params.title);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [data] = useState(filteredData);

  // Effect to reset loading when data changes
  useEffect(() => {
    setLoading(false); // Reset loading when article data changes
  }, [data]);

  const handlePrevClick = () => {
    if (currentImageIndex !== null && currentImageIndex > 0) {
      setSwipeDirection('right');
      setLoading(true); // Set loading to true when changing image
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentImageIndex !== null && currentImageIndex < (data?.images?.length || 0) - 1) {
      setSwipeDirection('left');
      setLoading(true); // Set loading to true when changing image
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleImageLoad = () => {
    setLoading(false); // Set loading to false after the image has loaded
  };
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start below
      animate={{ opacity: 1, y: 0 }} // Slide in from below
      exit={{ opacity: 0, y: 20 }} // Slide out below
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="w-full h-full flex flex-col py-6 justify-center items-center"
    >
      <div className="bg-dark-green border-accent-green border-[0.5px] xl:h-[90%] h-full w-full flex justify-center items-center py-7">
        <div className="w-[90%] gap-7 xl:gap-16 flex h-[80%] justify-center items-start">
          <div className="w-[50%] h-full">
            <img src={state.coverImage} alt="" className="w-full h-full object-cover" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} // Start below
            animate={{ opacity: 1, y: 0 }} // Slide in from below
            exit={{ opacity: 0, y: 20 }} // Slide out below
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="w-[60%] flex flex-col h-full gap-6"
          >
            <h1 className="text-[2.8vw] font-bold w-full text-left xl:text-[100px] text-white">{state.title}</h1>

            <div className="border-accent-green border-[0.5px] h-[60%] max-w-full flex justify-center items-center mb-3">
              <div className="overflow-y-auto custom-scrollbar h-[80%] w-[95%] xl:text-[40px]">
                <p className="text-white text-[1vw] xl:text-[0.9vw] p-3">{state.text} <br /> <br />{state.title=== "Making More Health" ? "Continue the journey 2024." : ""} </p>
              </div>
            </div>

            {/* Image Slider */}
            <div className="flex w-full h-[30%] overflow-x-auto gap-4 custom-scrollbar-y">
              {data?.images?.map((imageSrc: string, index: number) => (
                <div key={index} className="relative">
                  {loading && currentImageIndex === index ? (
                    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
                      <PuffLoader color="#36d7b7" />
                    </div>
                  ) : (
                    <img
                      onClick={() => {
                        setCurrentImageIndex(index); // Set index when an image is clicked
                        setLoading(true); // Set loading to true when the image is clicked
                      }}
                      srcSet={`${imageSrc}?w=200 200w, ${imageSrc}?w=400 400w, ${imageSrc}?w=800 800w`}
                      loading="lazy"
                      alt=""
                      className="min-w-[15vw] xl:w-[513px] h-full object-cover cursor-zoom-in"
                      onLoad={handleImageLoad} // Call when the image loads
                      onError={() => setLoading(false)} // Handle error case
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal for Image Viewer */}
      {currentImageIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 flex justify-center items-center bg-dark-green z-50 text-accent-green"
        >
          <div
            className="absolute xl:right-20 xl:top-20 right-10 top-10 cursor-pointer"
            onClick={() => setCurrentImageIndex(null)} // Close modal
          >
           <img src={close} alt="close" className="w-[1.5vw] h-auto" />
          </div>

          <button
            onClick={handlePrevClick}
            disabled={currentImageIndex === 0}
            className={`absolute left-8 cursor-pointer z-50 text-accent-green ${
              currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
                <img src={leftArrow} alt="Previous" className="w-[3vw] h-auto " />
          </button>

          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, x: swipeDirection === 'left' ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: swipeDirection === 'left' ? -100 : 100 }}
            transition={{ duration: 0.5 }}
            className="h-[90%] w-auto flex justify-center items-center"
          >
            <img
              src={data?.images?.[currentImageIndex!] ?? ''}
              alt="image"
              className="h-[95%] w-auto object-cover max-w-[90%] border-accent-green border-[2px]"
              onLoad={handleImageLoad}
            />
          </motion.div>

          <button
            onClick={handleNextClick}
            disabled={currentImageIndex === (data?.images?.length || 0) - 1}
            className={`absolute right-8 cursor-pointer z-50 text-accent-green ${
              currentImageIndex === (data?.images?.length || 0) - 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
             <img src={rightArrow} alt="Next" className="w-[3vw] h-auto" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
