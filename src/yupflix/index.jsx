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
    <div className="filmsclub-module min-h-screen text-white bg-[#07080c] pb-24 selection:bg-red-600 selection:text-white font-sans">
      <YupflixHeader
        searchInputRef={searchInputRef}
        isSearching={isSearching}
        onSearchingChange={setIsSearching}
      />

      <main className="w-full">
        <Routes>
          <Route index element={<YupflixHome />} />
          <Route path="browse/:type" element={<YupflixBrowse />} />
          <Route path="t/:code" element={<YupflixDetail />} />
          <Route path="search" element={<YupflixSearch />} />
          <Route path="*" element={<YupflixHome />} />
        </Routes>
      </main>
    </div>
  );
}

export default YupflixModule;
