import { Key, useState, useEffect } from 'react';
import cardImg from '../assets/images/Asset 24.png';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { imetaData } from "../data/IMETA";
import { PuffLoader } from 'react-spinners';
import playBtn from '../assets/images/play.svg'
import rightArrow from '../assets/images/chevron-right.svg'
import leftArrow from '../assets/images/chevron-left.svg'
import close from '../assets/images/cancel icon.svg'

type Article = {
  coverImage?: string;
  heading: string;
  images?: string[];
  videoThump?: string;
  article: string;
};

interface CurrentData {
  country: string;
  articles: Article[];
}

const CountryPage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [loading, setLoading] = useState(false); // Loading state
  const location = useLocation();
  const currentData = location.state as CurrentData;
  const [data, setData] = useState<Article>(currentData.articles[0]);

  useEffect(() => {
    setLoading(false); // Reset loading when article data changes
  }, [data]);

  const handleClick = (item: Article) => {
    setData(item);
    setCurrentImageIndex(null); // Reset the image index when changing articles
    setLoading(true); // Start loading when changing articles
  };

  const filteredData = imetaData.filter(item => item.country === currentData.country);
  const newData = filteredData[0];

  const handlePrevClick = () => {
    if (currentImageIndex !== null && currentImageIndex > 0) {
      setSwipeDirection('right');
      setLoading(true); // Set loading to true when changing image
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentImageIndex !== null && currentImageIndex < (data.images?.length || 0) - 1) {
      setSwipeDirection('left');
      setLoading(true); // Set loading to true when changing image
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleImageLoad = () => {
    setLoading(false); // Set loading to false after the image has loaded
  };

  const isVideo = (src: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some(ext => src.endsWith(ext));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative w-full h-full flex justify-center items-center"
    >
      {currentImageIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`fixed inset-0 flex justify-center items-center bg-dark-green  z-50 text-accent-green`}
        >
          <div
                        className="absolute xl:right-20 xl:top-20 right-10 top-10 cursor-pointer"
                        onClick={() => setCurrentImageIndex(null)} // Close modal
                      >
                       <img src={close} alt="Next" className="w-[1.5vw] h-auto" />
                      </div>
            
                      {/* Left arrow button with custom image */}
                      <button
                        onClick={handlePrevClick}
                        disabled={currentImageIndex === 0}
                        className={`absolute left-8 cursor-pointer z-50 text-accent-green ${
                          currentImageIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      >
                        <img src={leftArrow} alt="Previous" className="w-[3vw] h-auto " />
                      </button>
            
                      {/* Image or Video with animation */}
                      <motion.div
                        key={currentImageIndex} // Key prop to trigger remount on index change
                        initial={{ opacity: 0, x: swipeDirection === 'left' ? 100 : -100 }} // Start off-screen
                        animate={{ opacity: 1, x: 0 }} // Animate to full opacity and center
                        exit={{ opacity: 0, x: swipeDirection === 'left' ? -100 : 100 }} // Exit off-screen
                        transition={{ duration: 0.5 }} // Transition duration
                        className="h-[90%] w-auto flex justify-center items-center"
                      >
                        {isVideo(data.images?.[currentImageIndex!] ?? '') ? (
                          <video
                            controls
                            autoPlay
                            className="h-[95%] w-auto object-cover max-w-[90%] border-accent-green border-[2px]"
                          >
                            <source src={data.images?.[currentImageIndex!] ?? ''} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={data.images?.[currentImageIndex!] ?? ''}
                            alt="media"
                            className="h-[95%] w-auto object-cover max-w-[90%] border-accent-green border-[2px]"
                            onLoad={handleImageLoad} // Call when the image loads
                          />
                        )}
                      </motion.div>
            
                      {/* Right arrow button with custom image */}
                      <button
                        onClick={handleNextClick}
                        disabled={currentImageIndex === (data.images?.length || 0) - 1}
                        className={`absolute right-8 cursor-pointer z-50 text-accent-green ${
                          currentImageIndex === (data.images?.length || 0) - 1 ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      >
                        <img src={rightArrow} alt="Next" className="w-[3vw] h-auto" />
                      </button>
                    </motion.div>
                  )}
            
                  <div className="bg-dark-green border-accent-green border-[0.5px] w-full flex justify-center items-center h-[90%]">
                    <div className="w-[90%] h-[90%] flex justify-between">
                      <img src={data.coverImage ? data?.coverImage : cardImg} alt="" className="h-full w-[35%] object-cover" />
            
                      <div className="h-full w-[63%] text-[#ffffff81] flex flex-col justify-between">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="w-full h-full flex flex-col justify-items-end items-baseline"
                        >
                          <h1 className="text-[2.8vw]  font-bold w-full text-left  text-white my-4">
                            {newData.country}
                          </h1>
            
                          <div className="flex w-full items-end">
                            {newData.articles.map((item: Article, index: Key) => (
                              <button
                                key={index}
                                onClick={() => handleClick(item)}
                                className={`${
                                  data?.heading === item.heading
                                    ? 'bg-accent-green text-dark-green px-5 py-2 font-semibold text-[1vw]'
                                    : 'bg-black  text-white text-[0.9vw] px-5 py-[7px] font-semibold bg-opacity-20 '
                                }`}
                              >
                                {item.heading}
                              </button>
                            ))}
                          </div>
            
                          <div className="border-accent-green border-[0.5px] h-[80%] max-w-full flex justify-center items-center mb-3">
                            <div className="overflow-y-auto custom-scrollbar h-[80%] w-[95%] xl:text-[40px]">
                              <p className="text-white text-[1vw] xl:text-[0.9vw] p-3">{data?.article}</p>
                            </div>
                          </div>
            
                          {/* Image and Video Slider */}
                          <div className="flex w-full h-[30%] overflow-x-auto gap-4 custom-scrollbar-y">
                            {data.images?.map((mediaSrc: string, index: number) => (
                              <div key={index} className="relative">
                                {loading && currentImageIndex === index ? (
                                  <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
                                    <PuffLoader color="#36d7b7" />
                                  </div>
                                ) : isVideo(mediaSrc) ? (
                                  <div className="relative">
                                    {/* Render video thumbnail with play button */}
                                    <img
                                      onClick={() => {
                                        setCurrentImageIndex(index);
                                        setLoading(true);
                                      }}
                                      src={data.videoThump ?? mediaSrc}
                                      className="min-w-[15vw] xl:w-[513px] h-full object-cover cursor-zoom-in"
                                      onLoad={handleImageLoad}
                                      onError={() => setLoading(false)} // Handle error case
                                      alt="Video Thumbnail"
                                    />
                                    {/* Play button overlay */}
                                    <img
                                      src={playBtn}
                                      alt="Play Button"
                                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px]"
                                    />
                                  </div>
                                ) : (
                                  <img
                                    onClick={() => {
                                      setCurrentImageIndex(index);
                                      setLoading(true);
                                    }}
                                    src={mediaSrc}
                                    loading="lazy"
                                    alt="Image"
                                    className="min-w-[15vw] xl:w-[513px] h-full object-cover cursor-zoom-in"
                                    onLoad={handleImageLoad}
                                    onError={() => setLoading(false)} // Handle error case
                                  />
                                )}
                              </div>
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
            
