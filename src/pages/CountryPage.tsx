import { Key, useMemo, useState } from "react";
import cardImg from "../assets/images/Asset 24.png";
import { motion } from "framer-motion";
import { countries, mediaUrl, type Article } from "../content";
import playBtn from "../assets/images/play.svg";
import rightArrow from "../assets/images/chevron-right.svg";
import leftArrow from "../assets/images/chevron-left.svg";
import close from "../assets/images/cancel icon.svg";
import { useParams } from "react-router-dom";
import SmartImage from "../components/SmartImage";
import LightboxMedia from "../components/LightboxMedia";

type MediaItem = {
  // full-size image or HLS playlist, shown in the lightbox
  src: string;
  type: "image" | "video";
  // small image for the slider
  preview: string;
  // video poster shown before playback
  thumb?: string;
  caption?: string;
};

const CountryPage: React.FC = () => {
  const params = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null
  );
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );

  const currentData = countries.filter(
    (item) => item.country === params.country
  );
  const [data, setData] = useState<Article | null>(
    currentData.length > 0 ? currentData[0].articles[0] : null
  );

  const handleClick = (item: Article) => {
    setData(item);
    setCurrentImageIndex(null);
  };

  const filteredData = countries.filter(
    (item) => item.country === params.country
  );
  const newData = filteredData[0];

  // Combine images and videos into single media array
  const media: MediaItem[] = useMemo(
    () => [
      ...(data?.videos?.map((video) => ({
        src: mediaUrl(video.src.hls),
        type: "video" as "video",
        preview: mediaUrl(video.thumb.thumb),
        thumb: mediaUrl(video.thumb.full),
        caption: video.caption,
      })) || []),
      ...(data?.images?.map((image) => ({
        src: mediaUrl(image.full),
        type: "image" as "image",
        preview: mediaUrl(image.thumb),
      })) || []),
    ],
    [data]
  );

  const handlePrevClick = () => {
    if (currentImageIndex !== null && currentImageIndex > 0) {
      setSwipeDirection("right");
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentImageIndex !== null && currentImageIndex < media.length - 1) {
      setSwipeDirection("left");
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full h-full flex justify-center items-center"
    >
      {/* Modal for full-screen media */}
      {currentImageIndex !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 flex justify-center items-center bg-dark-green z-50 text-accent-green"
        >
          <div
            className="absolute xl:right-20 xl:top-20 right-10 top-10 cursor-pointer"
            onClick={() => setCurrentImageIndex(null)}
          >
            <img src={close} alt="Close" className="w-[1.5vw] h-auto" />
          </div>

          {/* Left arrow */}
          <button
            onClick={handlePrevClick}
            disabled={currentImageIndex === 0}
            className={`absolute left-8 cursor-pointer z-50 text-accent-green ${
              currentImageIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            <img src={leftArrow} alt="Previous" className="w-[3vw] h-auto" />
          </button>

          {/* Media Display */}
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, x: swipeDirection === "left" ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: swipeDirection === "left" ? -100 : 100 }}
            transition={{ duration: 0.5 }}
            className="h-[90%] w-auto flex justify-center items-center"
          >
            <LightboxMedia
              media={media}
              index={currentImageIndex}
              className="h-[95%] w-auto object-cover max-w-[90%] border-accent-green border-[2px]"
            />
          </motion.div>

          {/* Right arrow */}
          <button
            onClick={handleNextClick}
            disabled={currentImageIndex === media.length - 1}
            className={`absolute right-8 cursor-pointer z-50 text-accent-green ${
              currentImageIndex === media.length - 1
                ? "opacity-30 cursor-not-allowed"
                : ""
            }`}
          >
            <img src={rightArrow} alt="Next" className="w-[3vw] h-auto" />
          </button>
        </motion.div>
      )}

      {/* Main content */}
      <div className="bg-dark-green border-accent-green border-[0.5px] w-full flex justify-center items-center h-[90%]">
        <div className="w-[90%] h-[90%] flex justify-between">
          <SmartImage
            key={data?.coverImage?.full || cardImg}
            src={data?.coverImage ? mediaUrl(data.coverImage.full) : cardImg}
            fetchPriority="high"
            alt=""
            className="h-full w-[35%] object-cover"
          />

          <div className="h-full w-[63%] text-[#ffffff81] flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full h-full flex flex-col justify-items-end items-baseline"
            >
              <h1 className="text-[2.8vw] font-bold w-full text-left text-white my-4">
                {newData.country}
              </h1>

              <div className="flex w-full items-end gap-2">
                {newData.articles.map((item: Article, index: Key) => (
                  <motion.button
                    key={index}
                    onClick={() => handleClick(item)}
                    className={`${
                      data?.heading === item.heading
                        ? "bg-accent-green text-dark-green px-[0.8vw] py-[0.4vw] font-semibold text-[1vw]"
                        : "bg-black text-white text-[0.9vw] px-[0.8vw] py-[0.7%] font-semibold bg-opacity-20"
                    }`}
                  >
                    {item.heading}
                  </motion.button>
                ))}
              </div>

              <div
                className={`border-accent-green w-full border-[0.5px] ${
                  data?.images || data?.videos
                    ? "min-h-[57%] max-h-[57%]"
                    : "h-full"
                } max-w-full flex justify-center items-center mb-3`}
              >
                <div className="overflow-y-auto custom-scrollbar h-[80%] w-[95%] xl:text-[40px] flex flex-col gap-[1vw]">
                  <p className="text-white text-[1vw] xl:text-[0.9vw] p-[0.3vw] whitespace-pre-line">
                    {data?.article}
                  </p>

                  <div className="flex flex-col gap-[1vw] text-[1vw] xl:text-[0.9vw] text-white p-[0.3vw]">
                    {data?.lists?.map((ul: any, index: Key) => (
                      <div key={index} className="flex flex-col gap-[0.5vw]">
                        {ul.listHead && (
                          <h3 className="font-semibold">{ul.listHead} :</h3>
                        )}
                        <ul className="flex flex-col font-extralight px-[2vw] gap-[0.7vw] list-disc">
                          {ul.listPoints.map((li: any, liIndex: Key) => (
                            <li key={liIndex}>{li}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {data?.subArticles && data.subArticles.length > 0 && (
                    <div className="flex flex-col gap-[1vw] text-[1vw] xl:text-[0.9vw] text-white p-[0.3vw]">
                      {data.subArticles.map((subArticle, index) => (
                        <div key={index} className="flex flex-col gap-[0.5vw]">
                          <h3 className="font-semibold">
                            {subArticle.heading}
                          </h3>
                          <p>{subArticle.article}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Media Slider */}
              {(data?.images || data?.videos) && (
                <div className="flex w-full h-full overflow-x-auto gap-4 custom-scrollbar-y">
                  {media.map((item: MediaItem, index: number) => (
                    <div key={`${item.src}-${index}`} className="relative">

                      {item.type === "video" ? (
                        <div className="relative h-full">
                          <SmartImage
                            onClick={() => setCurrentImageIndex(index)}
                            src={item.preview}
                            loading="lazy"
                            className="min-w-[15vw] h-full object-cover cursor-zoom-in"
                            alt="Video Thumbnail"
                          />
                          <img
                            src={playBtn}
                            onClick={() => setCurrentImageIndex(index)}
                            alt="Play Button"
                            className="cursor-zoom-in absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[4vw] h-[4vw] bg-[#000000] rounded-full bg-opacity-40"
                          />
                        </div>
                      ) : (
                        <SmartImage
                          onClick={() => setCurrentImageIndex(index)}
                          src={item.preview}
                          loading="lazy"
                          alt="Image"
                          className="min-w-[16.2vw] h-full object-cover cursor-zoom-in"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CountryPage;
