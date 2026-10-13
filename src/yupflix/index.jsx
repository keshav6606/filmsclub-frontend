import React, { useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { YupflixHeader } from './components/YupflixHeader';
import { YupflixHome, YupflixBrowse } from './pages/YupflixHome';
import { YupflixDetail } from './pages/YupflixDetail';
import { YupflixSearch } from './pages/YupflixSearch';
import './styles/yupflix.css';

export function YupflixModule() {
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  return (
    <div className="yupflix-module min-h-screen text-white bg-[#0a0c10] -mx-3 -mt-3 md:-mx-10 md:-mt-10 pb-16">
      <YupflixHeader
        searchInputRef={searchInputRef}
        isSearching={isSearching}
        onSearchingChange={setIsSearching}
      />

      <div className="wrap pt-4">
        <Routes>
          <Route index element={<YupflixHome />} />
          <Route path="browse/:type" element={<YupflixBrowse />} />
          <Route path="t/:code" element={<YupflixDetail />} />
          <Route path="search" element={<YupflixSearch />} />
          <Route path="*" element={<YupflixHome />} />
        </Routes>
      </div>
    </div>
  );
}

export default YupflixModule;
