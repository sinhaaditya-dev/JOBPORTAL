import React, { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import worldMapUrl from '../assets/world-map.svg';

const hotspots = [
  { id: 1, name: "San Francisco", left: "13.3%", top: "33.4%" },
  { id: 2, name: "New York", left: "24.1%", top: "32.4%" },
  { id: 3, name: "Sao Paulo", left: "34.3%", top: "76.0%" },
  { id: 4, name: "London", left: "47.7%", top: "25.8%" },
  { id: 5, name: "Johannesburg", left: "56.0%", top: "78.1%" },
  { id: 6, name: "Mumbai", left: "71.3%", top: "52.0%" },
  { id: 7, name: "Tokyo", left: "87.9%", top: "36.7%" },
  { id: 8, name: "Sydney", left: "93.0%", top: "86.9%" },
  { id: 9, name: "Berlin", left: "50.3%", top: "30.2%" },
];

const connections = [
  { from: [135, 395], to: [405, 360], bend: -60 },
  { from: [220, 390], to: [300, 590], bend: 30 },
  { from: [405, 360], to: [590, 480], bend: -40 },
  { from: [405, 360], to: [720, 410], bend: -80 },
  { from: [590, 480], to: [760, 640], bend: 40 },
  { from: [470, 600], to: [405, 360], bend: -30 },
  { from: [135, 395], to: [720, 410], bend: -100 },
];

export const WorldMap = () => {
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    fetch(worldMapUrl)
      .then((res) => res.text())
      .then((text) => {
        const svgStart = text.indexOf('<svg');
        if (svgStart !== -1) {
          // Replace fixed width/height with Tailwind classes for responsiveness
          let parsedSvg = text.substring(svgStart);
          parsedSvg = parsedSvg.replace(/width="[^"]*"/, 'width="100%"');
          parsedSvg = parsedSvg.replace(/height="[^"]*"/, 'height="100%"');
          setSvgContent(parsedSvg);
        } else {
          setSvgContent(text);
        }
      })
      .catch((err) => console.error("Failed to load world map SVG:", err));
  }, []);

  // Helper to generate SVG path for connecting curves
  const generateArcPath = (from, to, bend) => {
    const [x1, y1] = from;
    const [x2, y2] = to;
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2 + bend;
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full max-w-5xl mx-auto px-4 mt-8"
    >
      <div className="relative rounded-3xl border border-slate-200/50 dark:border-zinc-800/50 bg-white/30 dark:bg-zinc-950/10 backdrop-blur-sm p-4 sm:p-8 overflow-hidden shadow-xl">
        {/* World Map SVG Display */}
        <div 
          className="w-full h-auto text-indigo-200 dark:text-purple-900/30 opacity-75"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* Curves & Path Overlay */}
        <svg 
          viewBox="30.767 241.591 784.077 458.627" 
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          <defs>
            <linearGradient id="curve-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {connections.map((conn, idx) => (
            <path
              key={idx}
              d={generateArcPath(conn.from, conn.to, conn.bend)}
              fill="none"
              stroke="url(#curve-gradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="8 6"
              className="opacity-70 dark:opacity-60"
              style={{
                strokeDashoffset: 100,
                animation: 'dash 30s linear infinite',
              }}
            />
          ))}
        </svg>

        {/* Hotspots Overlay */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-15">
          {hotspots.map((spot) => (
            <div
              key={spot.id}
              className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2"
              style={{ left: spot.left, top: spot.top }}
            >
              {/* Ping Ripple */}
              <span className="absolute inset-0 rounded-full bg-indigo-500/40 dark:bg-purple-500/40 animate-ping"></span>
              {/* Inner glowing dot */}
              <span className="absolute inset-[3px] rounded-full bg-indigo-650 dark:bg-purple-400 shadow-[0_0_10px_#818cf8]"></span>
            </div>
          ))}
        </div>

        {/* Left overlap card (Jobs available worldwide) */}
        <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-44 sm:w-56 p-4 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-slate-100 dark:border-zinc-800 shadow-xl flex flex-col items-start space-y-3 backdrop-blur-md">
          <div className="p-2.5 bg-indigo-50 dark:bg-purple-950/40 text-indigo-600 dark:text-purple-400 rounded-xl">
            <Globe size={20} />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              Jobs available in
            </span>
            <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-purple-400 leading-none">
              120+
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-zinc-300 block">
              countries worldwide
            </span>
          </div>
        </div>

        {/* Right bottom live status card */}
        <div className="absolute right-4 sm:right-8 bottom-4 sm:bottom-6 z-20 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-slate-100 dark:border-zinc-800 shadow-lg flex items-center space-x-2.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="text-left leading-none">
            <span className="text-[11px] font-bold text-slate-800 dark:text-zinc-200 block">
              Live Job Openings
            </span>
            <span className="text-[8.5px] font-medium text-slate-450 dark:text-zinc-500 block mt-0.5">
              Updated in real-time
            </span>
          </div>
        </div>

      </div>

      {/* Styled animation logic embedded for the path connection dash flow */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}</style>
    </motion.div>
  );
};
