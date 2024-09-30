import { useState, useRef, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import { motion } from 'framer-motion';
import { team1, team2 } from '../data/teamData.ts';

interface TeamMember {
  name: string;
  occupation: string;
  image: string;
  des: string;
}

interface CardDetailsProps {
  data: TeamMember;
  classeName: string;
}

const CardDetails: React.FC<CardDetailsProps> = ({ data, classeName }) => {
  const descriptionParts = data.des.split('(');
  return (
    <div className={`${classeName} shadow-2xl top-[-0.6vw] flex flex-col w-full left-[5.2vw] gap-[0.5vw] absolute bg-dark-green border-accent-green border-[0.5px] z-[1000] py-[1.4vw] px-[1vw] text-white`}>

      
      <h1 className='text-[1.1vw] font-semibold'>{data.name}</h1>
      <h2 className='text-[0.7vw] track'>
        {descriptionParts[0]}
        {descriptionParts[1] && (
          <>
            <br />
            {`(${descriptionParts[1]}`}
          </>
        )}
      </h2>
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
      className={`w-[13.7vw] h-[5.3vw] relative flex items-end ${data.name === "" && "opacity-0"} mt-[1vw] cursor-pointer`}
      onClick={onClick}
    >
      {showDetails && <CardDetails data={data} classeName={`${showDetails ? "futuristic-enter" : 'futuristic-exit hidden'}`} />}
      <div className='w-[32%] h-[95%] ml-3 xl:mb-9 xl:ml-6 absolute border-accent-green border-[0.5px] mb-3'>
        <Avatar
          src={data.image}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          variant='square'
        />
      </div>
      <div className='text-left w-full pl-4 flex h-[90%] bg-black bg-opacity-50 justify-center items-center pr-1 border-[#00e47d7f] border-[0.1px]'>
        <div className='w-[38%]' />
        <div className='w-[60%]'>
          <h1 className='text-white text-[0.8vw] font-semibold xl:text-[190%] leading-tight mb-1'>{data.name}</h1>
          <h2 className='text-[0.6vw] font-light leading-tight tracking-normal'>{data.occupation}</h2>
        </div>
      </div>
    </motion.div>
  );
};

const TeamPage: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className='w-full h-full flex justify-center items-center py-6'>
      <div className='bg-dark-green xl:h-[90%] border-accent-green border-[0.5px] w-full h-full flex overflow-hidden justify-center items-center'>
        <div className=' ml-[3vw] relative w-[90%] h-[85%] flex flex-col justify-center items-center'>

          {/* First part of the card */}
          <div className='w-full'>
            <div className='flex flex-col w-[40%] gap-[0.8vw]'>
              <div className='w-full'>
                <TeamCard 
                  data={team1[0]} 
                  onClick={() => setSelectedMember(team1[0])} 
                  showDetails={selectedMember === team1[0]} 
                  seter={setSelectedMember} // Pass the state setter
                />
              </div>
              <div className='flex flex-wrap w-full gap-[0.8vw]'>
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
          <div className='w-full items-end flex justify-between mt-[-4.6vw]'>
            <div className='w-[60%] flex flex-wrap flex-col'>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className='text-[1.5vw] font-bold my-[0.9vw]'
              >
                {team2[0].teamName}
              </motion.h1>
              <div className='flex flex-wrap gap-[0.8vw]'>
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
                className='text-[1.5vw] font-bold my-[0.9vw]'
              >
                {team2[1].teamName}
              </motion.h1>
              <div className='flex flex-wrap gap-[0.8vw]'>
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
  );
};

export default TeamPage;