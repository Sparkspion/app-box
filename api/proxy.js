export default async function handler(req, res) {
  // 1. Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url } = req.query;

  // 2. Basic Validation
  if (!url) {
    return res.status(400).json({ error: 'Missing target URL' });
  }

  // 3. Security: Ensure it's a valid absolute URL and not an internal IP
  try {
    const targetUrl = new URL(url);
    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      throw new Error('Invalid protocol');
    }
    
    const hostname = targetUrl.hostname.toLowerCase();
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
    if (blockedHosts.includes(hostname) || hostname.endsWith('.internal')) {
      return res.status(403).json({ error: 'Access to internal network is forbidden' });
    }
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL provided' });
  }

  try {
    // 4. Set a timeout (8 seconds) to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (AppBox Recon Scout; +https://app-box.vercel.app)',
        'Accept': 'application/json, text/html, application/xhtml+xml',
      },
    });

    clearTimeout(timeoutId);

    // 5. Check if the response is too large (Vercel has a 4.5MB limit for serverless responses)
    // We can't easily check size before fetching, but we can check headers if available
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 4000000) {
      return res.status(413).json({ error: 'Target resource is too large' });
    }

    const contentType = response.headers.get('content-type') || '';
    
    // 6. Handle JSON vs HTML/Text
    let data;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { contents: await response.text() };
    }

    // 7. Security Headers for the response
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow your frontend to access it
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30'); // Cache for 1 min
    
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Proxy error for ${url}:`, error.message);
    const status = error.name === 'AbortError' ? 504 : 502;
    return res.status(status).json({ 
      error: error.name === 'AbortError' ? 'Target site timed out' : 'Failed to reach target site',
      details: error.message 
    });
  }
}
