import { Key, useMemo, useState } from "react";
import cardImg from "../assets/images/Asset 24.png";
import { AnimatePresence, motion } from "framer-motion";
import { countries, mediaUrl, type Article } from "../content";
import playBtn from "../assets/images/play.svg";
import rightArrow from "../assets/images/chevron-right.svg";
import leftArrow from "../assets/images/chevron-left.svg";
import close from "../assets/images/cancel icon.svg";
import { useParams } from "react-router-dom";
import SmartImage from "../components/SmartImage";
import LightboxMedia from "../components/LightboxMedia";
import { useLightbox } from "../hooks/useLightbox";
import { handleRowKeys } from "../hooks/useKeyboard";

type MediaItem = {
  // full-size image or HLS playlist, shown in the lightbox
  src: string;
  type: "image" | "video";
  // small image for the slider
  preview: string;
  // video poster shown before playback
  thumb?: string;
  caption?: string;
  width: number;
  height: number;
};

const CountryPage: React.FC = () => {
  const params = useParams();
  const currentData = countries.filter(
    (item) => item.country === params.country
  );
  const [data, setData] = useState<Article | null>(
    currentData.length > 0 ? currentData[0].articles[0] : null
  );

  const handleClick = (item: Article) => {
    setData(item);
    lightbox.close();
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
        width: video.src.width,
        height: video.src.height,
      })) || []),
      ...(data?.images?.map((image) => ({
        src: mediaUrl(image.full),
        type: "image" as "image",
        preview: mediaUrl(image.thumb),
        width: image.width,
        height: image.height,
      })) || []),
    ],
    [data]
  );

  const lightbox = useLightbox(media.length);
  const currentImageIndex = lightbox.index;
  const swipeDirection = lightbox.direction;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full h-full flex justify-center items-center"
    >
      {/* Modal for full-screen media */}
      <AnimatePresence>
      {currentImageIndex !== null && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.3, delay: 0.1 } }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          ref={lightbox.dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Media viewer"
          tabIndex={-1}
          className="fixed inset-0 flex justify-center items-center bg-dark-green/95 z-50 text-accent-green outline-hidden"
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest("[data-lightbox-frame], button")) lightbox.close();
          }}
        >
          <motion.button
            type="button"
            aria-label="Close (Esc)"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0, transition: { duration: 0.4, delay: 0.15 } }}
            exit={{ opacity: 0, rotate: -90, transition: { duration: 0.2 } }}
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            // Big round hit area around the thin icon; negative margin keeps the icon where it was
            className="absolute xl:right-20 xl:top-20 right-10 top-10 cursor-pointer p-[1.2cqw] -m-[1.2cqw] rounded-full hover:bg-white/10 transition-colors"
            onClick={lightbox.close}
          >
            <img src={close} alt="" className="w-[1.5cqw] h-auto" />
          </motion.button>

          {/* Left arrow */}
          <button
            onClick={lightbox.prev}
            aria-label="Previous (←)"
            disabled={currentImageIndex === 0}
            className={`absolute left-8 cursor-pointer z-50 text-accent-green p-[1cqw] -m-[1cqw] rounded-full hover:bg-white/10 transition-colors ${
              currentImageIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            <img src={leftArrow} alt="" className="w-[3cqw] h-auto" />
          </button>

          {/* Media Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, scale: 0.94, y: 24, filter: "blur(8px)", transition: { duration: 0.25, ease: "easeIn" } }}
            className="h-[90%] w-full flex justify-center items-center"
          >
          <motion.div
            key={currentImageIndex}
            initial={swipeDirection ? { opacity: 0, x: swipeDirection === "left" ? 100 : -100 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: swipeDirection === "left" ? -100 : 100 }}
            transition={{ duration: 0.5 }}
            className="h-full w-auto flex justify-center items-center"
          >
            <LightboxMedia
              media={media}
              index={currentImageIndex}
              className="w-auto border-accent-green border-(length:--line-2)"
            />
          </motion.div>
          </motion.div>

          {/* Right arrow */}
          <button
            onClick={lightbox.next}
            aria-label="Next (→)"
            disabled={currentImageIndex === media.length - 1}
            className={`absolute right-8 cursor-pointer z-50 text-accent-green p-[1cqw] -m-[1cqw] rounded-full hover:bg-white/10 transition-colors ${
              currentImageIndex === media.length - 1
                ? "opacity-30 cursor-not-allowed"
                : ""
            }`}
          >
            <img src={rightArrow} alt="" className="w-[3cqw] h-auto" />
          </button>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Main content */}
      <div className="bg-dark-green border-accent-green border-(length:--line-hair) w-full flex justify-center items-center h-[90%]">
        <div className="w-[90%] h-[90%] flex justify-between">
          <div className="relative h-full w-[35%] overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={data?.coverImage?.full || cardImg}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <SmartImage
                  src={data?.coverImage ? mediaUrl(data.coverImage.full) : cardImg}
                  fetchPriority="high"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="h-full w-[63%] text-[#ffffff81] flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full h-full flex flex-col justify-items-end items-baseline"
            >
              <h1 className="text-[2.8cqw] font-bold w-full text-left text-white my-4">
                {newData.country}
              </h1>

              <div className="flex w-full items-end">
                {newData.articles.map((item: Article, index: number) => (
                  <motion.button
                    key={index}
                    onClick={() => handleClick(item)}
                    className={`relative font-semibold px-[0.8cqw] transition-[color,font-size,padding] duration-300 ease-out ${
                      data?.heading === item.heading
                        ? "text-dark-green py-[0.4cqw] text-[1cqw]"
                        : "text-white text-[0.9cqw] py-[0.7%] bg-black/20 hover:text-accent-green"
                    }${
                      // thin divider between two neighbouring inactive tabs
                      index > 0 &&
                      data?.heading !== item.heading &&
                      data?.heading !== newData.articles[index - 1].heading
                        ? " before:absolute before:left-0 before:top-1/4 before:h-1/2 before:w-px before:bg-white/30"
                        : ""
                    }`}
                  >
                    {data?.heading === item.heading && (
                      <motion.span
                        layoutId="activeArticleTab"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        className="absolute inset-0 bg-accent-green"
                      />
                    )}
                    <span className="relative">{item.heading}</span>
                  </motion.button>
                ))}
              </div>

              {/* Grows to full height when the article has no media row below it */}
              <motion.div
                initial={false}
                animate={
                  data?.images || data?.videos
                    ? { height: "57%", minHeight: "57%" }
                    : { height: "100%", minHeight: "0%" }
                }
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="border-accent-green w-full border-(length:--line-hair) max-w-full flex justify-center items-center mb-3"
              >
                <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={data?.heading}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-y-auto custom-scrollbar h-[80%] w-[95%] xl:text-[40px] flex flex-col gap-[1cqw]"
                >
                  <p className="text-white text-[1cqw] xl:text-[0.9cqw] p-[0.3cqw] whitespace-pre-line">
                    {data?.article}
                  </p>

                  <div className="flex flex-col gap-[1cqw] text-[1cqw] xl:text-[0.9cqw] text-white p-[0.3cqw]">
                    {data?.lists?.map((ul: any, index: Key) => (
                      <div key={index} className="flex flex-col gap-[0.5cqw]">
                        {ul.listHead && (
                          <h3 className="font-semibold">{ul.listHead} :</h3>
                        )}
                        <ul className="flex flex-col font-extralight px-[2cqw] gap-[0.7cqw] list-disc">
                          {ul.listPoints.map((li: any, liIndex: Key) => (
                            <li key={liIndex}>{li}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {data?.subArticles && data.subArticles.length > 0 && (
                    <div className="flex flex-col gap-[1cqw] text-[1cqw] xl:text-[0.9cqw] text-white p-[0.3cqw]">
                      {data.subArticles.map((subArticle, index) => (
                        <div key={index} className="flex flex-col gap-[0.5cqw]">
                          <h3 className="font-semibold">
                            {subArticle.heading}
                          </h3>
                          <p>{subArticle.article}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Media Slider */}
              <AnimatePresence mode="wait" initial={false}>
              {(data?.images || data?.videos) && (
                <motion.div
                  key={data?.heading}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  className="flex w-full h-full overflow-x-auto gap-4 custom-scrollbar-y"
                  onKeyDown={handleRowKeys}
                >
                  {media.map((item: MediaItem, index: number) => (
                    <motion.button
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut", delay: Math.min(index, 6) * 0.05 }}
                      key={`${item.src}-${index}`}
                      ref={lightbox.thumbRef(index)}
                      type="button"
                      data-row-item
                      aria-label={`Open ${item.type === "video" ? "video" : "photo"} ${index + 1} of ${media.length}`}
                      onClick={() => lightbox.open(index)}
                      className="thumb-focus relative shrink-0 cursor-zoom-in outline-hidden"
                    >

                      {item.type === "video" ? (
                        <div className="relative h-full">
                          <SmartImage
                            src={item.preview}
                            loading="lazy"
                            className="min-w-[15cqw] h-full object-cover cursor-zoom-in"
                            alt="Video Thumbnail"
                          />
                          <img
                            src={playBtn}
                            alt="Play Button"
                            className="cursor-zoom-in absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[4cqw] h-[4cqw] bg-black/40 rounded-full"
                          />
                        </div>
                      ) : (
                        <SmartImage
                          src={item.preview}
                          loading="lazy"
                          alt="Image"
                          className="min-w-[16.2cqw] h-full object-cover cursor-zoom-in"
                        />
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CountryPage;
