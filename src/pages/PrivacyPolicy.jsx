import React, { useEffect } from "react";
import SEO from "../components/SEO";
import { MdOutlinePrivacyTip } from "react-icons/md";

export default function PrivacyPolicy() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";
  const DOMAIN = `${SITENAME.toLowerCase()}.com`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative mt-20 mb-10 max-w-[1000px] mx-auto px-4 sm:px-6 pb-16 md:pb-0">
      <SEO
        title={`Privacy Policy - ${SITENAME}`}
        description={`Privacy Policy for ${SITENAME}. Learn how we protect user data, handle cookies, and uphold privacy standards.`}
        name={SITENAME}
        type="website"
        link={`https://${DOMAIN}/privacy-policy`}
      />

      <div className="glass-card p-6 sm:p-10 space-y-6">
        {/* Title */}
        <div className="border-b border-border pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primaryBtn/10 flex items-center justify-center text-primaryBtn shrink-0">
            <MdOutlinePrivacyTip className="text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primaryTextColor">
              Privacy Policy
            </h1>
            <p className="text-xs text-mutedText mt-1">Effective Date: July 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-secondaryTextColor text-sm leading-relaxed">
          <p>
            At <strong>{SITENAME}</strong> (accessible from <span className="text-primaryBtn font-medium">https://{DOMAIN}</span>), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by {SITENAME} and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>

          {/* Section 1 */}
          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            1. Consent & Scope
          </h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms. This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in {SITENAME}.
          </p>

          {/* Section 2 */}
          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            2. Log Files & Analytics
          </h2>
          <p>
            {SITENAME} follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files includes:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>Internet Protocol (IP) addresses</li>
            <li>Browser type and Version</li>
            <li>Internet Service Provider (ISP)</li>
            <li>Date and time stamp</li>
            <li>Referring / exit pages</li>
            <li>Number of clicks</li>
          </ul>
          <p className="mt-2">
            These logs are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>

          {/* Section 3 - Google AdSense & Cookies */}
          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            3. Cookies, DoubleClick DART Cookies & Google AdSense
          </h2>
          <p>
            Like any other website, {SITENAME} uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>
          <p className="mt-2">
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL:
          </p>
          <div className="bg-bgColorSecondary p-3 rounded-lg border border-border mt-2 font-mono text-xs text-primaryBtn overflow-x-auto">
            https://policies.google.com/technologies/ads
          </div>

          {/* Section 4 - Third Party Advertisers */}
          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            4. Third-Party Advertising Partners
          </h2>
          <p>
            Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on {SITENAME}, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p className="mt-2 font-medium text-primaryTextColor">
            Note that {SITENAME} has no access to or control over these cookies that are used by third-party advertisers.
          </p>

          {/* Section 5 - CCPA & GDPR Rights */}
          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            5. CCPA & GDPR Data Protection Rights
          </h2>
          <p>
            We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
          </ul>

          {/* Section 6 - Children's Privacy */}
          <h2 className="text-lg font-bold text-primaryTextColor mt-6">
            6. Children's Information
          </h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
          </p>
          <p className="mt-2">
            {SITENAME} does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
          </p>

          {/* Contact box */}
          <div className="bg-bgColorSecondary border border-border p-5 rounded-xl mt-8">
            <h3 className="text-sm font-bold text-primaryTextColor uppercase tracking-wider mb-1">Privacy Contact</h3>
            <p className="text-xs text-secondaryTextColor">If you have any questions or concerns regarding our privacy practices, please contact us at:</p>
            <span className="text-sm font-bold text-primaryBtn block mt-2">privacy@{DOMAIN}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
