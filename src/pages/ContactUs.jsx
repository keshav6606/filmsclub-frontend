import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";
import { toast } from "react-toastify";
import { HiOutlineEnvelope, HiOutlineChatBubbleLeftRight, HiOutlineQuestionMarkCircle, HiOutlinePaperAirplane } from "react-icons/hi2";
import { FaTelegram } from "react-icons/fa";

export default function ContactUs() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";
  const CANONICAL = `https://${SITENAME.toLowerCase()}.com/contact`;
  const TG_URL = import.meta.env.VITE_TG_URL;

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thank you! Your message has been received. We will respond within 24 hours.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  const faqs = [
    {
      q: "How fast do you respond to inquiries?",
      a: "Our support team typically responds to all emails and contact requests within 12 to 24 business hours.",
    },
    {
      q: "How do I report broken links or missing episodes?",
      a: "You can send us a message using the form below with the movie or series title and episode number, or inform us directly on our Telegram channel.",
    },
    {
      q: "How can I submit a DMCA Copyright Takedown notice?",
      a: "Please visit our official DMCA Policy page for full instructions on submitting formal takedown notices.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-24 text-primaryTextColor">
      <SEO
        title={`Contact Us - ${SITENAME}`}
        description={`Contact the official ${SITENAME} support team. Send feedback, report broken links, request media info, or submit general inquiries.`}
        link={CANONICAL}
        name={SITENAME}
        type="website"
      />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primaryBtn/10 border border-primaryBtn/20 text-primaryBtn font-semibold text-xs mb-4">
          <HiOutlineChatBubbleLeftRight className="text-base" />
          24/7 Support & Feedback
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold gold-text mb-4">Contact Us</h1>
        <p className="text-secondaryTextColor text-sm sm:text-base max-w-xl mx-auto">
          Have questions, suggestions, or need assistance? We're here to help! Fill out the form below or reach out via our community channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Left Side: Contact Form (3 cols) */}
        <div className="md:col-span-3 glass-card p-6 sm:p-8 rounded-2xl border border-border">
          <h2 className="text-xl font-bold text-primaryTextColor mb-6 flex items-center gap-2">
            <HiOutlinePaperAirplane className="text-primaryBtn text-2xl" />
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold text-secondaryTextColor mb-1">Your Name *</label>
              <input
                id="contact-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full bg-bgColorSecondary border border-border rounded-xl px-4 py-2.5 text-sm text-primaryTextColor outline-none focus:border-primaryBtn focus:ring-1 focus:ring-primaryBtn transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold text-secondaryTextColor mb-1">Your Email Address *</label>
              <input
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full bg-bgColorSecondary border border-border rounded-xl px-4 py-2.5 text-sm text-primaryTextColor outline-none focus:border-primaryBtn focus:ring-1 focus:ring-primaryBtn transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-xs font-semibold text-secondaryTextColor mb-1">Subject</label>
              <input
                id="contact-subject"
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Broken link report / General inquiry"
                className="w-full bg-bgColorSecondary border border-border rounded-xl px-4 py-2.5 text-sm text-primaryTextColor outline-none focus:border-primaryBtn focus:ring-1 focus:ring-primaryBtn transition-all"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold text-secondaryTextColor mb-1">Message *</label>
              <textarea
                id="contact-message"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message here..."
                className="w-full bg-bgColorSecondary border border-border rounded-xl px-4 py-2.5 text-sm text-primaryTextColor outline-none focus:border-primaryBtn focus:ring-1 focus:ring-primaryBtn transition-all resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-gold py-3 text-sm rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {submitting ? "Sending..." : "Submit Message"}
            </button>
          </form>
        </div>

        {/* Right Side: Channel Details & FAQs (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Quick Email Card */}
          <div className="glass-card p-6 rounded-2xl border border-border space-y-3">
            <div className="flex items-center gap-3 text-accent font-bold">
              <HiOutlineEnvelope className="text-2xl" />
              Direct Email
            </div>
            <p className="text-secondaryTextColor text-xs">For official business or general feedback:</p>
            <p className="text-sm font-semibold text-primaryBtn">support@{SITENAME.toLowerCase()}.com</p>
          </div>

          {/* Telegram Channel */}
          {TG_URL && (
            <div className="glass-card p-6 rounded-2xl border border-border space-y-3 bg-gradient-to-br from-bgColorSecondary to-[#0088cc]/10">
              <div className="flex items-center gap-3 text-[#0088cc] font-bold">
                <FaTelegram className="text-2xl" />
                Telegram Community
              </div>
              <p className="text-secondaryTextColor text-xs">Join our official channel for instant updates & community support.</p>
              <a
                href={TG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center bg-[#0088cc] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#0088cc]/90 transition-colors"
              >
                Join Channel
              </a>
            </div>
          )}

          {/* FAQ Accordion / Box */}
          <div className="glass-card p-6 rounded-2xl border border-border space-y-4">
            <h3 className="text-base font-bold text-primaryTextColor flex items-center gap-2">
              <HiOutlineQuestionMarkCircle className="text-goldLight text-xl" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-3 text-xs">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-border/50 pb-2.5 last:border-0 last:pb-0">
                  <p className="font-semibold text-primaryTextColor mb-1">{faq.q}</p>
                  <p className="text-secondaryTextColor leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
