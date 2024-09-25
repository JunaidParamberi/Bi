import Avatar from '@mui/material/Avatar';
import { motion } from 'framer-motion';
import { team1, team2 } from '../data/teamData.ts';

interface TeamMember {
  name: string;
  occupation: string;
  image: string;
}

interface TeamCardProps {
  data: TeamMember;
}

export const TeamCard: React.FC<TeamCardProps> = ({ data }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-[13.5vw]  h-[5vw] relative flex items-end  ${data.name === "" && "opacity-0"}`}
    >
      <div className='w-[32%] h-[96%] ml-3 xl:mb-9 xl:ml-6 absolute border-accent-green border-[0.5px]  mb-3'>
        <Avatar
          src={data.image}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          variant='square'
        />
      </div>
      <div className=' text-left w-full pl-4 flex h-[90%] bg-black bg-opacity-50 justify-center items-center border-[#00e47d7f] border-[0.1px]'>
        <div className='w-[38%]' />
        <div className='w-[60%]'>
          <h1 className='text-white text-[0.8vw] font-semibold xl:text-[190%] leading-tight mb-1'>{data.name}</h1>
          <h2 className='text-[0.6vw]  font-light leading-tight tracking-normal '>{data.occupation}</h2>
        </div>
      </div>
    </motion.div>
  );
};

const TeamPage: React.FC = () => {
  return (
    <div className='w-full h-full flex justify-center items-center py-6'>
      <div className='  bg-dark-green xl:h-[90%] border-accent-green border-[0.5px] w-full h-full flex overflow-hidden justify-center items-center'>
        <div className=' relative w-[90%]  h-[85%] flex flex-col justify-center items-center'>

          {/* first parts of the card  */}
          <div className=' w-full   '>
            <div className='flex flex-col w-[40%] gap-5'> 
            <div className='w-full'>
              <TeamCard data={team1[0]} />
            </div>
            <div className='flex flex-wrap w-full gap-5'>
              {team1.slice(1).map((tm, index) => (
                <TeamCard key={index} data={tm} />
              ))}
            </div>
            </div>
          </div>
          

          {/* second two groups of the cards  */}
         
         <div className='w-full items-end flex  justify-between mt-[-4.6vw]  '>
            <div className='w-[60%] flex flex-wrap flex-col'>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              className='text-2xl font-bold my-5 xl:text-6xl xl:mb-14'>{team2[0].teamName}</motion.h1>
              <div className='flex flex-wrap gap-5 '>
                {team2[0].team.map((item, index) => (
                  <TeamCard key={index} data={item} />
                ))}
              </div>
            </div>
            <div className='w-[40%] flex flex-col flex-wrap'>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              className='text-2xl font-bold my-5 xl:text-6xl xl:mb-14'>{team2[1].teamName}</motion.h1>
              <div className='flex flex-wrap gap-5'>
                {team2[1].team.map((item, index) => (
                  <TeamCard key={index} data={item} />
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



