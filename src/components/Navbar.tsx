import Arrowleft from "../assets/icons/arrow_left.svg"
import ArrowRight from "../assets/icons/arrow_right.svg"
import Home from "../assets/icons/home.svg"
import Globe from "../assets/icons/globe.svg"
import More from "../assets/icons/more.svg"

function Navbar() {
  return (
    <div className=" m-4">

    <div className=" gradient-border bg-[#000000] flex px-[40px] py-2
    w-fit gap-16 rounded-full items-center justify-center ">
      <img src={Arrowleft} alt="arrow-left"
      className=" w-[25px] h-[25px] g"
      />
      <div className=" flex justify-center items-center gap-12">

      <div className="  p-2">
      <img src={More} alt="more"
      className=" w-[25px] h-[25px]"
      />
      </div>

    <div className="icon-gradient-border p-2  ">
        <img src={Globe} alt="globe" className="w-[25px] h-[25px]" />
      </div>

      <div className="  p-2">
      <img src={Home} alt="home" 
      className=" w-[25px] h-[25px]"
      />
      </div>
      </div>
      <img src={ArrowRight} alt="arrow-right" 
      className=" w-[25px] h-[25px]"
      />
    </div>

    
</div>
  )
}

export default Navbar
