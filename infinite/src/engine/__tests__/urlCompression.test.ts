import { describe, it, expect } from 'vitest';
import { URLCompression } from '../../utils/urlCompression';
import { SimulationService } from '../SimulationService';

describe('URLCompression (Serialização de Universo via URL Hash)', () => {
  it('encodes and decodes a complete universe losslessly', () => {
    const { universe } = SimulationService.createDefaultUniverse();

    const hash = URLCompression.encodeUniverseToHash(universe);
    expect(hash).toBeDefined();
    expect(hash.length).toBeGreaterThan(50);

    const decoded = URLCompression.decodeUniverseFromHash(hash);
    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe(universe.id);
    expect(decoded?.name).toBe(universe.name);
    expect(decoded?.dimensions.length).toBe(universe.dimensions.length);
    expect(decoded?.dimensions[0].events.length).toBe(universe.dimensions[0].events.length);
  });

  it('handles #u= prefix and #/universe= gracefully', () => {
    const { universe } = SimulationService.createDefaultUniverse();
    const hash = URLCompression.encodeUniverseToHash(universe);

    const withPrefix = `#u=${hash}`;
    const decoded = URLCompression.decodeUniverseFromHash(withPrefix);
    expect(decoded?.id).toBe(universe.id);
  });

  it('returns null for corrupted or invalid hash strings', () => {
    expect(URLCompression.decodeUniverseFromHash('')).toBeNull();
    expect(URLCompression.decodeUniverseFromHash('invalid-gibberish-string')).toBeNull();
  });
});
