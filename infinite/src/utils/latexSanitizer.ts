/**
 * Utility functions for normalizing, sanitizing, and balancing LaTeX strings
 * Extracted from MathFormula component to ensure full Vite React Fast Refresh (HMR) support.
 */

/**
 * Normalizes unicode math characters, delimiters, and common shorthand into valid LaTeX
 */
export function sanitizeLatex(input: string): string {
  if (!input) return '';
  let s = input.trim();

  // Strip trailing unescaped single backslash (common in truncated LLM streams)
  s = s.replace(/(^|[^\\])\\$/, '$1');

  // Fix delimiters: KaTeX rejects \mid after \Big / \big / \Bigg / \left / \right
  // NEVER convert | into \mid globally, as | is the standard delimiter in LaTeX!
  s = s
    .replace(/\\(Big|big|Bigg|bigg|left|right)\s*\\mid/g, '\\$1|')
    .replace(/\\mid\s*\\(Big|big|Bigg|bigg|left|right)/g, '|\\$1');

  // Unicode superscripts
  s = s
    .replace(/⁻³⁵/g, '^{-35}')
    .replace(/⁻¹/g, '^{-1}')
    .replace(/⁻²/g, '^{-2}')
    .replace(/⁻³/g, '^{-3}')
    .replace(/⁻/g, '^-')
    .replace(/⁰/g, '^0')
    .replace(/¹/g, '^1')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/⁴/g, '^4')
    .replace(/⁵/g, '^5')
    .replace(/⁶/g, '^6')
    .replace(/⁷/g, '^7')
    .replace(/⁸/g, '^8')
    .replace(/⁹/g, '^9')
    .replace(/ᵃᵇ/g, '^{ab}')
    .replace(/ᵃ/g, '^a')
    .replace(/ᵇ/g, '^b')
    .replace(/₀/g, '_0')
    .replace(/₁/g, '_1')
    .replace(/₂/g, '_2')
    .replace(/₃/g, '_3')
    .replace(/₄/g, '_4')
    .replace(/₅/g, '_5')
    .replace(/₆/g, '_6')
    .replace(/₇/g, '_7')
    .replace(/₈/g, '_8')
    .replace(/₉/g, '_9')
    .replace(/ᵢ/g, '_i')
    .replace(/ⱼ/g, '_j');

  // Subscript combinations like G_μν or g_μν or T_μν
  s = s
    .replace(/([A-Za-z])_μν/g, '$1_{\\mu\\nu}')
    .replace(/([A-Za-z])_μ/g, '$1_\\mu')
    .replace(/([A-Za-z])_ν/g, '$1_\\nu')
    .replace(/_μν/g, '_{\\mu\\nu}')
    .replace(/_μ/g, '_\\mu')
    .replace(/_ν/g, '_\\nu');

  // Greek letters not already escaped
  const greeks: [string, string][] = [
    ['μ', '\\mu'],
    ['ν', '\\nu'],
    ['Λ', '\\Lambda'],
    ['λ', '\\lambda'],
    ['π', '\\pi'],
    ['σ', '\\sigma'],
    ['ρ', '\\rho'],
    ['β', '\\beta'],
    ['γ', '\\gamma'],
    ['α', '\\alpha'],
    ['ε', '\\varepsilon'],
    ['Ψ', '\\Psi'],
    ['ψ', '\\psi'],
    ['Ω', '\\Omega'],
    ['ω', '\\omega'],
    ['θ', '\\theta'],
    ['ϕ', '\\phi'],
    ['ℏ', '\\hbar'],
    ['Ĥ', '\\hat{H}'],
  ];
  for (const [char, rep] of greeks) {
    const re = new RegExp('(?<!\\\\)' + char, 'g');
    s = s.replace(re, rep + ' ');
  }

  // Common mathematical operators & notations (keep native | as delimiter)
  s = s
    .replace(/≥/g, '\\ge ')
    .replace(/≤/g, '\\le ')
    .replace(/≈/g, '\\approx ')
    .replace(/≠/g, '\\ne ')
    .replace(/±/g, '\\pm ')
    .replace(/×/g, '\\times ')
    .replace(/·/g, '\\cdot ')
    .replace(/⊗/g, '\\otimes ')
    .replace(/∂/g, '\\partial ')
    .replace(/∑/g, '\\sum ')
    .replace(/∫/g, '\\int ')
    .replace(/⟨/g, '\\langle ')
    .replace(/⟩/g, '\\rangle ')
    .replace(/~/g, '\\sim ')
    .replace(/√\(([^)]+)\)/g, '\\sqrt{$1}')
    .replace(/√/g, '\\sqrt ')
    .replace(/(\d+)\s*['\u2019]{2}\/\\text/g, '$1^{\\prime\\prime}/\\text')
    .replace(/\^\\prime/g, '^{\\prime}')
    .replace(/(\d+(?:\.\d+)?)\s*°/g, '$1^{\\circ}')
    .replace(/°/g, '^{\\circ}');

  return s.trim();
}

/**
 * Automatically balances unclosed braces or unclosed \left in LaTeX
 */
export function autoBalanceBraces(latex: string): string {
  let s = latex;
  let openCount = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '{' && (i === 0 || s[i - 1] !== '\\')) openCount++;
    if (s[i] === '}' && (i === 0 || s[i - 1] !== '\\')) openCount--;
  }
  if (openCount > 0) {
    s += '}'.repeat(openCount);
  }
  const lefts = (s.match(/\\left\b/g) || []).length;
  const rights = (s.match(/\\right\b/g) || []).length;
  if (lefts > rights) {
    s += ' \\right.'.repeat(lefts - rights);
  }
  return s;
}
