import React, { useEffect } from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { HiOutlineShieldExclamation, HiOutlineDocumentCheck, HiOutlineEnvelope } from "react-icons/hi2";

export default function Disclaimer() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";
  const CANONICAL = `https://${SITENAME.toLowerCase()}.com/disclaimer`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-24 text-primaryTextColor">
      <SEO
        title={`Disclaimer - ${SITENAME}`}
        description={`General Legal Disclaimer and Non-Hosting Statement for ${SITENAME}. All media links direct to public third-party services.`}
        link={CANONICAL}
        name={SITENAME}
        type="website"
      />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-goldLight/10 border border-goldLight/20 text-goldLight font-semibold text-xs mb-4">
          <HiOutlineShieldExclamation className="text-base" />
          Legal & Non-Hosting Disclaimer
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold gold-text mb-4">Disclaimer</h1>
        <p className="text-secondaryTextColor text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Please read this legal disclaimer carefully before accessing or browsing <span className="text-primaryTextColor font-semibold">{SITENAME}</span>.
        </p>
        <p className="text-mutedText text-xs mt-2">Last Updated: July 2026</p>
      </div>

      {/* Main Container */}
      <div className="space-y-8 glass-card p-6 sm:p-10 rounded-2xl border border-border">
        
        {/* Section 1: Non-Hosting Statement */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primaryBtn flex items-center gap-2">
            <HiOutlineDocumentCheck className="text-2xl" />
            1. Zero Server Hosting Statement
          </h2>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            <strong className="text-primaryTextColor">{SITENAME}</strong> operates strictly as an educational movie directory and search index. We do NOT host, upload, store, or stream any copyrighted video files, media content, or digital assets on our servers. 
          </p>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            All download and streaming links available on this website point to media files hosted on independent third-party external networks, cloud storage providers, and community channels. {SITENAME} has no editorial control over third-party servers.
          </p>
        </section>

        <hr className="border-border/50" />

        {/* Section 2: External Links & Third Party Liability */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primaryBtn">2. External Links & Third-Party Content</h2>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            Our platform contains links to external websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy and Terms of Service of every site you visit.
          </p>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            {SITENAME} assumes no responsibility for the content, privacy policies, legality, or practices of any third-party websites or services.
          </p>
        </section>

        <hr className="border-border/50" />

        {/* Section 3: Copyright & DMCA Takedown */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-accent">3. Copyright Takedowns & DMCA Compliance</h2>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA). If you believe your copyrighted work is indexed on our site without authorization, please refer to our dedicated{" "}
            <Link to="/dmca" className="text-primaryBtn font-semibold hover:underline">DMCA Policy Page</Link> for detailed takedown procedures.
          </p>
        </section>

        <hr className="border-border/50" />

        {/* Section 4: Related Links & Contact */}
        <section className="bg-bgColorSecondary p-6 rounded-xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-primaryTextColor">Need Further Clarification?</h3>
            <p className="text-secondaryTextColor text-xs mt-1">Review our Privacy Policy, Terms of Service, or Contact support team.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/privacy-policy" className="btn-outline-gold px-4 py-2 text-xs">Privacy</Link>
            <Link to="/terms" className="btn-outline-gold px-4 py-2 text-xs">Terms</Link>
            <Link to="/contact" className="btn-gold px-4 py-2 text-xs">Contact</Link>
          </div>
        </section>

      </div>
    </div>
  );
}
