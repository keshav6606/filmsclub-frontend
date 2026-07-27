import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineCheckCircle, HiOutlineXMark } from "react-icons/hi2";
import { MdOutlineCookie } from "react-icons/md";

export default function CookieConsent() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("filmy4uhd_cookie_consent");
    if (!consent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("filmy4uhd_cookie_consent", "accepted");
    setAccepted(true);
  };

  const handleDecline = () => {
    localStorage.setItem("filmy4uhd_cookie_consent", "declined");
    setAccepted(true);
  };

  return (
    <AnimatePresence>
      {!accepted && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[100] glass-card p-5 rounded-2xl border border-border shadow-card bg-bgColorTertiary/95 backdrop-blur-2xl"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 text-primaryBtn font-bold text-sm">
              <MdOutlineCookie className="text-2xl shrink-0" />
              <span>We Value Your Privacy</span>
            </div>
            <button
              onClick={handleDecline}
              className="text-secondaryTextColor hover:text-primaryTextColor text-lg p-1"
              aria-label="Close cookie banner"
            >
              <HiOutlineXMark />
            </button>
          </div>

          <p className="text-secondaryTextColor text-xs leading-relaxed mb-4">
            We use essential cookies and Google AdSense technologies to personalize content, analyze site traffic, and deliver tailored ad experiences. By clicking "Accept All", you agree to our cookie usage as detailed in our{" "}
            <Link to="/privacy-policy" className="text-primaryBtn underline hover:text-accent">
              Privacy Policy
            </Link>.
          </p>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleAccept}
              className="btn-gold flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
            >
              <HiOutlineCheckCircle className="text-base" />
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="btn-outline-gold px-4 py-2 text-xs font-semibold rounded-xl"
            >
              Essential Only
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
