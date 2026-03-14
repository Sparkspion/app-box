/* global process fetch */
/**
 * App Box API Gateway
 * 
 * Secure serverless entry point with Admin Authorization.
 */

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { action, id, base } = req.query;
  const adminKey = req.headers['x-box-admin-key'];

  // 1. Authorization Check
  // If BOX_ADMIN_KEY is set in environment, we REQUIRE it.
  const REQUIRED_KEY = process.env.BOX_ADMIN_KEY;
  
  if (REQUIRED_KEY && adminKey !== REQUIRED_KEY) {
    // We return a 401 but allow the "Public" status check to pass if no action is provided
    if (action) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        details: 'This action requires Super Admin credentials.' 
      });
    }
  }

  if (!action) {
    // Simple health check for the gateway
    return res.status(200).json({ status: 'ready', authorized: !!(adminKey && adminKey === REQUIRED_KEY) });
  }

  const fetchOptions = {
    headers: {
      'User-Agent': 'AppBox-Gateway/1.0',
      'Accept': 'application/json',
    },
  };

  try {
    // --- 1. SPECIAL AGGREGATED ACTIONS ---
    if (action === 'POKEMON_FULL') {
      const POKE_BASE = process.env.PUBLIC_POKEMON_API || 'https://pokeapi.co/api/v2';
      const [pRes, sRes] = await Promise.all([
        fetch(`${POKE_BASE}/pokemon/${id}`, fetchOptions),
        fetch(`${POKE_BASE}/pokemon-species/${id}`, fetchOptions)
      ]);
      
      if (!pRes.ok) throw new Error("Pokemon not found");
      const pData = await pRes.json();
      const sData = sRes.ok ? await sRes.json() : { genera: [] };
      
      const speciesName = sData.genera.find(g => g.language.name === 'en')?.genus || "";
      
      return res.status(200).json({
        name: pData.name,
        image: pData.sprites.other['official-artwork'].front_default,
        types: pData.types.map(t => t.type.name),
        id: pData.id,
        species: speciesName
      });
    }

    // --- 2. SIMPLE MAPPED ACTIONS ---
    const TARGETS = {
      POKEMON_DETAIL: `${process.env.PUBLIC_POKEMON_API || 'https://pokeapi.co/api/v2'}/pokemon/${id}`,
      CURRENCY_LATEST: `${process.env.PUBLIC_CURRENCY_API || 'https://api.frankfurter.app'}/latest?from=${base}`,
    };

    const finalUrl = TARGETS[action];

    if (!finalUrl || finalUrl.includes('undefined')) {
      return res.status(400).json({ error: `Invalid or unconfigured action: ${action}` });
    }

    const response = await fetch(finalUrl, fetchOptions);
    if (!response.ok) throw new Error(`Target responded with ${response.status}`);

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') 
      ? await response.json() 
      : { contents: await response.text() };

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json(data);

  } catch (error) {
    console.error(`Gateway Error [${action}]:`, error.message);
    return res.status(502).json({ error: 'Gateway failure', details: error.message });
  }
}
