import React from "react";
import { Link } from "react-router-dom";
import { FaCrown, FaGrinSquint, FaTheaterMasks, FaHeart, FaGhost } from "react-icons/fa";
import { BiCameraMovie } from "react-icons/bi";
import { MdOutlineRocketLaunch, MdOutlinePsychology } from "react-icons/md";

const CATEGORIES = [
  {
    name: "Action",
    icon: <FaCrown className="text-xl" />,
    color: "from-cyan-400 to-blue-600",
    shadow: "rgba(0,242,254,0.45)",
    query: "Action",
  },
  {
    name: "Sci-Fi",
    icon: <MdOutlineRocketLaunch className="text-2xl" />,
    color: "from-blue-500 to-indigo-600",
    shadow: "rgba(59,130,246,0.45)",
    query: "Sci-Fi",
  },
  {
    name: "Thriller",
    icon: <FaTheaterMasks className="text-xl" />,
    color: "from-violet-500 to-purple-700",
    shadow: "rgba(139,92,246,0.45)",
    query: "Thriller",
  },
  {
    name: "Horror",
    icon: <FaGhost className="text-xl" />,
    color: "from-rose-500 to-red-700",
    shadow: "rgba(244,63,94,0.45)",
    query: "Horror",
  },
  {
    name: "Comedy",
    icon: <FaGrinSquint className="text-xl" />,
    color: "from-amber-400 to-orange-500",
    shadow: "rgba(245,158,11,0.45)",
    query: "Comedy",
  },
  {
    name: "Drama",
    icon: <BiCameraMovie className="text-2xl" />,
    color: "from-emerald-400 to-teal-600",
    shadow: "rgba(16,185,129,0.45)",
    query: "Drama",
  },
  {
    name: "Romance",
    icon: <FaHeart className="text-xl" />,
    color: "from-pink-500 to-rose-600",
    shadow: "rgba(236,72,153,0.45)",
    query: "Romance",
  },
  {
    name: "Anime",
    icon: <MdOutlinePsychology className="text-2xl" />,
    color: "from-fuchsia-500 to-purple-600",
    shadow: "rgba(217,70,239,0.45)",
    query: "Anime",
  },
];

export default function PopularCategories() {
  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-12 md:mt-16" aria-label="Popular movie categories">
      <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-white/[0.08]">
        <h2 className="section-title text-xl md:text-2xl font-black">
          Browse by Genre
        </h2>
      </div>

      {/* Circle Icon Cards Row */}
      <div className="grid grid-cols-2 xs:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            to={`/movies?genre=${cat.query}`}
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-[#0E131F] hover:bg-[#141A29] border border-white/[0.08] hover:border-cyan-400/40 transition-all duration-300 hover:scale-105 shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
          >
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${cat.color} text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
              style={{ boxShadow: `0 0 20px ${cat.shadow}` }}
            >
              {cat.icon}
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-cyan-300 mt-3 transition-colors font-outfit">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
