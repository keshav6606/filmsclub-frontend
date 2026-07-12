import React, { useEffect } from "react";
import SEO from "../components/SEO";

export default function Disclaimer() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative mt-20 mb-10 max-w-[1000px] mx-auto px-4 sm:px-6 pb-16 md:pb-0">
      <SEO
        title={`Disclaimer & DMCA Policy - ${SITENAME}`}
        description={`Disclaimer and DMCA Copyright policy for ${SITENAME}. We do not host any files on our servers. All links point to external content.`}
        name={SITENAME}
        type="website"
        link={`https://${SITENAME}.com/disclaimer`}
      />

      <div className="glass-card p-6 sm:p-10 space-y-6">
        {/* Title */}
        <div className="border-b border-border pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primaryTextColor">
            Disclaimer & DMCA Policy
          </h1>
          <p className="text-xs text-mutedText mt-1.5">Last updated: July 2026</p>
        </div>

        {/* Content Blocks */}
        <section className="space-y-4 text-secondaryTextColor text-sm leading-relaxed">
          <p>
            Welcome to <strong>{SITENAME}</strong>. We value and respect intellectual property rights and ask our users to do the same. Please read this Disclaimer carefully before using the website.
          </p>

          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            1. No Content Hosted on Servers
          </h2>
          <p>
            <strong>{SITENAME}</strong> does not host, store, upload, or transmit any video files, media files, torrents, or copyright-protected content on its own servers. All content shown or linked on this platform is indexer data fetched from public APIs, and the download/streaming links direct users to files hosted entirely on external third-party services (such as Telegram or public cloud storage). 
          </p>
          <p>
            Because we have no control over the content hosted on external channels or sites, we cannot and do not assume any responsibility for the legality, accuracy, compliance, or copyright status of content residing on those third-party platforms.
          </p>

          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            2. DMCA & Copyright Infringement Notices
          </h2>
          <p>
            We comply with the Digital Millennium Copyright Act (DMCA) and international copyright regulations. If you are a copyright owner or an authorized representative thereof and believe that any content linked on our site infringes upon your copyrights, you can submit a written notification to us.
          </p>
          <p>
            To file a valid copyright infringement notice, please provide the following details:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Identify the copyrighted work claimed to have been infringed.</li>
            <li>Identify the specific link (URL) on our site that contains the link to the allegedly infringing material.</li>
            <li>Provide your contact details (Email address, phone number, and physical mailing address).</li>
            <li>Include a statement that you have a good-faith belief that use of the material is not authorized by the copyright owner, its agent, or the law.</li>
            <li>Include a statement, under penalty of perjury, that the information in the notification is accurate and that you are authorized to act on behalf of the owner of the copyright.</li>
            <li>A physical or electronic signature of the copyright owner or authorized representative.</li>
          </ul>

          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            3. Contact Information
          </h2>
          <p>
            For DMCA requests, copyright inquiries, or removal requests, please contact our support team directly. We endeavor to investigate and remove infringing links within 48 to 72 hours of receiving a valid request.
          </p>
          <div className="bg-bgColorSecondary border border-border p-4 rounded-xl mt-4 max-w-sm">
            <span className="text-xs text-mutedText font-semibold uppercase tracking-wider block">
              Contact Email
            </span>
            <span className="text-base text-primaryBtn font-bold block mt-0.5">
              dmca@{SITENAME.toLowerCase()}.com
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
