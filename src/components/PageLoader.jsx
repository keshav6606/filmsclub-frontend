import React from "react";

const PageLoader = () => {
  const SITENAME = import.meta.env.VITE_SITENAME || "FILMSCLUB";

  return (
    <div className="page-loader-overlay">
      <div className="loader"></div>
      <div className="brand-loader">{SITENAME}</div>
    </div>
  );
};

export default PageLoader;
