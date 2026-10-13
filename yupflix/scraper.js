/**
 * Yupflix Autonomous Scraper & Data Synchronizer
 * Usage:
 *   node scraper.js              # Scrapes trending & recent releases
 *   node scraper.js --all        # Deep scrape movies, series, anime, & index
 *   node scraper.js --title <code> # Scrape specific title by code
 */

const fs = require('fs');
const path = require('path');

const UPSTREAM_ORIGIN = 'https://yupflix.org';
const DATA_DIR = path.join(__dirname, 'data');
const TITLES_DIR = path.join(DATA_DIR, 'titles');

if (!fs.existsSync(TITLES_DIR)) fs.mkdirSync(TITLES_DIR, { recursive: true });

let cookie = null;

async function getSessionCookie() {
  if (cookie) return cookie;
  console.log('🔑 Authenticating with Yupflix gate to get pass...');
  try {
    const res = await fetch(`${UPSTREAM_ORIGIN}/enter`, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      const match = setCookie.match(/yf_pass=[^;]+/);
      if (match) {
        cookie = match[0];
        console.log('✅ Session acquired:', cookie.slice(0, 32) + '...');
        return cookie;
      }
    }
  } catch (err) {
    console.error('❌ Authentication failed:', err.message);
  }
  return null;
}

async function fetchJson(endpoint) {
  const c = await getSessionCookie();
  const url = endpoint.startsWith('http') ? endpoint : `${UPSTREAM_ORIGIN}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      ...(c ? { 'Cookie': c } : {})
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${endpoint}`);
  return await res.json();
}

async function scrapeTitle(code) {
  const targetPath = path.join(TITLES_DIR, `${code}.json`);
  try {
    const data = await fetchJson(`/api/t/${code}`);
    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2));
    const titleName = data.title?.title || code;
    const sourcesCount = data.title?.sources?.length || 0;
    console.log(`  💾 [Saved] ${titleName} (${sourcesCount} download sources)`);
    return data;
  } catch (e) {
    console.error(`  ❌ Failed to scrape ${code}:`, e.message);
    return null;
  }
}

async function scrapeHomeAndTrending() {
  console.log('\n--- 1. Scraping Home & Trending Catalog ---');
  try {
    const homeData = await fetchJson('/api/home');
    fs.writeFileSync(path.join(DATA_DIR, 'home.json'), JSON.stringify(homeData, null, 2));
    console.log(`✅ Home scraped: ${homeData.trending?.length || 0} trending items, ${homeData.genres?.length || 0} genres.`);

    const trendingData = await fetchJson('/api/trending');
    fs.writeFileSync(path.join(DATA_DIR, 'trending.json'), JSON.stringify(trendingData, null, 2));
    console.log(`✅ Trending scraped: ${trendingData.trending?.length || 0} items.`);

    const genresData = await fetchJson('/api/genres');
    fs.writeFileSync(path.join(DATA_DIR, 'genres.json'), JSON.stringify(genresData, null, 2));
    console.log(`✅ Genres saved.`);

    console.log('\n--- Scraping details for trending titles ---');
    for (const item of (homeData.trending || [])) {
      if (item.code) {
        await scrapeTitle(item.code);
        await new Promise(r => setTimeout(r, 200));
      }
    }
  } catch (e) {
    console.error('Home/Trending scrape error:', e.message);
  }
}

async function scrapeBrowse(type = 'movie', limitPages = 2) {
  console.log(`\n--- 2. Scraping Browse: ${type} (up to ${limitPages} pages) ---`);
  let allItems = [];
  for (let page = 1; page <= limitPages; page++) {
    try {
      console.log(`Fetching ${type} page ${page}...`);
      const data = await fetchJson(`/api/browse?type=${type}&page=${page}&limit=42`);
      if (data.items && data.items.length) {
        allItems.push(...data.items);
        if (page === 1) {
          fs.writeFileSync(path.join(DATA_DIR, `browse_${type}.json`), JSON.stringify(data, null, 2));
        }
        for (const it of data.items.slice(0, 5)) {
          if (it.code && !fs.existsSync(path.join(TITLES_DIR, `${it.code}.json`))) {
            await scrapeTitle(it.code);
            await new Promise(r => setTimeout(r, 150));
          }
        }
      }
      if (!data.hasMore) break;
    } catch (e) {
      console.error(`Page ${page} failed:`, e.message);
      break;
    }
  }
  console.log(`✅ Scraped ${allItems.length} items for ${type}`);
}

async function scrapeSearchIndex() {
  console.log('\n--- 3. Scraping Full Search Index (19,000+ titles) ---');
  try {
    const data = await fetchJson('/api/search-index.json');
    fs.writeFileSync(path.join(DATA_DIR, 'search-index.json'), JSON.stringify(data));
    console.log(`✅ Search index scraped: ${data.length} total titles in catalog.`);
  } catch (e) {
    console.error('Search index scrape error:', e.message);
  }
}

async function main() {
  const args = process.argv.slice(2);
  console.log('====================================================');
  console.log('🚀 Yupflix Scraper & Synchronizer Started');
  console.log('====================================================');

  if (args.includes('--title')) {
    const codeIdx = args.indexOf('--title') + 1;
    const code = args[codeIdx];
    if (code) {
      await scrapeTitle(code);
    } else {
      console.error('Please specify code: node scraper.js --title <codeOrSlug>');
    }
    return;
  }

  await scrapeHomeAndTrending();

  if (args.includes('--all') || args.includes('--browse')) {
    await scrapeBrowse('movie', 2);
    await scrapeBrowse('series', 2);
    await scrapeBrowse('anime', 2);
  }

  if (args.includes('--all') || args.includes('--index')) {
    await scrapeSearchIndex();
  }

  console.log('\n====================================================');
  console.log(`✨ Scraping Completed Successfully!`);
  console.log(`📁 Cached Titles Total: ${fs.readdirSync(TITLES_DIR).length}`);
  console.log('====================================================');
}

main().catch(err => {
  console.error('Fatal Scraper Error:', err);
});
