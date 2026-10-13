import React, { useState, useEffect } from 'react';
import {
  FaPlay,
  FaTimes,
  FaExternalLinkAlt,
  FaCopy,
  FaCheck,
  FaDownload
} from 'react-icons/fa';
import { SiVlcmediaplayer } from 'react-icons/si';
import { MdSmartDisplay, MdOndemandVideo } from 'react-icons/md';

import { getYupflixDownloadUrl } from '../services/yupflixApi';

export function YupflixPlayerModal({ title, source, onClose }) {
  const [streamUrl, setStreamUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    if (!source?.url) {
      setLoading(false);
      return;
    }

    const targetUrl = getYupflixDownloadUrl(source.url);

    // Resolve stream URL from Yupflix download redirect
    fetch(targetUrl, { redirect: 'manual' })
      .then(res => {
        const loc = res.headers.get('location') || res.url;
        if (active) {
          setStreamUrl(loc);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setStreamUrl(targetUrl);
          setLoading(false);
        }
      });

    return () => { active = false; };
  }, [source]);

  const copyUrl = () => {
    if (streamUrl) {
      navigator.clipboard?.writeText(streamUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const vlcLink = streamUrl ? `vlc://${streamUrl}` : '#';
  const mxLink = streamUrl ? `intent:${streamUrl}#Intent;package=com.mxtech.videoplayer.ad;type=video/*;end` : '#';
  const nextPlayerLink = streamUrl ? `intent:${streamUrl}#Intent;package=com.nextplayer.pro;type=video/*;end` : '#';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#17181b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0c10]">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              <FaPlay className="ml-0.5" />
            </span>
            <div>
              <h3 className="text-white font-bold text-base md:text-lg leading-tight line-clamp-1">
                {title}
              </h3>
              <p className="text-gray-400 text-xs">
                Quality: <span className="text-white font-semibold">{source?.quality || 'HD'}</span> {source?.size && ` · ${source.size}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close Player"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Video Player Viewport */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400 text-sm">Resolving high-speed stream link...</span>
            </div>
          ) : streamUrl ? (
            <iframe
              src={streamUrl}
              title={title}
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          ) : (
            <div className="text-center p-6">
              <p className="text-gray-300 mb-4">Could not load online stream player.</p>
              <a
                href={`http://localhost:3000${source?.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-full text-sm shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              >
                <FaDownload /> Download Directly
              </a>
            </div>
          )}
        </div>

        {/* Player Options & External Launchers */}
        <div className="p-4 sm:p-6 bg-[#0e1117] border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">
              External Players:
            </span>
            <a
              href={vlcLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30 text-xs font-bold transition-all"
            >
              <SiVlcmediaplayer className="text-sm" /> VLC
            </a>
            <a
              href={mxLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all"
            >
              <MdOndemandVideo className="text-sm" /> MX Player
            </a>
            <a
              href={nextPlayerLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all"
            >
              <MdSmartDisplay className="text-sm" /> NextPlayer
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold transition-colors"
            >
              {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
              {copied ? 'Copied Link' : 'Copy Stream'}
            </button>
            <a
              href={`http://localhost:3000${source?.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
            >
              <FaDownload /> Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
