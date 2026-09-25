import { useState, useRef, useEffect, createContext, useContext, RefObject } from 'react';
import { useKeyboard } from '../hooks/useKeyboard';
import { AnimatePresence, motion } from 'framer-motion';
import { useFitInViewport } from '../hooks/useFitInViewport';
import { team1, team2, mediaUrl, type TeamMember } from '../content';
import SmartImage from '../components/SmartImage';

// The team panel clips its overflow, so detail popups are kept inside it
const PanelContext = createContext<RefObject<HTMLDivElement | null> | undefined>(undefined);

const detailVariants = {
  hidden: { opacity: 0, scale: 0.85, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], when: 'beforeChildren', staggerChildren: 0.06 },
  },
  exit: { opacity: 0, scale: 0.92, filter: 'blur(4px)', transition: { duration: 0.18, ease: 'easeIn' } },
} as const;

const lineVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
} as const;

const CardDetails: React.FC<{ data: TeamMember }> = ({ data }) => {
  const descriptionParts = data.des.split('(');
  const boxRef = useRef<HTMLDivElement | null>(null);
  const fit = useFitInViewport(boxRef, { within: useContext(PanelContext) });
  return (
    // Unscaled box used for measuring; the motion child inside does the animating
    <div
      ref={boxRef}
      className='top-[-0.6cqw] w-full left-[5.2cqw] absolute z-1000'
      style={{ transform: `translate(${fit.x}px, ${fit.y}px)` }}
    >
    <motion.div
      variants={detailVariants}
      initial='hidden'
      animate='show'
      exit='exit'
      style={{ transformOrigin: 'left top' }}
      className='shadow-2xl flex flex-col gap-[0.5cqw] bg-dark-green border-accent-green border-(length:--line-hair) py-[1.4cqw] px-[1cqw] text-white'
    >
      <motion.h1 variants={lineVariants} className='text-[1.1cqw] font-semibold'>{data.name}</motion.h1>
      <motion.h2 variants={lineVariants} className='text-[0.7cqw] track'>
        {descriptionParts[0]}
        {descriptionParts[1] && (
          <>
            <br />
            {`(${descriptionParts[1]}`}
          </>
        )}
      </motion.h2>
    </motion.div>
    </div>
  );
};

interface TeamCardProps {
  data: TeamMember;
  onClick: () => void;
  showDetails: boolean;
  seter: (member: TeamMember | null) => void; // Updated to receive the setter
}

const TeamCard: React.FC<TeamCardProps> = ({ data, onClick, showDetails, seter }) => {
  const teamContainerRef = useRef<HTMLDivElement | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = !!data.image && !imageFailed;
  const [photoLoaded, setPhotoLoaded] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (teamContainerRef.current && !teamContainerRef.current.contains(event.target as Node)) {
      seter(null); // Set selected member to null if clicked outside
    }
  };

  useEffect(() => {
    // Attach event listener for clicks outside the card
    document.addEventListener('mouseup', handleClickOutside);
    
    // Cleanup listener on unmount
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      ref={teamContainerRef} // Attach ref here
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-[13.7cqw] h-[5.3cqw] relative flex items-end ${data.name === "" && "opacity-0"} mt-[1cqw] cursor-pointer`}
      onClick={onClick}
    >
      <AnimatePresence>{showDetails && <CardDetails data={data} />}</AnimatePresence>
      <div className='w-[32%] h-[95%] ml-3 xl:mb-9 xl:ml-6 absolute border-accent-green border-(length:--line-hair) mb-3'>
        <div className={`w-full h-full overflow-hidden flex justify-center items-center ${showPhoto ? (photoLoaded ? '' : 'skeleton') : 'bg-[#bdbdbd] text-white'}`}>
          {showPhoto ? (
            // The wrapper keeps the skeleton until the photo has loaded, so the box is never empty while it fades in
            <SmartImage src={data.image ? mediaUrl(data.image.thumb) : ''} alt={data.name} loading='lazy' className='w-full h-full object-cover' onLoad={() => setPhotoLoaded(true)} onError={() => setImageFailed(true)} />
          ) : (
            // Same placeholder MUI Avatar showed for members without a photo
            <svg viewBox='0 0 24 24' aria-hidden='true' fill='currentColor' className='w-[75%] h-[75%]'>
              <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4' />
            </svg>
          )}
        </div>
      </div>
      <div className='text-left w-full pl-4 flex h-[90%] bg-black/50 justify-center items-center pr-1 border-[#00e47d7f] border-(length:--line-hair)'>
        <div className='w-[38%]' />
        <div className='w-[60%]'>
          <h1 className='text-white text-[0.8cqw] font-semibold xl:text-[190%] leading-tight mb-1'>{data.name}</h1>
          <h2 className='text-[0.6cqw] font-light leading-tight tracking-normal'>{data.occupation}</h2>
        </div>
      </div>
    </motion.div>
  );
};

const TeamPage: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  useKeyboard({ Escape: () => setSelectedMember(null) }, selectedMember !== null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  return (
    <PanelContext.Provider value={panelRef}>
    <div className='w-full h-full flex justify-center items-center py-6'>
      <div ref={panelRef} className='bg-dark-green xl:h-[90%] border-accent-green border-(length:--line-hair) w-full h-full flex overflow-hidden justify-center items-center'>
        <div className=' ml-[3cqw] relative w-[90%] h-[85%] flex flex-col justify-center items-center'>

          {/* First part of the card */}
          <div className='w-full'>
            <div className='flex flex-col w-[40%] gap-[0.8cqw]'>
              <div className='w-full'>
                <TeamCard 
                  data={team1[0]} 
                  onClick={() => setSelectedMember(team1[0])} 
                  showDetails={selectedMember === team1[0]} 
                  seter={setSelectedMember} // Pass the state setter
                />
              </div>
              <div className='flex flex-wrap w-full gap-[0.8cqw]'>
                {team1.slice(1).map((tm, index) => (
                  <TeamCard 
                    key={index} 
                    data={tm} 
                    onClick={() => setSelectedMember(tm)} 
                    showDetails={selectedMember === tm} 
                    seter={setSelectedMember} // Pass the state setter
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Second two groups of cards */}
          <div className='w-full items-end flex justify-between mt-[-4.6cqw]'>
            <div className='w-[60%] flex flex-wrap flex-col'>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className='text-[1.5cqw] font-bold my-[0.9cqw]'
              >
                {team2[0].teamName}
              </motion.h1>
              <div className='flex flex-wrap gap-[0.8cqw]'>
                {team2[0].team.map((item, index) => (
                  <TeamCard 
                    key={index} 
                    data={item} 
                    onClick={() => setSelectedMember(item)} 
                    showDetails={selectedMember === item} 
                    seter={setSelectedMember} // Pass the state setter
                  />
                ))}
              </div>
            </div>
            <div className='w-[40%] flex flex-col flex-wrap'>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className='text-[1.5cqw] font-bold my-[0.9cqw]'
              >
                {team2[1].teamName}
              </motion.h1>
              <div className='flex flex-wrap gap-[0.8cqw]'>
                {team2[1].team.map((item, index) => (
                  <TeamCard 
                    key={index} 
                    data={item} 
                    onClick={() => setSelectedMember(item)} 
                    showDetails={selectedMember === item} 
                    seter={setSelectedMember} // Pass the state setter
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PanelContext.Provider>
  );
};

export default TeamPage;