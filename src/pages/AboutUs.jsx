import React, { useEffect } from "react";
import SEO from "../components/SEO";
import { HiOutlineSparkles, HiOutlineFilm, HiOutlineBolt, HiOutlineHeart, HiOutlineShieldCheck } from "react-icons/hi2";

export default function AboutUs() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";
  const CANONICAL = `https://${SITENAME.toLowerCase()}.com/about`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <HiOutlineFilm className="text-3xl text-primaryBtn" />,
      title: "Extensive Cinema Catalog",
      desc: "Handpicked selection of HD movies, trending TV series, anime, South Indian dubbed hits, and international cinema.",
    },
    {
      icon: <HiOutlineBolt className="text-3xl text-accent" />,
      title: "Ultra-Fast Streaming Engine",
      desc: "Optimized video indexing framework built for instant playback, zero lag, and crystal clear resolution across desktop & mobile.",
    },
    {
      icon: <HiOutlineShieldCheck className="text-3xl text-goldLight" />,
      title: "100% Free & Transparent",
      desc: "No hidden paywalls, no forced subscriptions, no intrusive software. Designed with user privacy and simplicity first.",
    },
    {
      icon: <HiOutlineHeart className="text-3xl text-red-400" />,
      title: "Built for Film Enthusiasts",
      desc: "Crafted by passionate cinema lovers to deliver a seamless, high-end entertainment experience every day.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-24 text-primaryTextColor">
      <SEO
        title={`About Us - ${SITENAME}`}
        description={`Learn more about ${SITENAME}. Discover our mission, curation standards, fast streaming technology, and commitment to free HD cinema.`}
        link={CANONICAL}
        name={SITENAME}
        type="website"
      />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold text-xs mb-4">
          <HiOutlineSparkles className="text-base" />
          The Filmy4uhd Story
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold gold-text mb-4">About {SITENAME}</h1>
        <p className="text-secondaryTextColor text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Welcome to <span className="text-primaryTextColor font-semibold">{SITENAME}</span>, your premier digital hub for exploring, indexing, and enjoying the world's finest HD movies, web series, and TV entertainment.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-10">
        
        {/* Mission Statement Banner */}
        <div className="glass-card p-8 rounded-2xl border border-border relative overflow-hidden bg-gradient-to-br from-bgColorSecondary to-bgColorTertiary">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />
          <h2 className="text-xl font-bold gold-text mb-3">Our Mission</h2>
          <p className="text-secondaryTextColor text-sm sm:text-base leading-relaxed">
            Entertainment should be accessible, seamless, and enjoyable for everyone. At {SITENAME}, we combine ultra-modern web technologies, curated movie intelligence, and intuitive user design to create the ultimate destination for movie enthusiasts around the globe.
          </p>
        </div>

        {/* Feature Grid */}
        <div>
          <h2 className="text-xl font-bold text-center text-primaryTextColor mb-6">Why Choose {SITENAME}?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((item, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-xl border border-border/70 hover:border-border transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-base font-bold text-primaryTextColor mb-2">{item.title}</h3>
                <p className="text-secondaryTextColor text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Standards & Transparency */}
        <div className="glass-card p-8 rounded-2xl border border-border space-y-4">
          <h2 className="text-xl font-bold text-primaryBtn">Editorial Standards & Quality Integrity</h2>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            We systematically categorize media titles by genre, language, release year, IMDb ratings, and video resolution quality (4K, 1080p, 720p, HD). We take pride in delivering accurate summaries, high-resolution posters, and clean metadata so you can quickly decide what to watch.
          </p>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            {SITENAME} strictly follows Google AdSense Webmaster Guidelines, GDPR data protection compliance, and intellectual property notice standards.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center p-8 rounded-2xl bg-bgColorSecondary border border-border">
          <h2 className="text-lg font-bold text-primaryTextColor mb-2">Have Suggestions or Feedback?</h2>
          <p className="text-secondaryTextColor text-sm mb-5">
            We are continuously improving our platform. Reach out to our team with your thoughts or recommendations.
          </p>
          <a
            href="/contact"
            className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-sm rounded-full"
          >
            Get In Touch
          </a>
        </div>

      </div>
    </div>
  );
}
