import { Link } from 'react-router-dom';

interface DataType {
  id: number;
  title: string;
  text: string;
  coverImage: string;
}

interface StoryCardProps {
  item: DataType;
}

function StoryCard({ item }: StoryCardProps) {
  return (
    <div className="w-full flex flex-col gap-4 xl:gap-16">
      <img
        src={item.coverImage}
        alt={item.title}
        className="h-[35vh] min-w-full object-cover"
      />

      <div className="flex flex-col gap-5 xl:gap-16">
        <h2 className="text-2xl xl:text-[60px]">{item.title}</h2>

        {/* Use the line-clamp utility to limit text to 3 lines */}
        <p className="text-sm xl:text-[35px]  text-white xl:leading-[1.2] line-clamp-3 ">
          {item.text}
        </p>

        <div>
          <Link
            relative="path"
            to={item.title}
            state={item}
            className="px-6 xl:px-10 xl:py-4 py-2 text-[14px] xl:text-[35px] border-accent-green border-[1px] hover:bg-accent-green hover:text-dark-green active:opacity-70 duration-200 transition-all"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StoryCard;