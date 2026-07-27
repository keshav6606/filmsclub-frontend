import React, { useEffect } from "react";
import SEO from "../components/SEO";
import { HiOutlineScale, HiOutlineCheckCircle, HiOutlineExclamationTriangle } from "react-icons/hi2";

export default function TermsOfService() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";
  const CANONICAL = `https://${SITENAME.toLowerCase()}.com/terms`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-24 text-primaryTextColor">
      <SEO
        title={`Terms of Service - ${SITENAME}`}
        description={`Read the official Terms of Service for ${SITENAME}. Learn about user terms, content disclaimers, external links, intellectual property, and site guidelines.`}
        link={CANONICAL}
        name={SITENAME}
        type="website"
      />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primaryBtn/10 border border-primaryBtn/20 text-primaryBtn font-semibold text-xs mb-4">
          <HiOutlineScale className="text-base" />
          Official Terms & Conditions
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold gold-text mb-4">Terms of Service</h1>
        <p className="text-secondaryTextColor text-sm sm:text-base max-w-2xl mx-auto">
          Welcome to <span className="text-primaryTextColor font-semibold">{SITENAME}</span>. By accessing or using our website, you agree to comply with and be bound by the following terms.
        </p>
        <p className="text-mutedText text-xs mt-2">Effective Date: July 2026</p>
      </div>

      {/* Content */}
      <div className="space-y-8 glass-card p-6 sm:p-10 rounded-2xl border border-border">
        
        {/* Acceptance of Terms */}
        <section className="space-y-3">
          <div className="flex items-center gap-3 text-lg font-bold text-primaryBtn">
            <HiOutlineCheckCircle className="text-2xl shrink-0" />
            <h2>1. Acceptance of Terms</h2>
          </div>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            By visiting, accessing, or interacting with {SITENAME}, you signify your agreement to these Terms of Service. If you do not agree with any part of these terms, you must discontinue using our services immediately.
          </p>
        </section>

        <hr className="border-border/50" />

        {/* Use of Website & Intellectual Property */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primaryBtn">2. Intellectual Property & Non-Hosting Disclaimer</h2>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            {SITENAME} operates solely as an information directory and search engine index. We do not host, store, stream, or upload any video files, media content, or copyrighted material on our own servers. All content links and embedded media are hosted by unaffiliated third-party services and networks.
          </p>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            Trademarks, titles, movie logos, images, and brand identifiers featured on this site belong to their respective copyright holders.
          </p>
        </section>

        <hr className="border-border/50" />

        {/* User Obligations */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primaryBtn">3. User Obligations & Permitted Use</h2>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            You agree to use {SITENAME} only for lawful, personal, non-commercial purposes. You are strictly prohibited from:
          </p>
          <ul className="list-disc list-inside text-secondaryTextColor text-sm space-y-1.5 pl-2">
            <li>Using automated bots, scrapers, or data extraction scripts to overload website infrastructure.</li>
            <li>Attempting to breach, disable, or bypass site security or access controls.</li>
            <li>Distributing malicious code, malware, viruses, or spam through the site.</li>
            <li>Violating local, national, or international copyright laws or regulations.</li>
          </ul>
        </section>

        <hr className="border-border/50" />

        {/* Limitation of Liability */}
        <section className="space-y-3">
          <div className="flex items-center gap-3 text-lg font-bold text-accent">
            <HiOutlineExclamationTriangle className="text-2xl shrink-0" />
            <h2>4. Limitation of Liability & Warranty Disclaimer</h2>
          </div>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            {SITENAME} IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE SITE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
          </p>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            IN NO EVENT SHALL {SITENAME}, ITS OPERATORS, OR AFFILIATES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OR INABILITY TO USE THIS WEBSITE OR THIRD-PARTY LINKS.
          </p>
        </section>

        <hr className="border-border/50" />

        {/* Changes to Terms */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primaryBtn">5. Modifications to Terms</h2>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            We reserve the right to revise or update these Terms of Service at any time without prior notice. Continued use of {SITENAME} following any modifications constitutes acceptance of the new terms.
          </p>
        </section>

        <hr className="border-border/50" />

        {/* Contact Info */}
        <section className="space-y-3 bg-bgColorSecondary/60 p-5 rounded-xl border border-border">
          <h2 className="text-base font-bold text-primaryTextColor">Contact Legal Team</h2>
          <p className="text-secondaryTextColor text-sm">
            For legal inquiries or questions regarding our Terms of Service, please contact us at{" "}
            <span className="text-accent font-semibold">legal@{SITENAME.toLowerCase()}.com</span> or visit our{" "}
            <a href="/contact" className="text-primaryBtn font-semibold hover:underline">Contact Page</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
