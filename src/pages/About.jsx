import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { MdLocalMovies, MdHighQuality, MdOutlineSecurity, MdOutlineSpeed } from "react-icons/md";
import { HiOutlineFilm, HiOutlineSparkles, HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { FaTelegram } from "react-icons/fa";

export default function About() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";
  const TG_URL = import.meta.env.VITE_TG_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <MdHighQuality className="text-3xl text-cyanNeon" />,
      title: "Ultra HD & 4K Streaming",
      desc: "Enjoy pristine video playback with multiple resolution choices (480p, 720p, 1080p, 4K) tailored to your network speed.",
    },
    {
      icon: <HiOutlineSparkles className="text-3xl text-violetNeon" />,
      title: "Multi-Audio & Subtitles",
      desc: "Access movies and TV shows in original dual-audio formats including Hindi Dubbed, South Indian, and international titles.",
    },
    {
      icon: <MdOutlineSpeed className="text-3xl text-emeraldStudio" />,
      title: "Fast Direct Downloads",
      desc: "Seamless single-click download links powered by cloud servers and high-speed Telegram media integration.",
    },
    {
      icon: <MdOutlineSecurity className="text-3xl text-goldRef" />,
      title: "100% Free & Transparent",
      desc: "No hidden subscription fees, no credit card requirements, and zero sign-ups needed to watch or stream your favorite media.",
    },
  ];

  return (
    <div className="relative mt-20 mb-10 max-w-[1200px] mx-auto px-4 sm:px-6 pb-16 md:pb-0">
      <SEO
        title={`About Us - ${SITENAME}`}
        description={`Learn more about ${SITENAME}, your premier destination for free HD movies, series, and high-speed entertainment updates.`}
        name={SITENAME}
        type="website"
        link={`https://${SITENAME.toLowerCase()}.com/about`}
      />

      {/* Hero Banner Section */}
      <div className="relative rounded-2xl overflow-hidden glass-card p-8 sm:p-12 mb-10 text-center border border-cyanNeon/20 bg-[#080B11]/80 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-cyanNeon/10 via-transparent to-violetNeon/10 pointer-events-none" />
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyanNeon to-violetNeon shadow-cyan mb-6">
          <MdLocalMovies className="text-3xl text-void" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-primaryTextColor font-outfit tracking-tight mb-4">
          Welcome to <span className="gold-text">{SITENAME}</span>
        </h1>
        <p className="max-w-2xl mx-auto text-secondaryTextColor text-base sm:text-lg leading-relaxed">
          Your ultimate gateway to seamless cinematic entertainment. We curate, index, and organize HD movies, trending web series, and TV shows in a clean, user-friendly portal.
        </p>
      </div>

      {/* Mission & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="glass-card p-6 sm:p-8 space-y-4 bg-[#080B11]/80 border border-white/10 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-primaryTextColor flex items-center gap-2 font-outfit">
            <HiOutlineFilm className="text-cyanNeon text-2xl" />
            Our Vision & Purpose
          </h2>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            At <strong>{SITENAME}</strong>, we believe high-quality entertainment should be easily accessible to movie lovers worldwide without cumbersome barriers, aggressive pop-ups, or compulsory paid memberships.
          </p>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            We operate as an intelligent information indexer that connects users to publicly hosted third-party streams and cloud media repositories, ensuring fast loading times and minimal clutter.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 space-y-4 bg-[#080B11]/80 border border-white/10 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-primaryTextColor flex items-center gap-2 font-outfit">
            <HiOutlineDevicePhoneMobile className="text-violetNeon text-2xl" />
            Designed for Modern Users
          </h2>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            Our platform is built from the ground up with modern web technologies (React, TailwindCSS, and Framer Motion) to deliver a lightning-fast responsive interface on mobile, tablet, and desktop screens.
          </p>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            Whether you are looking for the latest blockbuster releases, Hollywood cinema, Bollywood blockbusters, or binge-worthy web series, our library is updated daily.
          </p>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-primaryTextColor text-center mb-8 font-outfit">
          Why Choose <span className="gold-text">{SITENAME}</span>?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-6 flex flex-col items-start bg-[#080B11]/80 border border-white/10 hover:border-cyanNeon/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan"
            >
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-primaryTextColor mb-2 font-outfit">{item.title}</h3>
              <p className="text-secondaryTextColor text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content & Legal Notice Box */}
      <div className="glass-card p-6 sm:p-8 border border-white/10 bg-[#080B11]/80 backdrop-blur-xl">
        <h3 className="text-lg font-bold text-primaryTextColor mb-3 font-outfit">Content Indexing & Transparency</h3>
        <p className="text-secondaryTextColor text-sm leading-relaxed mb-4">
          Please note that <strong>{SITENAME}</strong> does not host, upload, or store any media files directly on its servers. All media items displayed on this platform refer to publicly accessible links hosted on third-party cloud platforms (such as Telegram). We fully respect intellectual property and comply with international DMCA copyright regulations.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/disclaimer"
            className="btn-outline-gold px-5 py-2 text-xs font-semibold"
          >
            Read DMCA Policy
          </Link>
          <Link
            to="/contact"
            className="text-xs text-secondaryTextColor hover:text-cyanNeon transition-colors font-medium"
          >
            Have Questions? Contact Support &rarr;
          </Link>
        </div>
      </div>

      {/* Telegram Banner */}
      {TG_URL && (
        <div className="mt-10 glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#0088cc]/30">
          <div>
            <h4 className="text-base font-bold text-primaryTextColor">Join Our Official Telegram Channel</h4>
            <p className="text-xs text-secondaryTextColor mt-1">Get instant notifications for new movie drops, multi-audio releases, and direct mirrors.</p>
          </div>
          <a
            href={TG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#0088cc] text-white hover:bg-[#0088cc]/90 transition-all px-6 py-2.5 rounded-full text-sm font-semibold shrink-0 shadow-lg"
          >
            <FaTelegram className="text-lg" />
            Join Telegram
          </a>
        </div>
      )}
    </div>
  );
}
