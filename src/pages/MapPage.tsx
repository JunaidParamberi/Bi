import mapImg from '../assets/images/Map.svg'
import MapComponent from '../components/Map.tsx';


export function Imeta() {
    return (
        <div className=' inside-glow-imeta pl-[30px] py-[60px] pr-[80px] flex flex-col gap-5 w-full rounded-none text-white '>
            <h1 className='text-[40.7547px]'>IMETA</h1>
            <h2 className='text-[16px]'>
                Volunteering work <br />
                Social Entrepreneurs
            </h2>
        </div>
    )
}

function MapPage() {
    return (
      <div className="w-full h-full flex flex-col py-[30px]"> {/* Ensure full width and height */}
        <div className="relative flex flex-col w-full h-full"> {/* Full width and height for content */}
          <div>
            <h1 className="text-[40px] font-bold">Location Title</h1>
          </div>
  
          <div className="flex items-center w-full h-full"> {/* Ensure this div takes full height */}
            <div className="absolute top-[40%]">
              <Imeta />
            </div>
            
            {/* Replace the img with MapComponent */}
            <MapComponent />
  
          </div>
        </div>
      </div>
    );
  }
  
  export default MapPage;
  
