/**
 * Network Intelligence Configuration
 * Centralized registry for all external domains and endpoints used by APP BOX.
 */

export const ENDPOINTS = {
  CURRENCY: {
    BASE: 'https://api.frankfurter.app',
    LATEST: (base) => `https://api.frankfurter.app/latest?from=${base}`,
  },
  POKEMON: {
    BASE: 'https://pokeapi.co/api/v2',
    DETAIL: (id) => `https://pokeapi.co/api/v2/pokemon/${id}`,
  },
  PROXY: {
    ALL_ORIGINS: 'https://api.allorigins.win/get',
    wrap: (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  }
};

export const AUTHORIZED_DOMAINS = [
  {
    name: 'Frankfurter API',
    domain: 'api.frankfurter.app',
    purpose: 'Real-time currency exchange rates',
    type: 'Open Source'
  },
  {
    name: 'AllOrigins Proxy',
    domain: 'api.allorigins.win',
    purpose: 'Cypass CORS for reconnaissance scouting',
    type: 'Utility'
  },
  {
    name: 'PokéAPI',
    domain: 'pokeapi.co',
    purpose: 'Entity data for randomizer modules',
    type: 'Community'
  },
  {
    name: 'Shopify Stores',
    domain: '*.myshopify.com',
    purpose: 'Direct market intelligence gathering',
    type: 'Target'
  }
];
