import React, { useEffect } from "react";
import SEO from "../components/SEO";
import { HiOutlineShieldCheck, HiOutlineLockClosed, HiOutlineDocumentText, HiOutlineEye } from "react-icons/hi2";

export default function PrivacyPolicy() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";
  const CANONICAL = `https://${SITENAME.toLowerCase()}.com/privacy-policy`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-24 text-primaryTextColor">
      <SEO
        title={`Privacy Policy - ${SITENAME}`}
        description={`Read the official Privacy Policy for ${SITENAME}. Learn how we protect user privacy, handle cookies, Google AdSense ads, data protection, and GDPR/CCPA rights.`}
        link={CANONICAL}
        name={SITENAME}
        type="website"
      />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold text-xs mb-4">
          <HiOutlineShieldCheck className="text-base" />
          Google AdSense & GDPR Compliant
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold gold-text mb-4">Privacy Policy</h1>
        <p className="text-secondaryTextColor text-sm sm:text-base max-w-2xl mx-auto">
          At <span className="text-primaryTextColor font-semibold">{SITENAME}</span>, accessible from{" "}
          <a href={CANONICAL} className="text-primaryBtn hover:underline">{CANONICAL}</a>, one of our main priorities is the privacy of our visitors.
        </p>
        <p className="text-mutedText text-xs mt-2">Last Updated: July 2026</p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8 glass-card p-6 sm:p-10 rounded-2xl border border-border">
        
        {/* Information We Collect */}
        <section className="space-y-3">
          <div className="flex items-center gap-3 text-lg font-bold text-primaryBtn">
            <HiOutlineEye className="text-2xl shrink-0" />
            <h2>1. Information We Collect</h2>
          </div>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            If you contact us directly via email or our contact form, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you choose to provide.
          </p>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            Like many other websites, {SITENAME} uses standard log files. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any personally identifiable information.
          </p>
        </section>

        <hr className="border-border/50" />

        {/* Cookies and Web Beacons */}
        <section className="space-y-3">
          <div className="flex items-center gap-3 text-lg font-bold text-primaryBtn">
            <HiOutlineLockClosed className="text-2xl shrink-0" />
            <h2>2. Cookies and Web Beacons</h2>
          </div>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            Like any other website, {SITENAME} uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>
        </section>

        <hr className="border-border/50" />

        {/* Google DoubleClick DART Cookie & AdSense */}
        <section className="space-y-3">
          <div className="flex items-center gap-3 text-lg font-bold text-accent">
            <HiOutlineDocumentText className="text-2xl shrink-0" />
            <h2>3. Google DoubleClick DART Cookie & Third-Party Vendors</h2>
          </div>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL:{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primaryBtn hover:underline"
            >
              https://policies.google.com/technologies/ads
            </a>
          </p>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            Some of advertisers on our site may use cookies and web beacons. Our advertising partners include Google AdSense and third-party ad networks. Each of our advertising partners has their own Privacy Policy for their policies on user data.
          </p>
        </section>

        <hr className="border-border/50" />

        {/* Third Party Privacy Policies */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primaryBtn">4. Third-Party Privacy Policies</h2>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            {SITENAME}'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
          </p>
        </section>

        <hr className="border-border/50" />

        {/* GDPR Privacy Rights */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primaryBtn">5. GDPR Data Protection Rights (European Users)</h2>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
          </p>
          <ul className="list-disc list-inside text-secondaryTextColor text-sm space-y-1.5 pl-2">
            <li><strong className="text-primaryTextColor">The right to access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong className="text-primaryTextColor">The right to rectification:</strong> You have the right to request correction of inaccurate information.</li>
            <li><strong className="text-primaryTextColor">The right to erasure:</strong> You have the right to request erasure of your personal data under certain conditions.</li>
            <li><strong className="text-primaryTextColor">The right to restrict processing:</strong> You have the right to request restrictions on data processing.</li>
          </ul>
        </section>

        <hr className="border-border/50" />

        {/* CCPA Privacy Rights */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primaryBtn">6. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
          <p className="text-secondaryTextColor text-sm leading-relaxed">
            Under the CCPA, among other rights, California consumers have the right to request that a business disclose the categories and specific pieces of personal data collected, or request deletion of personal data. {SITENAME} does not sell personal information to third parties.
          </p>
        </section>

        <hr className="border-border/50" />

        {/* Contact Information */}
        <section className="space-y-3 bg-bgColorSecondary/60 p-5 rounded-xl border border-border">
          <h2 className="text-base font-bold text-primaryTextColor">Questions or Privacy Concerns?</h2>
          <p className="text-secondaryTextColor text-sm">
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through our{" "}
            <a href="/contact" className="text-primaryBtn font-semibold hover:underline">Contact Us Page</a> or via email at{" "}
            <span className="text-accent font-semibold">privacy@{SITENAME.toLowerCase()}.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
