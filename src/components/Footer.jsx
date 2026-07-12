import React from "react";
import { Link } from "react-router-dom";
import { FaTelegram } from "react-icons/fa";
import { HiOutlineFilm, HiOutlineTv, HiOutlineHome } from "react-icons/hi2";
import { MdLocalMovies } from "react-icons/md";

export default function Footer() {
  const TG_URL = import.meta.env.VITE_TG_URL;
  const SITENAME = import.meta.env.VITE_SITENAME;

  const categories = ["Movies", "TV Shows", "Anime", "K-Drama", "Web Series", "South Indian"];
  const navLinks = [
    { name: "Home", path: "/", icon: <HiOutlineHome /> },
    { name: "Movies", path: "/movies", icon: <HiOutlineFilm /> },
    { name: "Series", path: "/series", icon: <HiOutlineTv /> },
    { name: "Disclaimer & DMCA", path: "/disclaimer", icon: <MdLocalMovies /> },
  ];

  return (
    <footer className="relative border-t border-border bg-bgColorTertiary mt-16 pb-16 md:pb-0">
      {/* Gold top line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primaryBtn to-transparent opacity-40" />

      <div className="max-w-[1600px] mx-auto px-5 sm:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* ── Column 1: Brand ── */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-primaryBtn flex items-center justify-center shadow-gold">
                <MdLocalMovies className="text-bgColor text-xl" />
              </div>
              <span className="gold-text font-extrabold text-2xl tracking-tight">
                {SITENAME || "Filmy4uhd"}
              </span>
            </Link>
            <p className="text-secondaryTextColor text-sm leading-relaxed mb-5 max-w-xs">
              Your ultimate destination for HD movies, web series, and TV shows. Free forever. No subscriptions.
            </p>
            <p className="text-mutedText text-xs leading-relaxed mb-5">
              This site does not store any files on its server. All content links to media hosted externally on Telegram.
            </p>
            {/* Telegram Link */}
            {TG_URL && (
              <a
                href={TG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0088cc]/10 border border-[#0088cc]/30 text-[#0088cc] hover:bg-[#0088cc]/20 transition-all duration-200 px-4 py-2 rounded-full text-sm font-semibold"
                aria-label="Join Telegram channel"
              >
                <FaTelegram className="text-base" />
                Join Telegram Channel
              </a>
            )}
          </div>

          {/* ── Column 2: Categories ── */}
          <div>
            <h3 className="section-title mb-5 text-base">What We Have</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primaryBtn/10 border border-primaryBtn/20 text-primaryBtn hover:bg-primaryBtn/20 transition-colors cursor-default"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* ── Column 3: Quick Links ── */}
          <div>
            <h3 className="section-title mb-5 text-base">Quick Menu</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2.5 text-secondaryTextColor hover:text-primaryBtn transition-colors text-sm font-medium group"
                  >
                    <span className="text-base group-hover:text-primaryBtn transition-colors">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-mutedText text-xs">
            © {new Date().getFullYear()} <span className="text-secondaryTextColor font-semibold">{SITENAME}</span>. All Rights Reserved. · <Link to="/disclaimer" className="hover:text-primaryBtn transition-colors">DMCA Disclaimer</Link>
          </p>
          <p className="text-mutedText text-xs italic">
            Built for cinema lovers 🎬
          </p>
        </div>
      </div>
    </footer>
  );
}
