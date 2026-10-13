import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer, TabBar } from './components/Footer';
import { HomePage, BrowsePage } from './pages/HomePage';
import { TitleDetailPage } from './pages/TitleDetailPage';
import { SearchPage } from './pages/SearchPage';

export function App() {
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  // Verification session check
  useEffect(() => {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return;

    fetch('/api/session')
      .then(res => res.json())
      .then(data => {
        if (!data.ok) {
          window.location.replace('/gate');
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="app">
      <Header
        searchInputRef={searchInputRef}
        isSearching={isSearching}
        onSearchingChange={setIsSearching}
      />

      <main className="wrap">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse/:type" element={<BrowsePage />} />
          <Route path="/t/:code" element={<TitleDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />

      <TabBar
        searchInputRef={searchInputRef}
        isSearching={isSearching}
      />
    </div>
  );
}

export default App;
