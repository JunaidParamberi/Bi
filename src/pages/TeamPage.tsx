import Avatar from '@mui/material/Avatar';
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
    <div className={`w-[232px] h-[90px] relative flex items-end m-1 ${data.name === "" && "opacity-0"}`}>
      <div className='w-[32%] h-[90%] ml-3 absolute border-accent-green border-[0.5px] mb-3'>
        <Avatar
          src={data.image}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          variant='square'
        />
      </div>
      <div className='p-3 text-left w-full flex h-[80%] bg-black bg-opacity-65 justify-center items-center border-[#00e47d7f] border-[0.1px]'>
        <div className='w-[38%]' />
        <div className='w-[60%]'>
          <h1 className='text-white text-[80%] font-semibold'>{data.name}</h1>
          <h2 className='text-[60%] font-light leading-tight'>{data.occupation}</h2>
        </div>
      </div>
    </div>
  );
};



const TeamPage: React.FC = () => {
  return (
    <div className='w-full h-full flex justify-center items-center py-6'>
      <div className='bg-dark-green border-accent-green border-[0.5px] h-screen w-full max-h-full justify-center items-center p-10 overflow-hidden'>
        <div className='team-1 w-full flex flex-col justify-center items-center'>
          <div className='w-full'>
            <TeamCard data={team1[0]} />
          </div>
          <div className='flex flex-wrap w-full'>
            {team1.slice(1).map((tm, index) => (
              <TeamCard key={index} data={tm} />
            ))}
          </div>
          <div className='w-full h-full justify-between items-end flex mt-6'>
            <div className='w-[70%] flex flex-wrap flex-col'>
              <h1 className='text-2xl font-bold m-2'>{team2[0].teamName}</h1>
              <div className='flex flex-wrap'>
                {team2[0].team.map((item, index) => (
                  <TeamCard key={index} data={item} />
                ))}
              </div>
            </div>
            <div className='w-[45%] flex flex-col flex-wrap'>
              <h1 className='text-2xl font-bold m-2'>{team2[1].teamName}</h1>
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
  );
};

export default TeamPage;