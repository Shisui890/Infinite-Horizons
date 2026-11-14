import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import appCssText from '../../App.css?raw';
import App from '../../App';
import '../../components/HowItWorksPage';
import '../../components/OurUniversePage';
import '../../components/simulator/SimulatorView';
import '../../components/CreateUniverseModal';
import '../../components/presentation/ConferenceModeModal';
import '../../components/visualization/Minkowski3DModal';
import '../../components/simulator/MonteCarloModal';
import '../../components/simulator/ai/AIDrawer';
import '../../components/simulator/PreflightPreviewModal';
import '../../components/simulator/DimensionComparatorModal';
import '../../components/simulator/KeyboardShortcutsModal';
import '../../components/simulator/InteractiveTourModal';
import '../../components/simulator/CausalBacktrackingModal';
import '../../components/visualization/KerrBlackHoleModal';
import '../../components/simulator/AcademicPaperExportModal';
import '../../components/simulator/CosmicAcousticsModal';
import '../../components/simulator/TimelineSplitComparatorModal';
import '../../components/simulator/VintageNewspaperModal';
import '../../components/simulator/TemporalChallengesModal';
import '../../components/simulator/TemporalCLIModal';
import { useSimulationStore } from '../../store/useSimulationStore';

// Setup browser API mocks for JSDOM test-drive
beforeEach(() => {
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollBy = vi.fn();

  // Mock 2D canvas context so all canvas animations/renderers execute their drawing logic cleanly
  const mockGradient = {
    addColorStop: vi.fn(),
  };
  const mock2DContext = {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => []),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    ellipse: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 42 })),
    transform: vi.fn(),
    rect: vi.fn(),
    roundRect: vi.fn(),
    clip: vi.fn(),
    quadraticCurveTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    setLineDash: vi.fn(),
    createLinearGradient: vi.fn(() => mockGradient),
    createRadialGradient: vi.fn(() => mockGradient),
    canvas: { width: 800, height: 600 },
  };

  HTMLCanvasElement.prototype.getContext = vi.fn((contextId: string) => {
    if (contextId === '2d') {
      return mock2DContext as unknown as CanvasRenderingContext2D;
    }
    return null;
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

describe('Full Site Test-Drive (E2E UI, Modals, Math & CSS Audit)', () => {
  it('1. CSS Stylesheet Integrity: balanced braces and critical layout guards', () => {
    const css = appCssText;

    // Check balanced curly braces across the entire 19,000+ line CSS file
    let depth = 0;
    for (let i = 0; i < css.length; i++) {
      if (css[i] === '{') depth++;
      if (css[i] === '}') depth--;
      expect(depth).toBeGreaterThanOrEqual(0);
    }
    expect(depth).toBe(0);

    // Check critical single-line guards on Landing Page Navbar
    expect(css).toMatch(/\.landing-nav\s*\{[^}]*max-width:\s*1240px/s);
    expect(css).toMatch(/\.nav-link\s*\{[^}]*white-space:\s*nowrap/s);
    expect(css).toMatch(/\.btn-mode-toggle\s*\{[^}]*white-space:\s*nowrap/s);
    expect(css).toMatch(/\.btn-nav-primary\s*\{[^}]*white-space:\s*nowrap/s);

    // Check TimelineSplitComparatorModal split-half-panel layout guard (prevents overlapping text)
    expect(css).toMatch(/\.split-half-panel\s*\{[^}]*overflow-y:\s*auto/s);
  });

  it('2. Landing Page: renders navbar, hero, demo section, didactic toggle, and footer credits', async () => {
    render(<App />);

    // Brand and Nav links
    expect(screen.getAllByText(/INFINITE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Como Funciona/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Nosso Universo/i).length).toBeGreaterThan(0);

    // Footer Credits check
    const footerAuthors = document.querySelector('.footer-authors');
    expect(footerAuthors).toBeTruthy();
    expect(footerAuthors?.textContent).toContain('Cauã G Madeira');
    expect(footerAuthors?.textContent).toContain('Allan D Abreu');
    expect(footerAuthors?.textContent).toContain('Murilo L Peasks');
    expect(footerAuthors?.textContent).toContain('1°B');

    // Toggle Modo Didático / Modo Rigoroso on Landing Page
    const modeToggleBtn = document.querySelector('.btn-mode-toggle') as HTMLButtonElement;
    expect(modeToggleBtn).toBeTruthy();
    fireEvent.click(modeToggleBtn);
    expect(modeToggleBtn.textContent).toMatch(/Modo Didático|Modo Rigoroso/i);
  });

  it('3. HowItWorksPage: navigates to guide and renders all 5 tabs with valid KaTeX math', async () => {
    render(<App />);

    const guideBtn = screen.getAllByText(/Como Funciona/i)[0];
    fireEvent.click(guideBtn);

    await waitFor(
      () => {
        expect(document.querySelector('.how-it-works-page')).toBeTruthy();
      },
      { timeout: 5000 }
    );

    const tabButtons = document.querySelectorAll('.guide-tab-btn');
    expect(tabButtons.length).toBe(5);

    for (const tabBtn of Array.from(tabButtons)) {
      fireEvent.click(tabBtn);
      // Verify no KaTeX parse errors exist in any tab
      const katexErrors = document.querySelectorAll('.katex-error');
      expect(katexErrors.length).toBe(0);
    }
  });

  it('4. OurUniversePage: navigates to universe explorer and tests all cosmic modes & NASA pillars', async () => {
    render(<App />);

    const universeLinks = screen.getAllByText(/Nosso Universo/i);
    fireEvent.click(universeLinks[0]);

    await waitFor(
      () => {
        expect(document.querySelector('.ed-cockpit-root')).toBeTruthy();
      },
      { timeout: 5000 }
    );

    const modeButtons = document.querySelectorAll('.btn-mode-nav');
    expect(modeButtons.length).toBe(3);

    for (const btn of Array.from(modeButtons)) {
      fireEvent.click(btn);
      const katexErrors = document.querySelectorAll('.katex-error');
      expect(katexErrors.length).toBe(0);

      // If NASA Pillars tab is active, click through every NASA pillar tab
      const pillarTabs = document.querySelectorAll('.nasa-pillar-tab, .pillar-nav-btn');
      for (const pTab of Array.from(pillarTabs)) {
        fireEvent.click(pTab);
        expect(document.querySelectorAll('.katex-error').length).toBe(0);
      }
    }
  });

  it('5. SimulatorView & All Modals: launches simulator, inspects events, and opens/closes all modals', async () => {
    render(<App />);

    // Open Create Universe Modal
    const startBtn = document.querySelector('.btn-nav-primary') as HTMLButtonElement;
    expect(startBtn).toBeTruthy();
    fireEvent.click(startBtn);

    await waitFor(
      () => {
        expect(document.querySelector('.universe-create-card')).toBeTruthy();
      },
      { timeout: 5000 }
    );

    // Click Quick Load button to enter SimulatorView with default universe
    const quickLoadBtn = document.querySelector('.btn-quick-load') as HTMLButtonElement;
    expect(quickLoadBtn).toBeTruthy();
    fireEvent.click(quickLoadBtn);

    await waitFor(
      () => {
        expect(document.querySelector('.sim-header')).toBeTruthy();
      },
      { timeout: 5000 }
    );

    // Test Language Toggle (PT -> EN -> PT)
    const langBtn = document.querySelector('.sim-btn-lang-toggle') as HTMLButtonElement;
    expect(langBtn).toBeTruthy();
    fireEvent.click(langBtn);
    expect(langBtn.textContent).toBe('EN');
    fireEvent.click(langBtn);
    expect(langBtn.textContent).toBe('PT');

    // Select an event in the store and verify EventInspector renders cleanly without bank icon
    const store = useSimulationStore.getState();
    const firstEvent = store.universeState.universe.dimensions[0]?.events[0];
    expect(firstEvent).toBeTruthy();
    act(() => {
      store.setSelectedEventId(firstEvent.id);
    });

    await waitFor(
      () => {
        expect(document.querySelector('.sim-inspector')).toBeTruthy();
      },
      { timeout: 5000 }
    );

    const dossierBadge = document.querySelector('.cf-dossier-badge');
    expect(dossierBadge).toBeTruthy();
    expect(dossierBadge?.textContent).toContain('E SE NÃO EXISTISSE?');
    // Verify the classical bank SVG icon was permanently removed
    expect(dossierBadge?.querySelector('svg')).toBeNull();

    // Helper to open each header modal button, verify no crash/KaTeX error, and press Escape to close
    const modalSelectors = [
      '.sim-btn-splitview',
      '.sim-btn-monte-carlo',
      '.sim-btn-conference',
      '.sim-btn-3d',
      '.sim-btn-kerr',
      '.sim-btn-academic-paper',
      '.sim-btn-acoustics',
      '.sim-btn-timeline-split',
      '.sim-btn-vintage-newspaper',
      '.sim-btn-backtracking',
      '.sim-btn-challenges',
      '.sim-btn-cli',
      '.sim-btn-ai',
    ];

    for (const selector of modalSelectors) {
      const btn = document.querySelector(selector) as HTMLButtonElement | null;
      expect(btn, `Expected button ${selector} to exist in SimulatorHeader`).toBeTruthy();
      fireEvent.click(btn!);

      // Verify zero KaTeX errors while modal is mounted
      await waitFor(
        () => {
          expect(document.querySelectorAll('.katex-error').length).toBe(0);
        },
        { timeout: 5000 }
      );

      // Close modal via Escape key
      fireEvent.keyDown(window, { code: 'Escape', key: 'Escape' });
    }
  });
});
