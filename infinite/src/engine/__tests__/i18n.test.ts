import { describe, it, expect } from 'vitest';
import { DICTIONARY, getStoredLanguage, setStoredLanguage } from '../../utils/i18n';

describe('i18n System (Internacionalização PT/EN)', () => {
  it('provides matching keys in both PT and EN dictionaries', () => {
    const ptKeys = Object.keys(DICTIONARY.pt) as Array<keyof typeof DICTIONARY.pt>;
    const enKeys = Object.keys(DICTIONARY.en) as Array<keyof typeof DICTIONARY.en>;

    expect(ptKeys.length).toBe(enKeys.length);
    ptKeys.forEach(k => {
      expect(DICTIONARY.en[k]).toBeDefined();
      expect(DICTIONARY.pt[k]).toBeDefined();
    });
  });

  it('persists and retrieves language preferences', () => {
    setStoredLanguage('en');
    expect(getStoredLanguage()).toBe('en');

    setStoredLanguage('pt');
    expect(getStoredLanguage()).toBe('pt');
  });
});
