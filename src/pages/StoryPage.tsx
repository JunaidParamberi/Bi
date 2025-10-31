import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PuffLoader } from "react-spinners";
import playBtn from "../assets/images/play.svg";

import { storyData } from "../data/MoreStories";
import rightArrow from "../assets/images/chevron-right.svg";
import leftArrow from "../assets/images/chevron-left.svg";
import close from "../assets/images/cancel icon.svg";

interface Story {
  title: string;
  coverImage: string;
  text: string;
  coverText: string;
  images: string[];
  videos: {
    src: string;
    thumb: string;
    caption: string;
  }[];
  lists?: {
    listHead: string;
    listPoints: string[];
  }[];
}

export default function StoryPage() {
  const params = useParams();
  const filteredDataRaw = storyData.find((data) => data.title === params.title);
  const filteredData: Story | null = filteredDataRaw
    ? {
        ...filteredDataRaw,
        videos: filteredDataRaw.videos ?? [],
      }
    : null;

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Story | null>(filteredData || null);

  // Combine images and videos for easy navigation
  const media = data
    ? [
        ...data.videos.map((v) => ({
          type: "video" as const,
          src: v.src,
          thumb: v.thumb,
        })),
        ...data.images.map((src) => ({ type: "image" as const, src })),
      ]
    : [];

  useEffect(() => {
    setData(filteredData || null);
  }, [filteredData]);

  useEffect(() => {
    setLoading(false);
  }, [filteredData]);

  if (!filteredData) {
    return <h1>Loading</h1>;
  }

  const handlePrevClick = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setSwipeDirection("right");
      setLoading(true);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentIndex !== null && currentIndex < media.length - 1) {
      setSwipeDirection("left");
      setLoading(true);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleMediaLoad = () => {
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full h-full flex flex-col py-6 justify-center items-center"
    >
      <div className="bg-dark-green border-accent-green border-[0.5px] xl:h-[90%] h-full w-full flex justify-center items-center py-7">
        <div className="w-[90%] gap-7 xl:gap-16 flex h-[80%] justify-center items-start">
          {/* Cover Image */}
          <div className="w-[50%] h-full">
            <img
              src={data?.coverImage ?? ""}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Story Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="w-[60%] flex flex-col h-full gap-[0.5vw]"
          >
            <h1 className="text-[2.8vw] font-bold w-full text-left xl:text-[100px] text-white">
              {data?.title}
            </h1>

            <div className="border-accent-green border-[0.5px] min-h-[60%] max-h-[60%] max-w-full flex justify-center items-center mb-3">
              <div className="overflow-y-auto custom-scrollbar h-[80%] w-[95%] xl:text-[40px]">
                {data?.text && (
                  <p className="text-white text-[1vw] xl:text-[0.9vw] p-3">
                    {data?.text} <br />
                    {data?.title === "Making More Health" && (
                      <>
                        <br />
                        Continuing the journey in 2024.
                      </>
                    )}
                  </p>
                )}

                {/* Render lists if they exist */}
                {data?.lists && data?.lists.length > 0 && (
                  <div className="flex flex-col gap-[1vw] mt-4 p-3">
                    {data?.lists.map((list, idx) => (
                      <div key={idx} className="flex flex-col gap-[0.5vw]">
                        <h3 className="font-semibold text-white text-[1vw] xl:text-[0.9vw]">
                          {list.listHead}:
                        </h3>
                        <ul className="list-disc pl-5 flex flex-col gap-[0.5vw] text-[1vw] xl:text-[0.9vw] text-white">
                          {list.listPoints.map((point, pIdx) => (
                            <li key={pIdx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Media Slider */}
            {media.length > 0 && (
              <div className="flex w-full h-[40%] overflow-x-auto gap-4 custom-scrollbar-y">
                {media.map((item, idx) => (
                  <div key={idx} className="relative">
                    {loading && currentIndex === idx && (
                      <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
                        <PuffLoader color="#36d7b7" />
                      </div>
                    )}

                    {item.type === "video" ? (
                      <div className="relative h-full">
                        <img
                          src={item.thumb}
                          onClick={() => {
                            setCurrentIndex(idx);
                            setLoading(true);
                          }}
                          className="min-w-[15vw] h-full object-cover cursor-zoom-in"
                          alt="Video Thumbnail"
                          onLoad={handleMediaLoad}
                        />
                        <img
                          src={playBtn}
                          onClick={() => {
                            setCurrentIndex(idx);
                            setLoading(true);
                          }}
                          alt="Play Button"
                          className="cursor-zoom-in absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[4vw] h-[4vw] bg-[#000000] rounded-full bg-opacity-40"
                        />
                      </div>
                    ) : (
                      <img
                        src={item.src}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setLoading(true);
                        }}
                        loading="lazy"
                        alt="Story Image"
                        className="min-w-[16.2vw] h-full object-cover cursor-zoom-in"
                        onLoad={handleMediaLoad}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal for media viewer */}
      {currentIndex !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 flex justify-center items-center bg-dark-green z-50 text-accent-green"
        >
          {/* Close Button */}
          <div
            className="absolute xl:right-20 xl:top-20 right-10 top-10 cursor-pointer"
            onClick={() => setCurrentIndex(null)}
          >
            <img src={close} alt="Close" className="w-[1.5vw] h-auto" />
          </div>

          {/* Prev Button */}
          <button
            onClick={handlePrevClick}
            disabled={currentIndex === 0}
            className={`absolute left-8 cursor-pointer z-50 text-accent-green ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <img src={leftArrow} alt="Previous" className="w-[3vw] h-auto" />
          </button>

          {/* Media Display */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: swipeDirection === "left" ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: swipeDirection === "left" ? -100 : 100 }}
            transition={{ duration: 0.5 }}
            className="h-[90%] w-auto flex justify-center items-center"
          >
            {media[currentIndex].type === "image" ? (
              <img
                src={media[currentIndex].src}
                alt="Selected Story"
                className="h-[95%] w-auto object-cove max-w-[90%] border-accent-green border-[2px]"
                onLoad={handleMediaLoad}
              />
            ) : (
              <video
                controls
                autoPlay
                className="h-[95%] w-auto object-cove max-w-[90%] border-accent-green border-[2px]"
                onLoadedData={handleMediaLoad}
              >
                <source src={media[currentIndex].src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </motion.div>

          {/* Next Button */}
          <button
            onClick={handleNextClick}
            disabled={currentIndex === media.length - 1}
            className={`absolute right-8 cursor-pointer z-50 text-accent-green ${
              currentIndex === media.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <img src={rightArrow} alt="Next" className="w-[3vw] h-auto" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
