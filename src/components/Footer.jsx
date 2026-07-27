import React from "react";
import { Link } from "react-router-dom";
import { FaTelegram } from "react-icons/fa";
import { HiOutlineFilm, HiOutlineTv, HiOutlineHome, HiOutlineInformationCircle } from "react-icons/hi2";
import { MdLocalMovies, MdOutlinePrivacyTip, MdGavel, MdOutlineEmail, MdOutlineSecurity } from "react-icons/md";

export default function Footer() {
  const TG_URL = import.meta.env.VITE_TG_URL;
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";

  const categories = ["Movies", "TV Shows", "Anime", "K-Drama", "Web Series", "South Indian", "Dual Audio", "Hindi Dubbed"];

  const navLinks = [
    { name: "Home", path: "/", icon: <HiOutlineHome /> },
    { name: "Movies", path: "/movies", icon: <HiOutlineFilm /> },
    { name: "Series", path: "/series", icon: <HiOutlineTv /> },
  ];

  const legalLinks = [
    { name: "About Us", path: "/about", icon: <HiOutlineInformationCircle /> },
    { name: "Privacy Policy", path: "/privacy-policy", icon: <MdOutlinePrivacyTip /> },
    { name: "Terms & Conditions", path: "/terms", icon: <MdGavel /> },
    { name: "Disclaimer & DMCA", path: "/disclaimer", icon: <MdOutlineSecurity /> },
    { name: "Contact Us", path: "/contact", icon: <MdOutlineEmail /> },
  ];

  return (
    <footer className="relative border-t border-amber-500/20 bg-[#040609] mt-20 pb-20 md:pb-0 overflow-hidden">
      {/* Top ambient glowing bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_20px_rgba(245,158,11,0.9)]" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-5 sm:px-10 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ── Column 1: Brand & Telegram ── */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.6)] border border-white/20">
                <MdLocalMovies className="text-slate-950 text-2xl" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="gold-text font-black text-2xl tracking-tight block">
                  Filmy
                </span>
                <span className="bg-gradient-to-r from-cyan-500/20 to-amber-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-black px-2 py-0.5 rounded-md tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.4)] uppercase">
                  4UHD
                </span>
              </div>
            </Link>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xs font-medium">
              Your premier destination for HD movies, web series, and TV shows. Free direct cloud streaming links with zero subscriptions.
            </p>
            <p className="text-slate-400 text-[0.75rem] leading-relaxed">
              We do not store files on our servers. All media items are indexed from public third-party sources.
            </p>
            {TG_URL && (
              <a
                href={TG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0088cc]/15 border border-[#0088cc]/40 text-[#0088cc] hover:bg-[#0088cc] hover:text-white transition-all duration-300 px-5 py-2.5 rounded-full text-xs font-bold shadow-[0_0_20px_rgba(0,136,204,0.3)]"
                aria-label="Join Telegram channel"
              >
                <FaTelegram className="text-base" />
                Join Official Telegram Channel
              </a>
            )}
          </div>

          {/* ── Column 2: Quick Navigation ── */}
          <div>
            <h3 className="section-title mb-4 text-xs font-black uppercase tracking-wider text-slate-200">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2.5 text-slate-300 hover:text-amber-400 transition-colors text-xs sm:text-sm font-semibold group"
                  >
                    <span className="text-base text-amber-400 group-hover:scale-110 transition-transform">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Legal & AdSense Compliance ── */}
          <div>
            <h3 className="section-title mb-4 text-xs font-black uppercase tracking-wider text-slate-200">
              Legal & Support
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2.5 text-slate-300 hover:text-amber-400 transition-colors text-xs sm:text-sm font-semibold group"
                  >
                    <span className="text-base text-amber-400 group-hover:scale-110 transition-transform">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Genres & Tags ── */}
          <div>
            <h3 className="section-title mb-4 text-xs font-black uppercase tracking-wider text-slate-200">
              Browse Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="text-[0.72rem] font-bold px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 hover:bg-amber-500/25 transition-colors cursor-default shadow-sm"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs font-medium">
            © {new Date().getFullYear()} <span className="text-slate-200 font-bold">{SITENAME}</span>. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold">
            <Link to="/privacy-policy" className="hover:text-amber-400 transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-amber-400 transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/disclaimer" className="hover:text-amber-400 transition-colors">DMCA</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-amber-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
