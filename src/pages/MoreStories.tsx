
import { useLocation } from "react-router-dom"
import StoryCard from "../components/StoryCard"



function MoreStories() {
  console.log(useLocation())
  return (
    <div className=" h-full w-full">
        <div className="bg-dark-green border-accent-green border-[0.5px] h-full w-full flex justify-center items-center">

          <div className="w-[90%] flex flex-col gap-10">

          <h1 className='text-[40px] font-bold w-full text-left xl:text-[100px] text-white'>More Stories</h1>

          <div className=" flex w-full h-full items-center gap-10">
            <StoryCard/>
            <StoryCard/>
         </div>
          </div>


        </div>
    
      </div>
  )
}

export default MoreStories


{/* <div className=' bg-dark-green border-accent-green border-[0.5px] 
w-full h-[90%] p-[30px] px-[70px] justify-center items-center flex flex-col'>

    <h1 className='text-[40px] font-bold w-full text-left xl:text-[100px] text-white'>More Stories</h1>

    <div className=" flex w-full h-full items-center gap-10">
        <StoryCard/>
        <StoryCard/>
    </div>
</div> */}