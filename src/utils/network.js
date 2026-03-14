import { storage } from './storage';

/**
 * Network Intelligence Configuration
 * Centralized gateway for all external data fetching.
 */

export const GATEWAY = {
  ENDPOINT: '/api/gateway',
  
  /**
   * Primary fetcher that communicates with the secure serverless gateway.
   * Prevents execution if admin key is missing.
   */
  async fetch(action, params = {}) {
    const adminKey = storage.get('admin-key', '');
    
    // STRICT PREVENTION: No key = No network traffic
    if (!adminKey) {
      console.warn(`[Gateway] Blocked ${action} - No Admin Key provided.`);
      throw new Error('UNAUTHORIZED_CLIENT');
    }

    const query = new URLSearchParams({ action, ...params }).toString();
    
    try {
      const response = await fetch(`${this.ENDPOINT}?${query}`, {
        headers: {
          'x-box-admin-key': adminKey
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Gateway request failed');
      }
      
      return response.json();
    } catch (err) {
      if (err.message === 'UNAUTHORIZED_CLIENT') throw err;
      throw new Error('UPLINK_FAILURE');
    }
  },

  // High-level Actions (Syntactic Sugar)
  pokemon: (id) => GATEWAY.fetch('POKEMON_DETAIL', { id }),
  pokemonFull: (id) => GATEWAY.fetch('POKEMON_FULL', { id }),
  currency: (base) => GATEWAY.fetch('CURRENCY_LATEST', { base }),
};

/**
 * Registry of authorized data providers.
 */
export const DATA_PROVIDERS = [
  {
    id: 'POKEMON',
    name: 'Entity Registry',
    purpose: 'Modular data for randomizer engines',
    type: 'Public'
  },
  {
    id: 'CURRENCY',
    name: 'FX Intelligence',
    purpose: 'Real-time molecular conversion offsets',
    type: 'Public'
  }
];
