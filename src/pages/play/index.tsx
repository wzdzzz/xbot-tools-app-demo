import React, { useRef, useState, useEffect } from 'react';
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
  FaRandom,
  FaRedo,
} from 'react-icons/fa';

interface LyricLine { time: number; text: string; }

const lyrics: LyricLine[] = [
  { time: 0, text: "First line of lyric..." },
  { time: 10, text: "Second line of lyric..." },
  { time: 20, text: "Third line of lyric..." },
  { time: 30, text: "Fourth line of lyric..." },
];

const PlayPage: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLyric, setCurrentLyric] = useState<string>(lyrics[0].text);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'one' | 'all'>('none');
  const [volume, setVolume] = useState(1);

  // Mock playlist
  const playlist = ['/assets/song.mp3'];
  const [trackIndex, setTrackIndex] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    const onLoaded = () => setDuration(audio.duration);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      const active = [...lyrics]
      .reverse()
      .find(line => audio.currentTime >= line.time);
      if (active) setCurrentLyric(active.text);
    };
    const onEnded = () => handleNext();

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [trackIndex, volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  const handlePrev = () => {
    setTrackIndex(i => {
      if (shuffle) {
        return Math.floor(Math.random() * playlist.length);
      }
      return (i - 1 + playlist.length) % playlist.length;
    });
    setPlaying(false);
    setTimeout(() => togglePlay(), 0);
  };

  const handleNext = () => {
    setTrackIndex(i => {
      if (shuffle) {
        return Math.floor(Math.random() * playlist.length);
      }
      if (repeat === 'one') {
        return i;
      }
      const next = i + 1;
      if (next >= playlist.length) {
        return repeat === 'all' ? 0 : i;
      }
      return next;
    });
    setPlaying(false);
    setTimeout(() => togglePlay(), 0);
  };

  const handleShuffle = () => setShuffle(s => !s);
  const handleRepeat = () =>
    setRepeat(r => (r === 'none' ? 'all' : r === 'all' ? 'one' : 'none'));

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0');
    const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white min-h-screen">
      {/* Album Art with Animation */}
      <div className={`w-48 h-48 rounded-full overflow-hidden mb-6 ${playing ? 'animate-spin-slow' : ''}`}>
        <img src="/assets/cover.jpg" alt="cover" className="w-full h-full object-cover" />
      </div>

      {/* Song Info */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Song Title</h3>
        <p className="text-gray-400">Artist Name</p>
      </div>

      {/* Progress Bar and Time */}
      <div className="w-full max-w-lg mb-4">
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={currentTime}
          onChange={e => {
            const audio = audioRef.current;
            if (!audio) return;
            const t = parseFloat(e.target.value);
            audio.currentTime = t;
            setCurrentTime(t);
          }}
          className="w-full accent-indigo-500"
        />
        <div className="flex justify-between text-sm text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-6 mb-6 text-2xl">
        <FaRandom
          onClick={handleShuffle}
          className={shuffle ? 'text-indigo-400' : 'hover:text-indigo-400 cursor-pointer'}
        />
        <FaStepBackward
          onClick={handlePrev}
          className="hover:text-indigo-400 cursor-pointer"
        />
        <button onClick={togglePlay} className="focus:outline-none">
          {playing ? <FaPause /> : <FaPlay />}
        </button>
        <FaStepForward
          onClick={handleNext}
          className="hover:text-indigo-400 cursor-pointer"
        />
        <FaRedo
          onClick={handleRepeat}
          className={repeat !== 'none' ? 'text-indigo-400' : 'hover:text-indigo-400 cursor-pointer'}
        />
        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <FaVolumeUp className="cursor-pointer" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-indigo-500"
          />
        </div>
      </div>

      {/* Lyrics Display */}
      <div className="w-full max-w-lg bg-gray-800 p-4 rounded-lg shadow-inner h-32 overflow-y-auto">
        {lyrics.map((line, idx) => (
          <p
            key={idx}
            className={`text-center text-gray-300 italic py-1 ${
              line.text === currentLyric ? 'text-white font-semibold' : ''
            }`}
          >
            {line.text}
          </p>
        ))}
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={playlist[trackIndex]}
        preload="metadata"
      />
    </div>
  );
};

export default PlayPage;
