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
      className={`w-[230px] xl:w-[600px] xl:h-[220px] h-[75px] relative flex items-end m-1 ${data.name === "" && "opacity-0"}`}
    >
      <div className='w-[30%] h-[90%] ml-3 xl:mb-9 xl:ml-6 absolute border-accent-green border-[0.5px]  mb-3'>
        <Avatar
          src={data.image}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          variant='square'
        />
      </div>
      <div className='p-3 text-left w-full flex h-[90%] bg-black bg-opacity-50 justify-center items-center border-[#00e47d7f] border-[0.1px]'>
        <div className='w-[38%]' />
        <div className='w-[60%]'>
          <h1 className='text-white text-[80%] font-semibold xl:text-[190%]'>{data.name}</h1>
          <h2 className='text-[60%] xl:text-[110%] font-light leading-tight'>{data.occupation}</h2>
        </div>
      </div>
    </motion.div>
  );
};

const TeamPage: React.FC = () => {
  return (
    <div className='w-full h-full flex justify-center items-center py-6'>
      <div className='bg-dark-green xl:h-[90%] border-accent-green border-[0.5px] w-full h-full flex overflow-hidden justify-center items-center'>
        <div className='  w-[95%] h-[90%] flex justify-center items-center ' >

        <div className='team-1 before:flex flex-col'>
          <div className='flex flex-col w-full'> 
            <div className='w-full'>
              <TeamCard data={team1[0]} />
            </div>
            <div className='flex flex-wrap w-full'>
              {team1.slice(1).map((tm, index) => (
                <TeamCard key={index} data={tm} />
              ))}
            </div>
          </div>
          
          <div className='w-full items-end flex mt-6'>
            <div className='w-[70%] flex flex-wrap flex-col'>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              className='text-2xl font-bold m-2 xl:text-6xl xl:mb-14'>{team2[0].teamName}</motion.h1>
              <div className='flex flex-wrap'>
                {team2[0].team.map((item, index) => (
                  <TeamCard key={index} data={item} />
                ))}
              </div>
            </div>
            <div className='w-[45%] flex flex-col flex-wrap'>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              className='text-2xl font-bold m-2 xl:text-6xl xl:mb-14'>{team2[1].teamName}</motion.h1>
              <div className='flex flex-wrap'>
                {team2[1].team.map((item, index) => (
                  <TeamCard key={index} data={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TeamPage;
