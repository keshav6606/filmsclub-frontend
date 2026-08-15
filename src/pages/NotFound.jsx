import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import error from "../assets/lotte/404.json";
import SEO from "../components/SEO";
import { HiHome } from "react-icons/hi2";

const NotFoundPage = () => {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4uhd";

  return (
    <div className="flex flex-col w-full min-h-[70vh] max-md:mt-24 text-white items-center justify-center px-4">
      <SEO
        title={`404 - Page Not Found | ${SITENAME}`}
        description={`The page you are looking for does not exist on ${SITENAME}.`}
      />
      <div className="max-w-md w-full">
        <Lottie
          animationData={error}
          className="w-full h-auto"
          loop={true}
          autoplay={true}
        />
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-white mt-4 text-center">
        Oops! Page Not Found
      </h1>
      <p className="text-slate-400 text-xs sm:text-sm text-center mt-2 max-w-sm">
        The movie, series, or page you were looking for might have been moved or removed.
      </p>
      <Link
        to="/"
        className="mt-6 btn-gold flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold shadow-gold"
      >
        <HiHome className="text-base" />
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
