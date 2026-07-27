import React, { useEffect } from "react";
import SEO from "../components/SEO";
import { MdGavel } from "react-icons/md";

export default function Terms() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";
  const DOMAIN = `${SITENAME.toLowerCase()}.com`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative mt-20 mb-10 max-w-[1000px] mx-auto px-4 sm:px-6 pb-16 md:pb-0">
      <SEO
        title={`Terms and Conditions - ${SITENAME}`}
        description={`Terms and Conditions for using ${SITENAME}. Read our rules, acceptable use policy, and legal disclaimer.`}
        name={SITENAME}
        type="website"
        link={`https://${DOMAIN}/terms`}
      />

      <div className="glass-card p-6 sm:p-10 space-y-6">
        {/* Title */}
        <div className="border-b border-border pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primaryBtn/10 flex items-center justify-center text-primaryBtn shrink-0">
            <MdGavel className="text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primaryTextColor">
              Terms & Conditions
            </h1>
            <p className="text-xs text-mutedText mt-1">Last Updated: July 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-secondaryTextColor text-sm leading-relaxed">
          <p>
            Welcome to <strong>{SITENAME}</strong>. These terms and conditions outline the rules and regulations for the use of {SITENAME}'s Website, located at <span className="text-primaryBtn font-medium">https://{DOMAIN}</span>.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use {SITENAME} if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            1. License & Intellectual Property
          </h2>
          <p>
            Unless otherwise stated, {SITENAME} and/or its licensors own the intellectual property rights for all software design, UI layouts, graphics, and code on {SITENAME}. All intellectual property rights are reserved. You may access this from {SITENAME} for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p className="mt-2 font-medium text-primaryTextColor">You must not:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-1">
            <li>Republish material from {SITENAME}</li>
            <li>Sell, rent or sub-license material from {SITENAME}</li>
            <li>Reproduce, duplicate or copy material from {SITENAME} for commercial gain</li>
            <li>Redistribute content from {SITENAME} without express authorization</li>
          </ul>

          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            2. Content Indexing & External Links Notice
          </h2>
          <p>
            <strong>{SITENAME}</strong> functions solely as an indexing indexer and directory. We do not host, store, or stream copyrighted video files directly on our servers. All video links or media files point to third-party file-hosting services or external public Telegram channels.
          </p>
          <p className="mt-2">
            We have no control over the content, availability, or policies of third-party platforms. Using external media links is done entirely at your own risk.
          </p>

          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            3. User Conduct & Acceptable Use
          </h2>
          <p>
            You agree not to use our service for any unlawful purpose or in any way that interrupts, damages, or impairs the functionality of {SITENAME}. Prohibited activities include attempting to bypass security mechanisms, scraping system APIs systematically without authorization, or spamming communication channels.
          </p>

          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            4. Limitation of Liability
          </h2>
          <p>
            In no event shall {SITENAME}, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website. {SITENAME} shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this platform.
          </p>

          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            5. Revisions and Modifications
          </h2>
          <p>
            {SITENAME} reserves the right to revise these Terms and Conditions at any time without prior notice. By continuing to use this website after updates are published, you agree to be bound by the revised version of these terms.
          </p>

          <div className="bg-bgColorSecondary border border-border p-5 rounded-xl mt-8">
            <h3 className="text-sm font-bold text-primaryTextColor uppercase tracking-wider mb-1">Inquiries regarding terms</h3>
            <p className="text-xs text-secondaryTextColor">If you have any questions concerning our Terms and Conditions, please contact us:</p>
            <span className="text-sm font-bold text-primaryBtn block mt-2">support@{DOMAIN}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
