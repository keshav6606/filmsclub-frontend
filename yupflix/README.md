# 🎬 Yupflix (1-to-1 Full-Stack Clone)

> A complete, point-to-point, 1-to-1 replica of **[Yupflix](https://yupflix.org/)** — featuring the 24-hour verification landing gate, full movie/series/anime catalog, interactive platform filters (Netflix, Prime, Hotstar, etc.), instant client-side search across **19,000+ titles**, and functional high-speed stream/download resolution.

---

## ⚡ Quick Start (तुरंत कैसे चलाएं)

### 1. Start the Server (सर्वर चालू करें)
```bash
npm start
# या
node server.js
```
The server starts instantly in milliseconds with **zero external dependencies required** (Node.js 18+ built-in)!

### 2. Open in Browser (ब्राउज़र में खोलें)
- **Main Streaming App**: [http://localhost:3000/](http://localhost:3000/)
- **Gate Verification Landing Page**: [http://localhost:3000/gate](http://localhost:3000/gate)
- **Direct Search**: [http://localhost:3000/search](http://localhost:3000/search)

---

## 🚀 Key Features & Decoded Architecture (प्रमुख विशेषताएं और सिस्टम विवरण)

### 1. 🚪 24-Hour Gate Verification System (`/gate` & `POST /enter`)
- Exact dark Netflix-style landing page from `https://yupflix.com/`.
- Features the **"Enter & Start Watching"** CTA, feature highlights, 3-step workflow, and FAQ accordions.
- Submitting the gate sets a secure 24-hour pass cookie (`yf_pass` and `yf_seen`) and seamlessly transitions into the streaming catalog.

### 2. 🎞️ Full Catalog & Dynamic Filtering
- **Types**: All, Movies (`/browse/movie`), Web Series (`/browse/series`), Anime (`/browse/anime`).
- **Platform Carousel**: Clickable official platform badges for **Netflix**, **Amazon Prime Video**, **JioHotstar**, **ZEE5**, **SonyLIV**, **Apple TV+**, **MX Player**, **Hoichoi**, **Lionsgate Play**, **ULLU**, **Voot**, **ALTBalaji**, and **Kooku**.
- **Industry Toggle**: Hollywood vs Bollywood instant filter.
- **Filters**: Genre (Action, Drama, Comedy, Thriller, etc.), Release Year (2026 down to 1997), Audio Language (Hindi, English, Dual Audio, Punjabi, Tamil, Telugu, Korean, Bengali, Malayalam, etc.), and Sort Order (Newest added, Popularity, Release year).

### 3. 🔍 Live Autocomplete Search Across 19,000+ Titles
- Embedded `search-index.json` containing **19,092 titles** pre-scraped and ready.
- Typo-tolerant, weighted search ranking matching exact phrases, prefixes, keywords, and release years.
- Interactive search dropdown with poster thumbnails, titles, latest episode indicators, and keyboard navigation (Up/Down/Enter/Escape).

### 4. 📺 Title Details & Real Download / Stream Links (`/t/:code`)
- Ambient poster glow backdrop with responsive layout.
- High-res poster, metadata badges (Audio languages, Video codec, 4K/1080p/720p/480p badges, Seasons count, Release year).
- **Movie Releases**: Lists all available download resolutions with exact file sizes, source tags (`BluRay`, `WEB-DL`, `10-bit HEVC`, `x264`), recommended badges, and direct links.
- **Web Series Releases**:
  - Interactive tab switch between **Episodes** and **Season Packs (ZIP)**.
  - Season selector pills ("Season 1", "Season 2", etc.).
  - Sort order toggle ("Newest first" / "Oldest first").
  - Quick quality selectors (1080p, 720p, 480p).
  - Expandable episode accordions with download buttons.
- **Working Download Resolver (`/api/dl?t=...`)**: Intercepts download tokens and resolves them directly to the active Cloudflare Worker / vCloud high-speed stream servers.

### 5. 🔄 Autonomous Scraper & Synchronizer (`scraper.js`)
Fetch fresh titles, update trending lists, or scrape any movie on demand:
```bash
# Scrape trending & home catalog:
node scraper.js

# Deep scrape all categories (movies, series, anime, full search index):
node scraper.js --all

# Scrape a specific title by code:
node scraper.js --title 8b78e238a680e1563cf5
```

---

## 📁 Project Directory Structure (प्रोजेक्ट फ़ाइल संरचना)

```
clone/
├── server.js               # Production Node.js server with caching, proxy, and auth
├── scraper.js              # Autonomous scraper CLI tool
├── test_server.js          # Automated endpoint test suite (12/12 passing)
├── package.json            # Scripts & project manifest
├── README.md               # Documentation
├── public/                 # Web application assets
│   ├── index.html          # Main Yupflix streaming SPA HTML
│   ├── gate.html           # 24-hour verification landing gate page
│   ├── icon.svg            # Yupflix official logo icon
│   ├── assets/
│   │   ├── index.css       # Complete exact Yupflix CSS stylesheet (24.5 KB)
│   │   ├── app.js          # Standalone, optimized React application bundle
│   │   ├── favicon.svg     # SVG Favicon
│   │   ├── favicon-32.png  # PNG Favicon
│   │   └── apple-touch-icon.png
│   └── providers/          # Platform logos (Netflix, Prime, Hotstar, ZEE5, etc.)
└── data/                   # Scraped local database
    ├── search-index.json   # 19,092+ titles search index (1.6 MB)
    ├── home.json           # Home page trending & genres
    ├── trending.json       # Top trending titles
    ├── genres.json         # All 28 film & series genres
    ├── browse_all.json     # Browse catalog
    ├── browse_movie.json   # Movies catalog
    ├── browse_series.json  # Web Series catalog
    ├── browse_anime.json   # Anime catalog
    └── titles/             # Detailed title JSON files (sources, episodes, links)
```

---

## 🧪 Testing (परीक्षण)

Run the built-in test suite:
```bash
npm test
# या
node test_server.js
```
Verifies all 12 core endpoints:
- `GET /` (200 OK)
- `GET /gate` (200 OK)
- `POST /enter` (302 Redirect + Cookie)
- `GET /assets/index.css` (200 OK)
- `GET /assets/app.js` (200 OK)
- `GET /api/session` (200 OK)
- `GET /api/home` (200 OK)
- `GET /api/genres` (200 OK)
- `GET /api/browse?type=movie` (200 OK)
- `GET /api/t/:code` (200 OK)
- `GET /providers/netflix.jpeg` (200 OK)
- `GET /api/search-index.json` (200 OK, 19,092 titles)

---

## 💡 Dual Offline/Online Mode (ऑफलाइन और ऑनलाइन दोनों में काम करता है)

1. **Offline Mode**: If internet is not available, the server automatically reads from the local `data/` directory. All 19,000+ search titles, trending rails, platform filters, and cached movies render instantly.
2. **Online Mode**: When connected, the server dynamically proxies un-cached title requests to Yupflix, automatically acquires and maintains fresh `yf_pass` session tokens, caches results locally, and forwards downloads to active streaming mirrors!
