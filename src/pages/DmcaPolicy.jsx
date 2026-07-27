import React, { useEffect } from "react";
import SEO from "../components/SEO";
import { HiOutlineShieldExclamation, HiOutlineCheckBadge, HiOutlineEnvelope, HiOutlineDocumentText } from "react-icons/hi2";

export default function DmcaPolicy() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";
  const CANONICAL = `https://${SITENAME.toLowerCase()}.com/dmca`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-24 text-primaryTextColor">
      <SEO
        title={`DMCA Copyright Policy & Takedown Protocol - ${SITENAME}`}
        description={`Official DMCA Copyright Policy for ${SITENAME}. Learn how copyright owners can submit takedown notices or counter-notifications under the Digital Millennium Copyright Act.`}
        link={CANONICAL}
        name={SITENAME}
        type="website"
      />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-semibold text-xs mb-4">
          <HiOutlineShieldExclamation className="text-base" />
          DMCA Compliance Notice
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold gold-text mb-4">DMCA Copyright Policy</h1>
        <p className="text-secondaryTextColor text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          <span className="text-primaryTextColor font-semibold">{SITENAME}</span> respects the intellectual property rights of creators and content owners. We comply strictly with the Digital Millennium Copyright Act (DMCA) of 1998 (17 U.S.C. § 512).
        </p>
        <p className="text-mutedText text-xs mt-2">Designated Copyright Agent Contact: dmca@{SITENAME.toLowerCase()}.com</p>
      </div>

      {/* Main Content */}
      <div className="space-y-8 glass-card p-6 sm:p-10 rounded-2xl border border-border">
        
        {/* Important Non-Hosting Notice */}
        <section className="bg-bgColorSecondary/80 p-5 rounded-xl border border-accent/30 space-y-2">
          <div className="flex items-center gap-2 text-accent font-bold text-base">
            <HiOutlineDocumentText className="text-xl" />
            Important Notice Regarding Media Files
          </div>
          <p className="text-secondaryTextColor text-xs sm:text-sm leading-relaxed">
            {SITENAME} DOES NOT host, upload, store, or transmit any video files, media files, or copyrighted material on its servers. All media items displayed on this site are indexed from public third-party external networks and community channels.
          </p>
        </section>

        {/* DMCA Takedown Notice Requirements */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-primaryBtn flex items-center gap-2">
            <HiOutlineCheckBadge className="text-2xl" />
            Submitting a Valid DMCA Notice
          </h2>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            If you are a copyright owner or an authorized agent thereof and believe that any content indexed on {SITENAME} infringes upon your copyright, you may submit a written notice containing the following mandatory information:
          </p>
          <ol className="list-decimal list-inside text-secondaryTextColor text-sm space-y-2 pl-2">
            <li>
              <strong className="text-primaryTextColor">Physical or Electronic Signature:</strong> A signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
            </li>
            <li>
              <strong className="text-primaryTextColor">Identification of Copyrighted Work:</strong> Clear identification of the copyrighted work claimed to have been infringed.
            </li>
            <li>
              <strong className="text-primaryTextColor">Specific URL Location:</strong> Identification of the specific material/URL on {SITENAME} that is claimed to be infringing, sufficient for us to locate the item.
            </li>
            <li>
              <strong className="text-primaryTextColor">Contact Information:</strong> Information reasonably sufficient to permit us to contact you, such as your full legal name, physical address, telephone number, and email address.
            </li>
            <li>
              <strong className="text-primaryTextColor">Good Faith Statement:</strong> A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
            </li>
            <li>
              <strong className="text-primaryTextColor">Accuracy & Penalty of Perjury Statement:</strong> A statement under penalty of perjury that the information in the notification is accurate and that you are authorized to act on behalf of the owner.
            </li>
          </ol>
        </section>

        <hr className="border-border/50" />

        {/* Processing SLA & Agent Contact */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primaryBtn">Takedown Processing SLA</h2>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            Upon receipt of a valid DMCA notice containing all required points listed above, {SITENAME} will take prompt action to remove or disable access to the infringing material within <strong className="text-primaryTextColor">24 to 48 hours</strong>.
          </p>
          <div className="bg-bgColorSecondary p-4 rounded-xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <HiOutlineEnvelope className="text-2xl text-accent" />
              <span>Send Notices To: <span className="text-accent font-bold">dmca@{SITENAME.toLowerCase()}.com</span></span>
            </div>
            <a
              href={`mailto:dmca@${SITENAME.toLowerCase()}.com?subject=DMCA%20Takedown%20Notice`}
              className="btn-gold px-4 py-2 text-xs rounded-full shrink-0"
            >
              Email DMCA Agent
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
