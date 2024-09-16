
import StoryCard from "../components/StoryCard"


function MoreStories() {
  return (
    <div className=' bg-dark-green border-accent-green border-[0.5px] 
    w-full h-[90%] p-[30px] justify-center items-center flex flex-col mb-[30px]'>
 
        <h1 className='text-[40px] font-bold w-full text-left'>More Stories</h1>

        <div className=" flex w-full h-full items-center gap-10">
            <StoryCard/>
            <StoryCard/>
        </div>
    </div>
  )
}

export default MoreStories
