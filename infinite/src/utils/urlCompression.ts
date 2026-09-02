import type { Universe } from '../types/temporal';

/**
 * Utilitário de Serialização e Compactação de Estado via URL Hash
 */
export class URLCompression {
  /**
   * Codifica o objeto de Universo em uma string Base64 segura para URL
   */
  public static encodeUniverseToHash(universe: Universe): string {
    try {
      const json = JSON.stringify(universe);
      // UTF-8 encoding safe for base64
      const bytes = new TextEncoder().encode(json);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);
      return encodeURIComponent(base64);
    } catch {
      return '';
    }
  }

  /**
   * Decodifica a string da URL Hash de volta em um objeto de Universo
   */
  public static decodeUniverseFromHash(hashString: string): Universe | null {
    if (!hashString) return null;
    try {
      const cleaned = hashString.replace(/^#\/?(u=|universe=)?/, '');
      const decodedUri = decodeURIComponent(cleaned);
      const binary = atob(decodedUri);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const json = new TextDecoder().decode(bytes);
      const parsed = JSON.parse(json) as Universe;
      if (parsed && parsed.dimensions && Array.isArray(parsed.dimensions)) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }
}
