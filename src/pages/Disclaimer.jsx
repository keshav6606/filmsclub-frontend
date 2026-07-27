import React, { useEffect } from "react";
import SEO from "../components/SEO";
import { MdOutlineGavel, MdOutlineMail, MdOutlineReportProblem } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Disclaimer() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";
  const DOMAIN = `${SITENAME.toLowerCase()}.com`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative mt-20 mb-10 max-w-[1000px] mx-auto px-4 sm:px-6 pb-16 md:pb-0">
      <SEO
        title={`Disclaimer & DMCA Policy - ${SITENAME}`}
        description={`Disclaimer and DMCA Copyright policy for ${SITENAME}. We do not host any files on our servers. All links point to external third-party content.`}
        name={SITENAME}
        type="website"
        link={`https://${DOMAIN}/disclaimer`}
      />

      <div className="glass-card p-6 sm:p-10 space-y-6 border border-border">
        {/* Header */}
        <div className="border-b border-border pb-5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primaryBtn/10 flex items-center justify-center text-primaryBtn shrink-0">
            <MdOutlineGavel className="text-3xl" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primaryTextColor">
              Disclaimer & DMCA Policy
            </h1>
            <p className="text-xs text-mutedText mt-1">Digital Millennium Copyright Act Compliance Statement</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-secondaryTextColor text-sm leading-relaxed">
          <p>
            Welcome to <strong>{SITENAME}</strong> (<span className="text-primaryBtn font-medium">https://{DOMAIN}</span>). We respect the intellectual property rights of creators, filmmakers, and rights owners. Please read this Disclaimer carefully before accessing our directory.
          </p>

          {/* Section 1 */}
          <div className="glass-card p-5 border border-border bg-bgColorSecondary/50">
            <h2 className="text-base font-bold text-primaryTextColor mb-2 flex items-center gap-2">
              <MdOutlineReportProblem className="text-goldLight" />
              1. Non-Hosting & Indexing Declaration
            </h2>
            <p className="text-xs sm:text-sm text-secondaryTextColor leading-relaxed">
              <strong>{SITENAME}</strong> does not host, upload, store, or transmit any video files, MP4s, torrent files, or media files on its server hardware. All title names, posters, and metadata displayed on this platform are indexed via public APIs. External streaming and download links redirect users to third-party file hosts and cloud media channels (such as Telegram) over which we exercise zero administrative control.
            </p>
          </div>

          {/* Section 2 */}
          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            2. Copyright Infringement & Takedown Protocol
          </h2>
          <p>
            In accordance with Title 17, United States Code, Section 512(c)(2) (DMCA), if you believe that your copyrighted work has been linked on {SITENAME} without authorization, you may submit a formal takedown request to our designated email address.
          </p>
          <p className="font-semibold text-primaryTextColor mt-2">
            To ensure swift action, your DMCA notice must include:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm">
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Exact URLs on {SITENAME} where the link or material is located.</li>
            <li>Your contact details (Full legal name, email address, physical address, and phone number).</li>
            <li>A statement of good-faith belief that use of the material is unauthorized.</li>
            <li>A statement under penalty of perjury that the information in the notification is accurate and that you are authorized to act on behalf of the owner.</li>
            <li>An electronic or physical signature of the copyright owner or authorized representative.</li>
          </ul>

          {/* Section 3 */}
          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            3. Processing SLA & Removal Timeline
          </h2>
          <p>
            Upon receipt of a valid, fully detailed DMCA notification, our support team will inspect and remove the reported links within <strong>24 to 48 hours</strong>.
          </p>

          {/* Email Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-bgColorSecondary border border-border p-5 rounded-xl">
              <span className="text-xs text-mutedText font-semibold uppercase tracking-wider block mb-1">
                DMCA Legal Email
              </span>
              <span className="text-base text-red-400 font-bold block">
                dmca@{DOMAIN}
              </span>
            </div>

            <div className="bg-bgColorSecondary border border-border p-5 rounded-xl">
              <span className="text-xs text-mutedText font-semibold uppercase tracking-wider block mb-1">
                General Support
              </span>
              <span className="text-base text-primaryBtn font-bold block">
                support@{DOMAIN}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-mutedText">
            <span>Need further assistance?</span>
            <Link to="/contact" className="text-primaryBtn font-semibold hover:underline">
              Contact Support Form &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
