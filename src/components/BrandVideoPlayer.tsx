import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

interface BrandVideoPlayerProps {
  src: string;
  poster?: string;
  // small, usually already cached image shown until the full poster has decoded
  posterPreview?: string;
  className?: string;
  onCanPlay?: () => void;
  onWaiting?: () => void;
  onPlaying?: () => void;
  onError?: () => void;
}

type QualityLevel = { index: number; height: number };
type HlsHandle = { destroy: () => void; currentLevel: number; autoLevelEnabled: boolean };

const HIDE_CONTROLS_AFTER = 2500;
const SEEK_STEP = 5;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const s = Math.floor(seconds % 60);
  const m = Math.floor(seconds / 60) % 60;
  const h = Math.floor(seconds / 3600);
  const ss = s.toString().padStart(2, '0');
  return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

// BI brand icon set: 24px grid, 1-unit outlines. Play and pause come from the brand library;
// the rest are drawn to the same grid and line weight so the bar reads as one family
const RING =
  'M12,2C6.4858398,2,2,6.4858398,2,12c0,5.5136719,4.4858398,10,10,10,5.5136719,0,10-4.4863281,10-10,0-5.5141602-4.4863281-10-10-10Zm0,19c-4.9624023,0-9-4.0371094-9-9C3,7.0375977,7.0375977,3,12,3c4.9628906,0,9,4.0375977,9,9,0,4.9628906-4.0371094,9-9,9Z';

const Icon = {
  play: (
    <>
      <path d={RING} fillRule='evenodd' />
      <path
        fillRule='evenodd'
        d='M15.8012085,10.694397l-5.855835-2.8528442-1.4453735,.6191406v6.5112915l1.5775757,1.1865234,5.7236328-2.7885132c1.1151733-.543335,1.1151733-2.1323242,0-2.6755981Zm-.4379272,1.7766113l-5.8632812,2.8789673v-6.7000122l5.8632812,2.9434204c.3657837,.1782227,.3657837,.6994019,0,.8776245Z'
      />
    </>
  ),
  pause: (
    <>
      <path d={RING} fillRule='evenodd' />
      <rect x='9.161' y='7.842' width='1' height='8.315' />
      <rect x='13.839' y='7.842' width='1' height='8.315' />
    </>
  ),
  volume: (
    <g fill='none' stroke='currentColor' strokeWidth='1'>
      <path d='M3.5 9.5h3.2l4.8-4v13l-4.8-4H3.5z' strokeLinejoin='round' />
      <path d='M14.8 9.2a4 4 0 0 1 0 5.6M17.3 6.7a7.5 7.5 0 0 1 0 10.6' strokeLinecap='round' />
    </g>
  ),
  muted: (
    <g fill='none' stroke='currentColor' strokeWidth='1'>
      <path d='M3.5 9.5h3.2l4.8-4v13l-4.8-4H3.5z' strokeLinejoin='round' />
      <path d='M15.5 9.5l5 5M20.5 9.5l-5 5' strokeLinecap='round' />
    </g>
  ),
  enterFullscreen: (
    <path d='M3.5 8.5v-5h5M15.5 3.5h5v5M20.5 15.5v5h-5M8.5 20.5h-5v-5' fill='none' stroke='currentColor' strokeWidth='1' />
  ),
  exitFullscreen: (
    <path d='M8.5 3.5v5h-5M20.5 8.5h-5v-5M15.5 20.5v-5h5M3.5 15.5h5v5' fill='none' stroke='currentColor' strokeWidth='1' />
  ),
  settings: (
    <g fill='none' stroke='currentColor' strokeWidth='1'>
      <path d='M3.5 7h8M15.5 7h5M3.5 12h3M10.5 12h10M3.5 17h10M17.5 17h3' />
      <circle cx='13.5' cy='7' r='2' />
      <circle cx='8.5' cy='12' r='2' />
      <circle cx='15.5' cy='17' r='2' />
    </g>
  ),
};

function ControlIcon({ children, viewBox = '0 0 24 24' }: { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} className='w-full h-full' fill='currentColor' aria-hidden='true'>
      {children}
    </svg>
  );
}

