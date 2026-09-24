import { useEffect, useRef, useState } from 'react';
import { PuffLoader } from 'react-spinners';

interface HlsVideoProps {
  src: string;
  poster?: string;
  className: string;
  onCanPlay: () => void;
  onWaiting: () => void;
  onPlaying: () => void;
  onError: () => void;
}

// Streams an HLS playlist: hls.js where Media Source Extensions exist, native playback elsewhere (Safari/iOS)
function HlsVideo({ src, poster, className, onCanPlay, onWaiting, onPlaying, onError }: HlsVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let destroyed = false;
    let hls: { destroy: () => void } | undefined;

    import('hls.js').then(({ default: Hls }) => {
      if (destroyed) return;
      if (Hls.isSupported()) {
        const instance = new Hls({ capLevelToPlayerSize: false, startLevel: -1 });
        instance.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) onError();
        });
        instance.loadSource(src);
        instance.attachMedia(video);
        hls = instance;
      } else {
        video.src = src;
      }
    });

    return () => {
      destroyed = true;
      hls?.destroy();
    };
    // callbacks are recreated each render; the stream only needs to reload when src changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <video
      ref={ref}
      controls
      autoPlay
      playsInline
      preload='auto'
      poster={poster}
      className={className}
      onCanPlay={onCanPlay}
      onWaiting={onWaiting}
      onPlaying={onPlaying}
      onError={onError}
    />
  );
}

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
        <HlsVideo
          key={item.src}
          src={item.src}
          poster={item.thumb}
          className={className}
          onCanPlay={markReady}
          onWaiting={() => setBuffering(true)}
          onPlaying={() => setBuffering(false)}
          onError={markReady}
        />
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
