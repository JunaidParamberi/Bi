import StoryCard from "../components/StoryCard";
import { storyData } from '../data/MoreStories';
import { motion } from 'framer-motion';

interface dataTypes {
  id: number;
  title: string;
  text: string;
  coverImage: string;
}

const MoreStories: React.FC = () => {
  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}  // Start below
          animate={{ opacity: 1, y: 0 }}   // Slide in from below
          exit={{ opacity: 0, y: 20 }}     // Slide out below
          transition={{ duration: 0.7, ease: "easeOut" }}
      className="h-full w-full py-6"
    >
      <div className="bg-dark-green border-accent-green flex-col border-[0.5px] h-full w-full flex justify-center items-center py-7">
        <div className="w-[90%] flex flex-col gap-5 justify-between">
          <h1 className="text-[40px] font-bold w-full text-left xl:text-[100px] text-white">More Stories</h1>

          <div className="flex w-full h-full items-center gap-10">
            {storyData.map((data: dataTypes) => (
              <motion.div
                key={data.id}
                initial={{ opacity: 0, y: 20 }}  // Start below
                animate={{ opacity: 1, y: 0 }}   // Slide in from below
                exit={{ opacity: 0, y: 20 }}     // Slide out below
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <StoryCard item={data} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MoreStories;
