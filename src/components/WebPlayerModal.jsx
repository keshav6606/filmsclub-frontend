import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaVolumeMute,
  FaVolumeUp,
  FaRedo,
  FaUndo,
  FaTimes,
  FaExternalLinkAlt,
  FaDownload,
  FaAndroid,
} from "react-icons/fa";
import { MdSmartDisplay, MdOndemandVideo } from "react-icons/md";
import { SiVlcmediaplayer } from "react-icons/si";

const PLAYERS = [
  { id: "mpvex", name: "mpvEx Player", icon: <MdSmartDisplay /> },
  { id: "mx", name: "MX Player", icon: <MdOndemandVideo /> },
  { id: "vlc", name: "VLC Player", icon: <SiVlcmediaplayer /> },
];

export default function WebPlayerModal({
  isOpen,
  onClose,
  videoUrl,
  title,
  quality,
  language,
  onLaunchExternal,
  onDownload,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);

  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setIsBuffering(true);
    }
  }, [isOpen, videoUrl]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          onClose();
        }
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        skip(-10);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        skip(10);
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFullscreen]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsBuffering(false);
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        Math.max(videoRef.current.currentTime + seconds, 0),
        duration
      );
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      exitFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const hours = Math.floor(minutes / 60);
    const displayMins = minutes % 60;
    if (hours > 0) {
      return `${hours}:${displayMins < 10 ? "0" : ""}${displayMins}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
    return `${displayMins}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6"
      >
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative w-full max-w-5xl bg-slate-950 rounded-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.9)] border border-white/10 flex flex-col"
        >
          {/* Top Header Bar */}
          <div
            className={`absolute top-0 inset-x-0 z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden pr-4">
              <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                Online Stream
              </span>
              <h3 className="text-white font-bold text-sm sm:text-base truncate">
                {title || "Filmy4uhd Stream"}
              </h3>
              {quality && (
                <span className="hidden sm:inline-block bg-white/10 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded border border-amber-400/20 shrink-0">
                  {quality}
                </span>
              )}
              {language && (
                <span className="hidden md:inline-block bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-2 py-0.5 rounded border border-cyan-400/20 shrink-0">
                  {language}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors shrink-0"
              aria-label="Close player"
            >
              <FaTimes className="text-base" />
            </button>
          </div>

          {/* Video Player Container */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
            {isBuffering && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 z-10">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-300 font-medium tracking-wide">
                  Loading stream...
                </span>
              </div>
            )}

            <video
              ref={videoRef}
              src={videoUrl}
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => {
                setIsBuffering(false);
                setIsPlaying(true);
              }}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-contain cursor-pointer"
              playsInline
              crossOrigin="anonymous"
            />

            {/* Center Big Play/Pause Overlay Indicator on Click */}
            {!isPlaying && !isBuffering && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.8)] border-2 border-white/40 hover:scale-110 transition-transform">
                  <FaPlay className="text-2xl sm:text-3xl ml-1" />
                </div>
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div
              className={`absolute bottom-0 inset-x-0 z-20 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Progress Slider */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-300 shrink-0">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:h-2.5 transition-all"
                />
                <span className="text-xs font-mono text-slate-400 shrink-0">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Main Controls row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="p-2 text-white hover:text-amber-400 transition-colors text-lg sm:text-xl"
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>

                  {/* Skip Buttons */}
                  <button
                    onClick={() => skip(-10)}
                    className="p-1.5 text-slate-300 hover:text-white transition-colors text-sm sm:text-base flex items-center gap-1"
                    title="Rewind 10s"
                  >
                    <FaUndo />
                    <span className="text-[10px] font-bold">10s</span>
                  </button>
                  <button
                    onClick={() => skip(10)}
                    className="p-1.5 text-slate-300 hover:text-white transition-colors text-sm sm:text-base flex items-center gap-1"
                    title="Forward 10s"
                  >
                    <FaRedo />
                    <span className="text-[10px] font-bold">10s</span>
                  </button>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2 group relative">
                    <button
                      onClick={toggleMute}
                      className="p-1.5 text-slate-300 hover:text-white transition-colors text-base"
                    >
                      {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 sm:w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>

                {/* Right side controls (Speed & Fullscreen) */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Speed Selector */}
                  <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                    {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => changeSpeed(s)}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          playbackSpeed === s
                            ? "bg-amber-500 text-slate-950"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 text-white hover:text-amber-400 transition-colors text-lg"
                    title="Toggle Fullscreen"
                  >
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick External Player Action Bar in Footer */}
          <div className="p-3 sm:p-4 bg-slate-900 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                Open in App:
              </span>
              {PLAYERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onLaunchExternal && onLaunchExternal(p.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-200 hover:text-amber-400 border border-white/10 transition-all font-semibold"
                >
                  <span className="text-amber-400">{p.icon}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>

            {onDownload && (
              <button
                onClick={onDownload}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-4 py-1.5 rounded-lg transition-all shadow-md ml-auto"
              >
                <FaDownload />
                <span>Download Video</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
