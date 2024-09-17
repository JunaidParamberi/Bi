import { Link } from 'react-router-dom';
import mapImg from '../assets/images/Map.svg'
import MapComponent from '../components/Map.tsx';


export function Imeta() {
    return (
        <div className=' inside-glow-imeta w-fit px-[50px] py-[60px] xl:py-[100px] flex flex-col gap-5 rounded-none text-white '>
            <h1 className='text-[40px] xl:text-[80px]'>IMETA</h1>
            <h2 className='text-[16px] xl:text-[40px]'>
                Volunteering work <br />
                Social Entrepreneurs
            </h2>
        </div>
    )
}

function MapPage() {
    return (
      <div className="w-full relative h-[90%] flex flex-col"> {/* Ensure full width and height */}
        <div className=" flex flex-col w-full h-[90%] justify-between"> {/* Full width and height for content */}
          <div>
            <h1 className="text-[40px] font-bold xl:text-[100px]">Location Title</h1>
          </div>
  
          <div className="flex items-center w-full h-full"> {/* Ensure this div takes full height */}
            <div className="absolute bottom-[0%] left-0">
              <Imeta />
            </div>
            
            {/* Replace the img with MapComponent */}

            <Link  relative='path' to='kenya' className=' w-full h-full'>
            <MapComponent />

            </Link>
  
          </div>
        </div>
      </div>
    );
  }
  
  export default MapPage;
  
