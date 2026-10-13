const { spawn } = require('child_process');
const http = require('http');

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function get(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: data
      }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function runTests() {
  console.log('Testing Yupflix server endpoints...');
  let passCount = 0;
  let failCount = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passCount++;
    } else {
      console.error(`  ❌ [FAIL] ${name}`);
      failCount++;
    }
  }

  try {
    // 1. Root SPA
    const rRoot = await get('/');
    assert(rRoot.statusCode === 200 && rRoot.body.includes('Yupflix'), 'GET / returns 200 HTML');

    // 2. Gate Landing Page
    const rGate = await get('/gate');
    assert(rGate.statusCode === 200 && rGate.body.includes('Enter Yupflix'), 'GET /gate returns 200 Gate HTML');

    // 3. POST /enter
    const rEnter = await get('/enter', { method: 'POST' });
    const hasCookie = (rEnter.headers['set-cookie'] || []).some(c => c.includes('yf_pass='));
    assert(rEnter.statusCode === 302 && hasCookie, 'POST /enter sets 24h pass cookie and redirects');

    // 4. CSS Asset
    const rCss = await get('/assets/index.css');
    assert(rCss.statusCode === 200 && rCss.headers['content-type'].includes('css'), 'GET /assets/index.css serves CSS');

    // 5. App JS Asset
    const rJs = await get('/assets/app.js');
    assert(rJs.statusCode === 200 && rJs.headers['content-type'].includes('javascript'), 'GET /assets/app.js serves JavaScript');

    // 6. API Session
    const rSession = await get('/api/session');
    const jSession = JSON.parse(rSession.body);
    assert(rSession.statusCode === 200 && jSession.ok === true, 'GET /api/session returns { ok: true }');

    // 7. API Home
    const rHome = await get('/api/home');
    const jHome = JSON.parse(rHome.body);
    assert(rHome.statusCode === 200 && Array.isArray(jHome.trending), 'GET /api/home returns trending list');

    // 8. API Genres
    const rGenres = await get('/api/genres');
    const jGenres = JSON.parse(rGenres.body);
    assert(rGenres.statusCode === 200 && Array.isArray(jGenres.genres), 'GET /api/genres returns genres list');

    // 9. API Browse
    const rBrowse = await get('/api/browse?type=movie');
    const jBrowse = JSON.parse(rBrowse.body);
    assert(rBrowse.statusCode === 200 && Array.isArray(jBrowse.items), 'GET /api/browse?type=movie returns movie items');

    // 10. API Title Detail
    const rTitle = await get('/api/t/8b78e238a680e1563cf5');
    const jTitle = JSON.parse(rTitle.body);
    assert(rTitle.statusCode === 200 && jTitle.title?.title, 'GET /api/t/:code returns full movie detail & sources');

    // 11. Provider Image
    const rImg = await get('/providers/netflix.jpeg');
    assert(rImg.statusCode === 200 && rImg.headers['content-type'].includes('image'), 'GET /providers/netflix.jpeg serves provider logo');

    // 12. Search Index
    const rIndex = await get('/api/search-index.json');
    const jIndex = JSON.parse(rIndex.body);
    assert(rIndex.statusCode === 200 && jIndex.length > 10000, `GET /api/search-index.json returns ${jIndex.length} titles`);

  } catch (err) {
    console.error('Test execution error:', err);
    failCount++;
  }

  console.log('====================================================');
  console.log(`Test Results: ${passCount} Passed, ${failCount} Failed`);
  console.log('====================================================');
  return failCount === 0;
}

// Start server child process and test
const srv = spawn('node', ['server.js'], { stdio: 'inherit' });

async function start() {
  await wait(1200);
  const success = await runTests();
  srv.kill();
  process.exit(success ? 0 : 1);
}

start();
