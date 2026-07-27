import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineEmail, MdOutlineMessage, MdSend, MdOutlineHelpOutline } from "react-icons/md";
import { FaTelegram } from "react-icons/fa";

export default function Contact() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";
  const DOMAIN = `${SITENAME.toLowerCase()}.com`;
  const TG_URL = import.meta.env.VITE_TG_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "General Inquiry",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your message has been sent successfully. We will reply within 24-48 hours.");
      setFormData({
        name: "",
        email: "",
        category: "General Inquiry",
        subject: "",
        message: "",
      });
    }, 1200);
  };

  return (
    <div className="relative mt-20 mb-10 max-w-[1100px] mx-auto px-4 sm:px-6 pb-16 md:pb-0">
      <ToastContainer style={{ fontSize: "0.85rem" }} />
      <SEO
        title={`Contact Us - ${SITENAME}`}
        description={`Get in touch with the ${SITENAME} support team for DMCA requests, content inquiries, feedback, or general support.`}
        name={SITENAME}
        type="website"
        link={`https://${DOMAIN}/contact`}
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primaryTextColor tracking-tight mb-3">
          Get in Touch with <span className="gold-text">{SITENAME}</span>
        </h1>
        <p className="text-secondaryTextColor text-sm sm:text-base leading-relaxed">
          Have a question, feedback, or DMCA inquiry? Fill out the form below or send us an email. Our support team operates 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Contact Info Cards */}
        <div className="space-y-6">
          <div className="glass-card p-6 border border-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primaryBtn/10 flex items-center justify-center text-primaryBtn mb-3">
              <MdOutlineEmail className="text-2xl" />
            </div>
            <h3 className="text-base font-bold text-primaryTextColor">Email Support</h3>
            <p className="text-xs text-secondaryTextColor leading-relaxed">
              For general inquiries, partnership, or technical feedback:
            </p>
            <span className="text-sm font-semibold text-primaryBtn block">support@{DOMAIN}</span>
          </div>

          <div className="glass-card p-6 border border-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 mb-3">
              <MdOutlineHelpOutline className="text-2xl" />
            </div>
            <h3 className="text-base font-bold text-primaryTextColor">DMCA & Copyright Takedowns</h3>
            <p className="text-xs text-secondaryTextColor leading-relaxed">
              For copyright removal requests, please provide complete post URLs and ownership proof:
            </p>
            <span className="text-sm font-semibold text-red-400 block">dmca@{DOMAIN}</span>
          </div>

          {TG_URL && (
            <div className="glass-card p-6 border border-[#0088cc]/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc] mb-3">
                <FaTelegram className="text-2xl" />
              </div>
              <h3 className="text-base font-bold text-primaryTextColor">Telegram Channel</h3>
              <p className="text-xs text-secondaryTextColor leading-relaxed">
                Connect directly with our community for rapid updates:
              </p>
              <a
                href={TG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0088cc] hover:underline"
              >
                Join Official Telegram &rarr;
              </a>
            </div>
          )}
        </div>

        {/* Right Column - Contact Form */}
        <div className="lg:col-span-2 glass-card p-6 sm:p-8 border border-border">
          <h2 className="text-xl font-bold text-primaryTextColor mb-6 flex items-center gap-2">
            <MdOutlineMessage className="text-primaryBtn" />
            Send Us a Direct Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-secondaryTextColor uppercase tracking-wider mb-2">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full bg-bgColorSecondary border border-border rounded-xl px-4 py-2.5 text-sm text-primaryTextColor placeholder-mutedText outline-none focus:border-primaryBtn transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondaryTextColor uppercase tracking-wider mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-bgColorSecondary border border-border rounded-xl px-4 py-2.5 text-sm text-primaryTextColor placeholder-mutedText outline-none focus:border-primaryBtn transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-secondaryTextColor uppercase tracking-wider mb-2">
                  Inquiry Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-bgColorSecondary border border-border rounded-xl px-4 py-2.5 text-sm text-primaryTextColor outline-none focus:border-primaryBtn transition-colors"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="DMCA & Copyright">DMCA & Copyright Takedown</option>
                  <option value="Technical Issue">Technical / Playback Issue</option>
                  <option value="Movie Request">Movie / Series Request</option>
                  <option value="Business & Partnership">Business & Advertising</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondaryTextColor uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief summary of your inquiry"
                  className="w-full bg-bgColorSecondary border border-border rounded-xl px-4 py-2.5 text-sm text-primaryTextColor placeholder-mutedText outline-none focus:border-primaryBtn transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondaryTextColor uppercase tracking-wider mb-2">
                Your Message <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here..."
                required
                className="w-full bg-bgColorSecondary border border-border rounded-xl px-4 py-3 text-sm text-primaryTextColor placeholder-mutedText outline-none focus:border-primaryBtn transition-colors resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2 text-sm font-bold rounded-xl shadow-gold hover:scale-[1.02] transition-all"
            >
              {isSubmitting ? (
                <span>Sending...</span>
              ) : (
                <>
                  <MdSend className="text-base" />
                  Submit Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
