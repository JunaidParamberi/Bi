
import { Link, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import logo from '../assets/icons/Logo_Accent Green.svg';
import { useLocation } from 'react-router-dom';
import Button from './Button';

function GeneralLayout() {

    const location = useLocation()


  return (
    <div className=' relative w-full h-screen flex flex-col justify-center items-center'>
        <div className='  w-[90%] h-full flex flex-col justify-between items-center'>
            <div className='w-full flex justify-center items-center flex-col h-[90vh]  '>
                <Outlet /> 
            </div>

        <div className='flex justify-between items-end h-[15vh] py-6 w-[90%] absolute bottom-0 '>
        <div className=' w-[33.3%]'>
      {  
      location.pathname === "/world" &&

        <div className=' flex flex-col gap-3 w-[60%] justify-end'>
          <Link to="more">
          <Button text={"More Stories"} onClick={function (): void {
                      throw new Error('Function not implemented.');
                    } }/>
          </Link>

          <Link to='team'>
          
          <Button text={"SD4G  IMETA Team"} onClick={function (): void {
                    throw new Error('Function not implemented.');
                  } } />
          </Link>
        </div>
        }
        </div>

        <div className='flex-1 flex justify-center w-[33.3%]'>
          <Navbar />
        </div>

        {location.pathname != "/" ?  
       <div className=' w-[33.3%] flex justify-end'> 

           <img src={logo} alt="Logo" className='w-[36%]' />
       </div>
        : 
        <div className=' w-[33.3%]'>
          {/* Empty div for spacing */}
        </div>
    }
                
            </div>
        </div>
    </div>
  );
}

export default GeneralLayout;


