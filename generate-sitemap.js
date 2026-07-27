import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Simple .env file parser
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return {};
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] ? match[2].trim() : '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[match[1]] = value;
    }
  });
  return env;
}

const env = loadEnv();
const BASE_URL = env.VITE_BASE_URL || 'https://screeching-cherye-filmy4uhd-b60bef55.koyeb.app';
const SITENAME = env.VITE_SITENAME || 'Filmy4uhd';
const CANONICAL_HOST = `https://${SITENAME.toLowerCase()}.com`;

async function generateSitemap() {
  console.log('Generating sitemap...');
  console.log(`API BASE: ${BASE_URL}`);
  console.log(`SITENAME: ${SITENAME}`);
  console.log(`CANONICAL HOST: ${CANONICAL_HOST}`);

  const urls = [
    { loc: `${CANONICAL_HOST}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${CANONICAL_HOST}/movies`, changefreq: 'daily', priority: '0.9' },
    { loc: `${CANONICAL_HOST}/Movies`, changefreq: 'daily', priority: '0.9' },
    { loc: `${CANONICAL_HOST}/series`, changefreq: 'daily', priority: '0.9' },
    { loc: `${CANONICAL_HOST}/Series`, changefreq: 'daily', priority: '0.9' },
    { loc: `${CANONICAL_HOST}/about`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${CANONICAL_HOST}/privacy-policy`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${CANONICAL_HOST}/terms`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${CANONICAL_HOST}/contact`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${CANONICAL_HOST}/disclaimer`, changefreq: 'monthly', priority: '0.7' }
  ];

  // Fetch Movies with safety timeout
  try {
    let page = 1;
    let hasMore = true;
    while (hasMore && page <= 5) {
      const res = await axios.get(`${BASE_URL}/api/movies`, {
        params: { sort_by: 'updated_on:desc', page, page_size: 20 },
        timeout: 7000
      });
      const movies = res.data.movies || [];
      if (movies.length === 0) {
        hasMore = false;
      } else {
        movies.forEach(movie => {
          if (movie.tmdb_id) {
            urls.push({
              loc: `${CANONICAL_HOST}/mov/${movie.tmdb_id}`,
              changefreq: 'weekly',
              priority: '0.8'
            });
          }
        });
        page++;
      }
    }
  } catch (error) {
    console.warn('Warning: Could not fetch movies for sitemap during build:', error.message);
  }

  // Fetch TV Shows with safety timeout
  try {
    let page = 1;
    let hasMore = true;
    while (hasMore && page <= 5) {
      const res = await axios.get(`${BASE_URL}/api/tvshows`, {
        params: { sort_by: 'updated_on:desc', page, page_size: 20 },
        timeout: 7000
      });
      const shows = res.data.tv_shows || [];
      if (shows.length === 0) {
        hasMore = false;
      } else {
        shows.forEach(show => {
          if (show.tmdb_id) {
            urls.push({
              loc: `${CANONICAL_HOST}/ser/${show.tmdb_id}`,
              changefreq: 'weekly',
              priority: '0.8'
            });
          }
        });
        page++;
      }
    }
  } catch (error) {
    console.warn('Warning: Could not fetch tv shows for sitemap during build:', error.message);
  }

  // Build XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  urls.forEach(url => {
    xml += `  <url>\n`;
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += `  </url>\n`;
  });
  
  xml += `</urlset>\n`;

  const outputPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`Sitemap generated successfully at ${outputPath} with ${urls.length} URLs!`);
}

generateSitemap().catch(err => {
  console.warn("Non-fatal sitemap generation error:", err.message);
});
