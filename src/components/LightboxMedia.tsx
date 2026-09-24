import { useEffect, useRef, useState } from 'react';
import BrandLoader from './BrandLoader';

interface HlsVideoProps {
  src: string;
  poster?: string;
  // small, usually already cached image shown until the full poster has decoded
  posterPreview?: string;
  className: string;
  onCanPlay: () => void;
  onWaiting: () => void;
  onPlaying: () => void;
  onError: () => void;
}

// Streams an HLS playlist: hls.js where Media Source Extensions exist, native playback elsewhere (Safari/iOS)
function HlsVideo({ src, poster, posterPreview, className, onCanPlay, onWaiting, onPlaying, onError }: HlsVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [posterSrc, setPosterSrc] = useState(posterPreview ?? poster);

  useEffect(() => {
    // Swap to the full poster only once it is decoded, so it never paints in from the top
    if (!poster || poster === posterPreview) return;
    let cancelled = false;
    const img = new Image();
    img.src = poster;
    img.decode().then(
      () => !cancelled && setPosterSrc(poster),
      () => undefined
    );
    return () => {
      cancelled = true;
    };
  }, [poster, posterPreview]);

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
      poster={posterSrc}
      className={className}
      onCanPlay={onCanPlay}
      onWaiting={onWaiting}
      onPlaying={onPlaying}
      onError={onError}
    />
  );
}

export type LightboxItem = {
  // full image or HLS playlist
  src: string;
  type: 'image' | 'video';
  // full-size video poster
  thumb?: string;
  // small image already shown in the slider
  preview?: string;
  // intrinsic size, so the frame can be drawn at the right shape before anything loads
  width: number;
  height: number;
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
      if (!url) return;
      const img = new Image();
      img.src = url;
      // decode ahead of time so the next photo appears in one piece
      img.decode().catch(() => undefined);
    });
  }, [media, index]);

  if (!item) return null;

  const ready = readySrc === item.src;

  return (
    // The frame carries the border and the media's real proportions, so it keeps its size
    // and shows a skeleton until the media is ready
    <div
      className={`relative overflow-hidden ${ready ? '' : 'skeleton'} ${className}`}
      style={{ aspectRatio: `${item.width} / ${item.height}` }}
    >
      {item.type === 'video' ? (
        <HlsVideo
          key={item.src}
          src={item.src}
          poster={item.thumb}
          posterPreview={item.preview}
          className='absolute inset-0 w-full h-full object-cover'
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
          // hidden until fully decoded, then faded in, so large photos never paint in from the top
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
          onLoad={(e) => e.currentTarget.decode().then(markReady, markReady)}
          onError={markReady}
        />
      )}
      {loading && (
        <div className='absolute inset-0 flex justify-center items-center pointer-events-none'>
          <BrandLoader />
        </div>
      )}
    </div>
  );
}

export default LightboxMedia;
