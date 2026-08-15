import React from "react";
import { Link } from "react-router-dom";
import { FaCrown, FaGrinSquint, FaTheaterMasks, FaHeart, FaGhost } from "react-icons/fa";
import { BiCameraMovie } from "react-icons/bi";

const CATEGORIES = [
  {
    name: "Action",
    icon: <FaCrown className="text-xl" />,
    color: "from-amber-500 to-orange-600",
    shadow: "rgba(245,158,11,0.4)",
    query: "Action",
  },
  {
    name: "Comedy",
    icon: <FaGrinSquint className="text-xl" />,
    color: "from-yellow-400 to-amber-500",
    shadow: "rgba(234,179,8,0.4)",
    query: "Comedy",
  },
  {
    name: "Thriller",
    icon: <FaTheaterMasks className="text-xl" />,
    color: "from-purple-500 to-indigo-600",
    shadow: "rgba(168,85,247,0.4)",
    query: "Thriller",
  },
  {
    name: "Drama",
    icon: <BiCameraMovie className="text-2xl" />,
    color: "from-orange-500 to-red-600",
    shadow: "rgba(239,68,68,0.4)",
    query: "Drama",
  },
  {
    name: "Romance",
    icon: <FaHeart className="text-xl" />,
    color: "from-pink-500 to-rose-600",
    shadow: "rgba(244,63,94,0.4)",
    query: "Romance",
  },
  {
    name: "Horror",
    icon: <FaGhost className="text-xl" />,
    color: "from-cyan-500 to-teal-600",
    shadow: "rgba(6,182,212,0.4)",
    query: "Horror",
  },
];

export default function PopularCategories() {
  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-10 md:mt-14" aria-label="Popular movie categories">
      <div className="flex items-center justify-between mb-5 pb-2 border-b border-white/5">
        <h2 className="section-title text-xl md:text-2xl font-black">
          Popular Categories
        </h2>
      </div>

      {/* Circle Icon Cards Row */}
      <div className="grid grid-cols-3 xs:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            to={`/movies?genre=${cat.query}`}
            className="group flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-amber-400/40 transition-all duration-300 hover:scale-105 shadow-md"
          >
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${cat.color} text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
              style={{ boxShadow: `0 0 20px ${cat.shadow}` }}
            >
              {cat.icon}
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-amber-400 mt-2.5 transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
