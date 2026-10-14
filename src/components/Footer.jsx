import React from "react";
import { Link } from "react-router-dom";
import { FaTelegram } from "react-icons/fa";
import { HiOutlineFilm, HiOutlineTv, HiOutlineHome, HiOutlineInformationCircle } from "react-icons/hi2";
import { MdOutlinePrivacyTip, MdGavel, MdOutlineEmail, MdOutlineSecurity } from "react-icons/md";
import FilmsClubLogo from "./FilmsClubLogo";

export default function Footer() {
  const TG_URL = import.meta.env.VITE_TG_URL || "https://t.me/filmy4uhd";
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4UHD";

  const categories = [
    { name: "4K UHD Cinema", path: "/movies?genre=4k" },
    { name: "Netflix Originals", path: "/filmsclub?prov=nf" },
    { name: "Prime Video", path: "/filmsclub?prov=prime" },
    { name: "JioHotstar", path: "/filmsclub?prov=hotstar" },
    { name: "SonyLIV", path: "/filmsclub?prov=sonyliv" },
    { name: "ZEE5", path: "/filmsclub?prov=zee5" },
    { name: "Dual Audio (Hindi)", path: "/movies?lang=hi" },
    { name: "Action & Blockbusters", path: "/movies?genre=Action" },
    { name: "Web Series", path: "/series" },
    { name: "Anime Library", path: "/filmsclub?type=anime" },
  ];

  const navLinks = [
    { name: "Home Theater", path: "/", icon: <HiOutlineHome /> },
    { name: "Movies Catalog", path: "/movies", icon: <HiOutlineFilm /> },
    { name: "Web Series", path: "/series", icon: <HiOutlineTv /> },
    { name: "OTT Channels Hub", path: "/filmsclub", icon: <HiOutlineFilm /> },
    { name: "My Watchlist", path: "/watchlist", icon: <HiOutlineFilm /> },
  ];

  const legalLinks = [
    { name: "About Us", path: "/about", icon: <HiOutlineInformationCircle /> },
    { name: "Privacy Policy", path: "/privacy-policy", icon: <MdOutlinePrivacyTip /> },
    { name: "Terms & Conditions", path: "/terms", icon: <MdGavel /> },
    { name: "Disclaimer & DMCA", path: "/disclaimer", icon: <MdOutlineSecurity /> },
    { name: "Contact Support", path: "/contact", icon: <MdOutlineEmail /> },
  ];

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#05070B] mt-16 pb-24 md:pb-10 overflow-hidden">
      {/* Top ambient glowing laser line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(0,242,254,0.8)]" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-48 bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-5 sm:px-10 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ── Column 1: Brand & Telegram ── */}
          <div className="space-y-4">
            <FilmsClubLogo className="w-fit" />
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xs font-medium">
              Next-generation 4K Ultra HD cinema and streaming ecosystem. Instant cloud playback with hardware-decoded NextPlayer integration and zero subscriptions.
            </p>
            <p className="text-slate-500 text-[0.72rem] leading-relaxed">
              We do not host files on our servers. All media streams are indexed from public third-party sources.
            </p>
            {TG_URL && (
              <a
                href={TG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#0088cc]/15 border border-[#0088cc]/40 text-[#00c6ff] hover:bg-[#0088cc] hover:text-white transition-all duration-300 px-5 py-2.5 rounded-full text-xs font-bold shadow-[0_0_20px_rgba(0,136,204,0.3)] font-outfit"
                aria-label="Join Telegram channel"
              >
                <FaTelegram className="text-base" />
                Join Telegram Community
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
                    className="flex items-center gap-2.5 text-slate-300 hover:text-cyan-400 transition-colors text-xs sm:text-sm font-semibold group font-outfit"
                  >
                    <span className="text-base text-cyan-400 group-hover:scale-110 transition-transform">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Featured Categories ── */}
          <div>
            <h3 className="section-title mb-4 text-xs font-black uppercase tracking-wider text-slate-200">
              Popular Collections
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className="text-[11px] font-bold text-slate-400 hover:text-white bg-[#0E131F] hover:bg-[#141A29] border border-white/10 hover:border-cyan-400/40 px-3 py-1.5 rounded-xl transition-all shadow-sm font-outfit"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Column 4: Legal & Compliance ── */}
          <div>
            <h3 className="section-title mb-4 text-xs font-black uppercase tracking-wider text-slate-200">
              Legal & Support
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2.5 text-slate-300 hover:text-cyan-400 transition-colors text-xs sm:text-sm font-semibold group font-outfit"
                  >
                    <span className="text-base text-cyan-400 group-hover:scale-110 transition-transform">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Status & Copyright */}
        <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <p>© {new Date().getFullYear()} Filmy4UHD Cinema. All rights reserved.</p>
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00f5a0] animate-pulse" />
            <span>All Edge Clusters Operational • 100% Ultra Speed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
