import React from "react";
import SEO from "../components/SEO";
import { YupflixCatalogView } from "../yupflix/pages/YupflixHome";

export default function Home() {
  const SITENAME = import.meta.env.VITE_SITENAME || "Filmy4UHD";

  return (
    <div className="w-full bg-[#07080c] min-h-screen text-white">
      <SEO
        title={`${SITENAME} - Stream 4K UHD Movies, Web Series & OTT Originals`}
        description={`Stream master-grade 4K Ultra HD movies, Netflix, Prime Video, Hotstar & TV shows online with Dolby Sound on ${SITENAME}.`}
        name={SITENAME}
        type="website"
        keywords="watch movies online, watch hd movies, free 4k streaming, filmy4uhd, hindi dubbed movies, netflix movies, prime video online"
        link={`https://${SITENAME.toLowerCase()}.site`}
      />
      <YupflixCatalogView type="" />
    </div>
  );
}
