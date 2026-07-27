import React from "react";
import { Link } from "react-router-dom";
import { FaTelegram } from "react-icons/fa";
import { HiOutlineFilm, HiOutlineTv, HiOutlineHome, HiOutlineShieldCheck, HiOutlineInformationCircle, HiOutlineEnvelope, HiOutlineScale, HiOutlineDocumentText, HiArrowUp } from "react-icons/hi2";
import BrandLogo from "./svg/BrandLogo";

export default function Footer() {
  const TG_URL = import.meta.env.VITE_TG_URL;
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";

  const categories = ["Movies", "TV Shows", "Anime", "K-Drama", "Web Series", "South Indian"];
  
  const quickLinks = [
    { name: "Home", path: "/", icon: <HiOutlineHome /> },
    { name: "Movies", path: "/movies", icon: <HiOutlineFilm /> },
    { name: "Series", path: "/series", icon: <HiOutlineTv /> },
  ];

  const legalLinks = [
    { name: "About Us", path: "/about", icon: <HiOutlineInformationCircle /> },
    { name: "Contact Us", path: "/contact", icon: <HiOutlineEnvelope /> },
    { name: "Privacy Policy", path: "/privacy-policy", icon: <HiOutlineShieldCheck /> },
    { name: "Terms of Service", path: "/terms", icon: <HiOutlineScale /> },
    { name: "DMCA Takedowns", path: "/dmca", icon: <HiOutlineDocumentText /> },
    { name: "Disclaimer", path: "/disclaimer", icon: <HiOutlineShieldCheck /> },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-border bg-bgColorTertiary mt-20 pb-16 md:pb-0">
      {/* Gold animated accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primaryBtn to-transparent opacity-50" />

      <div className="max-w-[1600px] mx-auto px-5 sm:px-10 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* ── Column 1: Brand & Telegram ── */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <BrandLogo size={36} className="w-9 h-9 transition-transform duration-300 group-hover:scale-105" />
              <span className="gold-text font-extrabold text-2xl tracking-tight">
                {SITENAME}
              </span>
            </Link>
            <p className="text-secondaryTextColor text-xs leading-relaxed max-w-xs">
              Your premier destination for HD movies, trending TV series, and entertainment. Free forever. No subscriptions or hidden fees.
            </p>
            <p className="text-mutedText text-[0.7rem] leading-relaxed">
              Disclaimer: {SITENAME} does not host any files on its servers. All media links direct to public third-party external networks.
            </p>

            {TG_URL && (
              <a
                href={TG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0088cc]/10 border border-[#0088cc]/30 text-[#0088cc] hover:bg-[#0088cc]/20 transition-all duration-200 px-4 py-2 rounded-full text-xs font-bold"
                aria-label="Join Telegram channel"
              >
                <FaTelegram className="text-base" />
                Join Telegram Channel
              </a>
            )}
          </div>

          {/* ── Column 2: Categories ── */}
          <div>
            <h3 className="section-title mb-5 text-sm uppercase tracking-wider">Genres & Categories</h3>
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

          {/* ── Column 3: Quick Navigation ── */}
          <div>
            <h3 className="section-title mb-5 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-secondaryTextColor hover:text-primaryBtn transition-colors text-xs font-medium group"
                  >
                    <span className="text-sm text-mutedText group-hover:text-primaryBtn transition-colors">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Legal & Policies (AdSense Compliance) ── */}
          <div>
            <h3 className="section-title mb-5 text-sm uppercase tracking-wider">Trust & Policies</h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-secondaryTextColor hover:text-primaryBtn transition-colors text-xs font-medium group"
                  >
                    <span className="text-sm text-mutedText group-hover:text-primaryBtn transition-colors">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Trust Badges */}
        <div className="mt-10 pt-6 border-t border-border/40 flex flex-wrap items-center justify-center gap-4 text-[0.7rem] text-mutedText">
          <span className="px-3 py-1 rounded-full bg-bgColorSecondary border border-border flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Google AdSense Approved Policy
          </span>
          <span className="px-3 py-1 rounded-full bg-bgColorSecondary border border-border flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            256-Bit SSL Encrypted
          </span>
          <span className="px-3 py-1 rounded-full bg-bgColorSecondary border border-border flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            DMCA Protected
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-mutedText text-xs text-center sm:text-left">
            © {new Date().getFullYear()} <span className="text-secondaryTextColor font-semibold">{SITENAME}</span>. All Rights Reserved. · Designed for Cinema Lovers 🎬
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-secondaryTextColor hover:text-primaryBtn transition-colors bg-bgColorSecondary px-3 py-1.5 rounded-full border border-border"
            aria-label="Back to top"
          >
            <HiArrowUp />
            Back to Top
          </button>
        </div>

      </div>
    </footer>
  );
}
