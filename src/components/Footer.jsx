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
    <footer className="relative border-t border-border bg-bgColorTertiary mt-16 pb-16 md:pb-0">
      {/* Gold top line gradient */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primaryBtn to-transparent opacity-50" />

      <div className="max-w-[1600px] mx-auto px-5 sm:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ── Column 1: Brand & Telegram ── */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-primaryBtn flex items-center justify-center shadow-gold">
                <MdLocalMovies className="text-bgColor text-xl" />
              </div>
              <span className="gold-text font-extrabold text-2xl tracking-tight">
                {SITENAME}
              </span>
            </Link>
            <p className="text-secondaryTextColor text-xs sm:text-sm leading-relaxed max-w-xs">
              Your premier destination for HD movies, web series, and TV shows. Unlimited entertainment with direct cloud streaming links.
            </p>
            <p className="text-mutedText text-[0.75rem] leading-relaxed">
              We do not store files on our servers. All media items are indexed from public third-party sources.
            </p>
            {TG_URL && (
              <a
                href={TG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0088cc]/10 border border-[#0088cc]/30 text-[#0088cc] hover:bg-[#0088cc]/20 transition-all duration-200 px-4 py-2 rounded-full text-xs font-semibold"
                aria-label="Join Telegram channel"
              >
                <FaTelegram className="text-base" />
                Join Telegram Channel
              </a>
            )}
          </div>

          {/* ── Column 2: Quick Navigation ── */}
          <div>
            <h3 className="section-title mb-4 text-sm font-bold uppercase tracking-wider text-primaryTextColor">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-secondaryTextColor hover:text-primaryBtn transition-colors text-xs sm:text-sm font-medium group"
                  >
                    <span className="text-base group-hover:text-primaryBtn transition-colors">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Legal & AdSense Compliance ── */}
          <div>
            <h3 className="section-title mb-4 text-sm font-bold uppercase tracking-wider text-primaryTextColor">
              Legal & Support
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-secondaryTextColor hover:text-primaryBtn transition-colors text-xs sm:text-sm font-medium group"
                  >
                    <span className="text-base text-primaryBtn/80 group-hover:text-primaryBtn transition-colors">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Genres & Tags ── */}
          <div>
            <h3 className="section-title mb-4 text-sm font-bold uppercase tracking-wider text-primaryTextColor">
              Popular Genres
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="text-[0.7rem] font-semibold px-2.5 py-1 rounded-full bg-primaryBtn/10 border border-primaryBtn/20 text-primaryBtn hover:bg-primaryBtn/20 transition-colors cursor-default"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-mutedText text-xs">
            © {new Date().getFullYear()} <span className="text-secondaryTextColor font-semibold">{SITENAME}</span>. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-mutedText">
            <Link to="/privacy-policy" className="hover:text-primaryBtn transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-primaryBtn transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/disclaimer" className="hover:text-primaryBtn transition-colors">DMCA</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-primaryBtn transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
