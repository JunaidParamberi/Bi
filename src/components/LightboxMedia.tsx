import { useEffect, useState } from 'react';
import { PuffLoader } from 'react-spinners';

export type LightboxItem = {
  src: string;
  type: 'image' | 'video';
  thumb?: string;
};

interface LightboxMediaProps {
  media: LightboxItem[];
  index: number;
  className: string;
}

// Full-screen media with a real loading state; also warms up the neighbouring items
function LightboxMedia({ media, index, className }: LightboxMediaProps) {
  const item = media[index];
  // Tracking which src finished avoids a race with cached images firing load before an effect runs
  const [readySrc, setReadySrc] = useState<string | null>(null);
  const [buffering, setBuffering] = useState(false);
  const loading = readySrc !== item?.src || buffering;
  const markReady = () => {
    setReadySrc(item.src);
    setBuffering(false);
  };

  useEffect(() => {
    [media[index - 1], media[index + 1]].forEach((neighbour) => {
      if (!neighbour) return;
      const url = neighbour.type === 'image' ? neighbour.src : neighbour.thumb;
      if (url) new Image().src = url;
    });
  }, [media, index]);

  if (!item) return null;

  return (
    <>
      {loading && (
        <div className='absolute inset-0 flex justify-center items-center pointer-events-none'>
          <PuffLoader color='#36d7b7' size={100} />
        </div>
      )}
      {item.type === 'video' ? (
        <video
          key={item.src}
          controls
          autoPlay
          playsInline
          preload='auto'
          poster={item.thumb}
          className={className}
          onCanPlay={markReady}
          onWaiting={() => setBuffering(true)}
          onPlaying={() => setBuffering(false)}
          onError={markReady}
        >
          <source src={item.src} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          key={item.src}
          src={item.src}
          alt='media'
          decoding='async'
          className={className}
          onLoad={markReady}
          onError={markReady}
        />
      )}
    </>
  );
}

export default LightboxMedia;