// Branded HLS player: hls.js where Media Source Extensions exist, native playback elsewhere
// (Safari/iOS), with custom controls in the BI palette instead of the browser's own
function BrandVideoPlayer({ src, poster, posterPreview, className = '', onCanPlay, onWaiting, onPlaying, onError }: BrandVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<HlsHandle>();
  const hideTimer = useRef<number>();

  const [posterSrc, setPosterSrc] = useState(posterPreview ?? poster);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  // centre play button stays hidden while the lightbox's loader is showing
  const [ready, setReady] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);
  const [hover, setHover] = useState<{ x: number; time: number } | null>(null);
  const [levels, setLevels] = useState<QualityLevel[]>([]);
  const [activeLevel, setActiveLevel] = useState(-1);
  const [autoLevel, setAutoLevel] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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
    const video = videoRef.current;
    if (!video) return;
    let destroyed = false;

    import('hls.js').then(({ default: Hls }) => {
      if (destroyed) return;
      if (Hls.isSupported()) {
        const instance = new Hls({ capLevelToPlayerSize: false, startLevel: -1 });
        instance.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) onError?.();
        });
        instance.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
          setLevels(
            data.levels
              .map((level, index) => ({ index, height: level.height }))
              .filter((level) => level.height > 0)
              .sort((a, b) => b.height - a.height)
          );
        });
        instance.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => setActiveLevel(data.level));
        instance.loadSource(src);
        instance.attachMedia(video);
        hlsRef.current = instance;
      } else {
        video.src = src;
      }
    });

    return () => {
      destroyed = true;
      hlsRef.current?.destroy();
      hlsRef.current = undefined;
    };
    // callbacks are recreated each render; the stream only needs to reload when src changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  // Show the controls, then fade them out again after a moment of inactivity while playing
  const revealControls = useCallback(() => {
    setControlsVisible(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setControlsVisible(false);
        setMenuOpen(false);
      }
    }, HIDE_CONTROLS_AFTER);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) video.play().catch(() => undefined);
    else video.pause();
    revealControls();
  }, [revealControls]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) video.volume = 0.5;
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!container) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
    else if (container.requestFullscreen) container.requestFullscreen().catch(() => undefined);
    // iOS Safari only allows the video element itself to go full screen
    else video?.webkitEnterFullscreen?.();
  }, []);

  const seekBy = useCallback((delta: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.min(Math.max(video.currentTime + delta, 0), video.duration);
  }, []);

  const selectLevel = (index: number) => {
    const hls = hlsRef.current;
    if (!hls) return;
    // -1 hands quality back to adaptive bitrate
    hls.currentLevel = index;
    setAutoLevel(index === -1);
    setMenuOpen(false);
  };

  const timeAt = (clientX: number) => {
    const track = trackRef.current;
    if (!track || !duration) return { x: 0, time: 0 };
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    return { x: ratio * rect.width, time: ratio * duration };
  };

  const onTrackPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setScrubbing(true);
    const { time } = timeAt(e.clientX);
    videoRef.current.currentTime = time;
    setCurrent(time);
  };

  const onTrackPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const point = timeAt(e.clientX);
    setHover(point);
    if (scrubbing && videoRef.current) {
      videoRef.current.currentTime = point.time;
      setCurrent(point.time);
    }
    revealControls();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const video = videoRef.current;
    if (!video) return;
    switch (e.key) {
      case ' ':
      case 'k':
        togglePlay();
        break;
      case 'ArrowRight':
        seekBy(SEEK_STEP);
        break;
      case 'ArrowLeft':
        seekBy(-SEEK_STEP);
        break;
      case 'l':
        seekBy(SEEK_STEP * 2);
        break;
      case 'j':
        seekBy(-SEEK_STEP * 2);
        break;
      case 'Home':
        seekBy(-Infinity);
        break;
      case 'End':
        seekBy(Infinity);
        break;
      case 'ArrowUp':
        video.volume = Math.min(video.volume + 0.1, 1);
        video.muted = false;
        break;
      case 'ArrowDown':
        video.volume = Math.max(video.volume - 0.1, 0);
        break;
      case 'm':
        toggleMute();
        break;
      case 'f':
        toggleFullscreen();
        break;
      default:
        return;
    }
    // keep the page from scrolling or reacting to keys the player has used
    e.preventDefault();
    e.stopPropagation();
    revealControls();
  };

  const updateBuffered = () => {
    const video = videoRef.current;
    if (!video || !video.buffered.length) return;
    // the buffered range that contains the playhead is the one worth drawing
    for (let i = 0; i < video.buffered.length; i++) {
      if (video.buffered.start(i) <= video.currentTime + 0.5) setBuffered(video.buffered.end(i));
    }
  };

  const progress = duration ? (current / duration) * 100 : 0;
  const bufferedPct = duration ? Math.min((buffered / duration) * 100, 100) : 0;
  const showControls = controlsVisible || !playing || scrubbing || menuOpen;
  const effectiveVolume = muted ? 0 : volume;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role='region'
      aria-label='Video player'
      className={`brand-player group/player bg-dark-green outline-none focus-visible:ring-2 focus-visible:ring-accent-green ${
        showControls ? '' : 'cursor-none'
      } ${className}`}
      onPointerMove={revealControls}
      onPointerLeave={() => playing && !scrubbing && !menuOpen && setControlsVisible(false)}
      onKeyDown={onKeyDown}
      // clicks inside the player must not reach lightbox handlers behind it
      onClick={(e) => e.stopPropagation()}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        preload='auto'
        poster={posterSrc}
        className={`absolute inset-0 w-full h-full ${fullscreen ? 'object-contain' : 'object-cover'}`}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onCanPlay={() => {
          setReady(true);
          onCanPlay?.();
        }}
        onWaiting={() => {
          setWaiting(true);
          onWaiting?.();
        }}
        onPlaying={() => {
          setStarted(true);
          setWaiting(false);
          onPlaying?.();
        }}
        onError={() => {
          setReady(true);
          onError?.();
        }}
        onPlay={() => {
          setPlaying(true);
          revealControls();
        }}
        onPause={() => {
          setPlaying(false);
          setControlsVisible(true);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          if (!scrubbing) setCurrent(e.currentTarget.currentTime);
          updateBuffered();
        }}
        onProgress={updateBuffered}
        onVolumeChange={(e) => {
          setVolume(e.currentTarget.volume);
          setMuted(e.currentTarget.muted);
        }}
      />

      {/* Large centre play button while paused */}
      <button
        type='button'
        aria-label='Play'
        tabIndex={-1}
        onClick={togglePlay}
        // the icon's own ring is the button's edge, so the disc behind it is cropped to the ring
        className={`absolute inset-0 m-auto w-[clamp(4rem,7vw,9rem)] aspect-square rounded-full
          bg-dark-green/60 text-accent-green backdrop-blur-sm
          transition-all duration-300 hover:bg-accent-green hover:text-dark-green hover:scale-105 ${
            playing || !ready || waiting ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
          }`}
      >
        <ControlIcon viewBox='2 2 20 20'>{Icon.play}</ControlIcon>
      </button>

      {/* Control bar */}
      <div
        className={`absolute inset-x-0 bottom-0 pt-16 pb-3 px-4 xl:px-8 xl:pb-6 bg-gradient-to-t from-dark-green via-dark-green/70 to-transparent
          transition-opacity duration-300 ${showControls && (started || !playing) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Seek bar */}
        <div
          ref={trackRef}
          role='slider'
          aria-label='Seek'
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(current)}
          aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
          className='group/seek relative h-4 xl:h-8 flex items-center cursor-pointer touch-none'
          onPointerDown={onTrackPointerDown}
          onPointerMove={onTrackPointerMove}
          onPointerUp={() => setScrubbing(false)}
          onPointerCancel={() => setScrubbing(false)}
          onPointerLeave={() => setHover(null)}
        >
          <div className='relative w-full h-[3px] xl:h-[6px] group-hover/seek:h-[5px] xl:group-hover/seek:h-[10px] transition-[height] duration-150 bg-warm-gray/25 rounded-full overflow-hidden'>
            <div className='absolute inset-y-0 left-0 bg-warm-gray/40' style={{ width: `${bufferedPct}%` }} />
            <div className='absolute inset-y-0 left-0 bg-accent-green' style={{ width: `${progress}%` }} />
          </div>
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 xl:w-6 xl:h-6 rounded-full bg-accent-green shadow-[0_0_0_4px_rgba(0,228,124,0.25)]
              transition-transform duration-150 ${scrubbing ? 'scale-125' : 'scale-0 group-hover/seek:scale-100'}`}
            style={{ left: `${progress}%` }}
          />
          {hover && duration > 0 && (
            <div
              className='absolute bottom-full mb-2 -translate-x-1/2 px-2 py-0.5 xl:px-4 xl:py-1 rounded bg-dark-green border border-accent-green text-accent-green text-xs xl:text-2xl tabular-nums pointer-events-none'
              style={{ left: hover.x }}
            >
              {formatTime(hover.time)}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className='mt-1 flex items-center gap-3 xl:gap-6 text-warm-gray font-[BoehringerForwardText]'>
          <button type='button' className='brand-player-btn' aria-label={playing ? 'Pause' : 'Play'} onClick={togglePlay}>
            <ControlIcon>{playing ? Icon.pause : Icon.play}</ControlIcon>
          </button>

          <div className='group/vol flex items-center gap-2'>
            <button type='button' className='brand-player-btn' aria-label={muted ? 'Unmute' : 'Mute'} onClick={toggleMute}>
              <ControlIcon>{effectiveVolume === 0 ? Icon.muted : Icon.volume}</ControlIcon>
            </button>
            <input
              type='range'
              min={0}
              max={1}
              step={0.05}
              value={effectiveVolume}
              aria-label='Volume'
              className='brand-player-volume w-0 opacity-0 group-hover/vol:w-20 group-hover/vol:opacity-100 focus:w-20 focus:opacity-100 xl:group-hover/vol:w-40 xl:focus:w-40 transition-all duration-200'
              style={{ '--fill': `${effectiveVolume * 100}%` } as React.CSSProperties}
              onChange={(e) => {
                const video = videoRef.current;
                if (!video) return;
                video.volume = Number(e.target.value);
                video.muted = video.volume === 0;
              }}
            />
          </div>

          <span className='text-xs md:text-sm xl:text-3xl tabular-nums select-none'>
            <span className='text-accent-green'>{formatTime(current)}</span>
            <span className='opacity-60'> / {formatTime(duration)}</span>
          </span>

          <div className='ml-auto flex items-center gap-3 xl:gap-6'>
            {levels.length > 1 && (
              <div className='relative'>
                <button
                  type='button'
                  className={`brand-player-btn ${menuOpen ? 'text-accent-green' : ''}`}
                  aria-label='Quality'
                  aria-haspopup='menu'
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <ControlIcon>{Icon.settings}</ControlIcon>
                </button>
                {menuOpen && (
                  <div
                    role='menu'
                    className='absolute bottom-full right-0 mb-3 min-w-[9rem] xl:min-w-[16rem] py-1 bg-dark-green/95 border border-accent-green backdrop-blur text-sm xl:text-3xl'
                  >
                    <p className='px-4 py-1 xl:px-6 xl:py-3 text-[0.7em] uppercase tracking-widest text-accent-green/70'>Quality</p>
                    {[{ index: -1, height: 0 }, ...levels].map((level) => {
                      const selected = level.index === -1 ? autoLevel : !autoLevel && activeLevel === level.index;
                      return (
                        <button
                          key={level.index}
                          type='button'
                          role='menuitemradio'
                          aria-checked={selected}
                          onClick={() => selectLevel(level.index)}
                          className={`w-full flex items-center justify-between gap-4 px-4 py-1.5 xl:px-6 xl:py-3 text-left hover:bg-accent-green hover:text-dark-green ${
                            selected ? 'text-accent-green' : ''
                          }`}
                        >
                          <span>
                            {level.index === -1
                              ? `Auto${autoLevel && activeLevel >= 0 ? ` (${levels.find((l) => l.index === activeLevel)?.height ?? ''}p)` : ''}`
                              : `${level.height}p`}
                          </span>
                          {selected && <span className='w-1.5 h-1.5 xl:w-3 xl:h-3 rounded-full bg-current' />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <button
              type='button'
              className='brand-player-btn'
              aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
              onClick={toggleFullscreen}
            >
              <ControlIcon>{fullscreen ? Icon.exitFullscreen : Icon.enterFullscreen}</ControlIcon>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandVideoPlayer;
