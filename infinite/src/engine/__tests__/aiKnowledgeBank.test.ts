import { describe, it, expect } from 'vitest';
import {
  AI_KNOWLEDGE_BANK,
  searchKnowledgeBank,
  getKnowledgeBankSeed,
} from '../../data/aiKnowledgeBank';

describe('aiKnowledgeBank (Sub-hidden Token-Optimized Database)', () => {
  it('should have at least 10 high-density astrophysics knowledge entries', () => {
    expect(AI_KNOWLEDGE_BANK.length).toBeGreaterThanOrEqual(10);
  });

  it('should correctly match Novikov self-consistency query with 0 tokens', () => {
    const result = searchKnowledgeBank('Como funciona o princípio de Novikov?');
    expect(result).not.toBeNull();
    expect(result?.id).toBe('novikov');
    expect(result?.title).toContain('Novikov');
    expect(result?.formula).toBeDefined();
  });

  it('should correctly match light cones query', () => {
    const result = searchKnowledgeBank('O que são cones de luz de Minkowski?');
    expect(result).not.toBeNull();
    expect(result?.id).toBe('light_cones');
  });

  it('should correctly match time dilation query', () => {
    const result = searchKnowledgeBank('Explique a dilatação do tempo gravitacional');
    expect(result).not.toBeNull();
    expect(result?.id).toBe('time_dilation');
  });

  it('should generate a compact seed for LLM prompt injection', () => {
    const seed = getKnowledgeBankSeed('buraco negro de kerr e horizonte');
    expect(seed).not.toBeNull();
    expect(seed).toContain('[BASE_LOCAL_OFFLINE]');
    expect(seed!.length).toBeLessThan(300); // Guarantees low token footprint
  });

  it('should return null for queries with no matching concepts', () => {
    const result = searchKnowledgeBank('xyz123nonsense');
    expect(result).toBeNull();
  });
});
