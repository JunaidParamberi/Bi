import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import playBtn from "../assets/images/play.svg";

import { stories, mediaUrl, type Story } from "../content";
import rightArrow from "../assets/images/chevron-right.svg";
import leftArrow from "../assets/images/chevron-left.svg";
import close from "../assets/images/cancel icon.svg";
import SmartImage from "../components/SmartImage";
import LightboxMedia, { LightboxItem } from "../components/LightboxMedia";
import { useLightbox } from "../hooks/useLightbox";
import { handleRowKeys } from "../hooks/useKeyboard";

export default function StoryPage() {
  const params = useParams();

  // Memoised so the story object is stable between renders
  const data: Story | null = useMemo(
    () => stories.find((item) => item.title === params.title) ?? null,
    [params.title]
  );

  // Combine images and videos for easy navigation
  // src is the full image or HLS playlist for the lightbox; preview is the small slider image
  const media: (LightboxItem & { preview: string })[] = useMemo(
    () =>
      data
        ? [
            ...(data.videos ?? []).map((v) => ({
              type: "video" as const,
              src: mediaUrl(v.src.hls),
              thumb: mediaUrl(v.thumb.full),
              preview: mediaUrl(v.thumb.thumb),
              width: v.src.width,
              height: v.src.height,
            })),
            ...data.images.map((image) => ({
              type: "image" as const,
              src: mediaUrl(image.full),
              preview: mediaUrl(image.thumb),
              width: image.width,
              height: image.height,
            })),
          ]
        : [],
    [data]
  );

  const lightbox = useLightbox(media.length);
  const currentIndex = lightbox.index;
  const swipeDirection = lightbox.direction;

  if (!data) {
    return <h1>Loading</h1>;
  }

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
            <SmartImage
              src={data?.coverImage ? mediaUrl(data.coverImage.full) : ""}
              fetchPriority="high"
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
              <div
                className="flex w-full h-[40%] overflow-x-auto gap-4 custom-scrollbar-y"
                onKeyDown={handleRowKeys}
              >
                {media.map((item, idx) => (
                  <button
                    key={`${item.src}-${idx}`}
                    ref={lightbox.thumbRef(idx)}
                    type="button"
                    data-row-item
                    aria-label={`Open ${item.type === "video" ? "video" : "photo"} ${idx + 1} of ${media.length}`}
                    onClick={() => lightbox.open(idx)}
                    className="thumb-focus relative shrink-0 cursor-zoom-in outline-none"
                  >

                    {item.type === "video" ? (
                      <div className="relative h-full">
                        <SmartImage
                          src={item.preview}
                          loading="lazy"
                          className="min-w-[15vw] h-full object-cover cursor-zoom-in"
                          alt="Video Thumbnail"
                        />
                        <img
                          src={playBtn}
                          alt="Play Button"
                          className="cursor-zoom-in absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[4vw] h-[4vw] bg-[#000000] rounded-full bg-opacity-40"
                        />
                      </div>
                    ) : (
                      <SmartImage
                        src={item.preview}
                        loading="lazy"
                        alt="Story Image"
                        className="min-w-[16.2vw] h-full object-cover cursor-zoom-in"
                      />
                    )}
                  </button>
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
          ref={lightbox.dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Media viewer"
          tabIndex={-1}
          className="fixed inset-0 flex justify-center items-center bg-dark-green z-50 text-accent-green outline-none"
        >
          {/* Close Button */}
          <button
            type="button"
            aria-label="Close (Esc)"
            className="absolute xl:right-20 xl:top-20 right-10 top-10 cursor-pointer"
            onClick={lightbox.close}
          >
            <img src={close} alt="" className="w-[1.5vw] h-auto" />
          </button>

          {/* Prev Button */}
          <button
            onClick={lightbox.prev}
            aria-label="Previous (←)"
            disabled={currentIndex === 0}
            className={`absolute left-8 cursor-pointer z-50 text-accent-green ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <img src={leftArrow} alt="" className="w-[3vw] h-auto" />
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
            <LightboxMedia
              media={media}
              index={currentIndex}
              className="h-[95%] w-auto object-cove max-w-[90%] border-accent-green border-[2px]"
            />
          </motion.div>

          {/* Next Button */}
          <button
            onClick={lightbox.next}
            aria-label="Next (→)"
            disabled={currentIndex === media.length - 1}
            className={`absolute right-8 cursor-pointer z-50 text-accent-green ${
              currentIndex === media.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <img src={rightArrow} alt="" className="w-[3vw] h-auto" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
