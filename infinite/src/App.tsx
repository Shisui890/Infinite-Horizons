import { useState } from 'react';
import InteractiveBackground from './components/InteractiveBackground';
import LandingPage from './components/LandingPage';
import SimulatorView from './components/simulator/SimulatorView';
import HowItWorksPage from './components/HowItWorksPage';
import OurUniversePage from './components/OurUniversePage';
import CreateUniverseModal from './components/CreateUniverseModal';
import { LaymanModeProvider } from './context/LaymanModeContext';
import type { SimulationLog, Universe } from './types/temporal';
import { URLCompression } from './utils/urlCompression';
import './App.css';

function getInitialSharedState(): { universe: Universe; logs: SimulationLog[] } | null {
  if (typeof window !== 'undefined' && window.location.hash) {
    const decoded = URLCompression.decodeUniverseFromHash(window.location.hash);
    if (decoded) {
      return {
        universe: decoded,
        logs: [
          {
            id: `log-shared-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            message: `Universo compartilhado "${decoded.name}" carregado com sucesso via URL.`,
            type: 'success',
          },
        ],
      };
    }
  }
  return null;
}

function App() {
  const [initialShared] = useState(getInitialSharedState);
  const [view, setView] = useState<'landing' | 'simulator' | 'guide' | 'our-universe'>(
    initialShared ? 'simulator' : 'landing'
  );
  const [showCreateUniverse, setShowCreateUniverse] = useState(false);
  const [generatedState, setGeneratedState] = useState<{ universe: Universe; logs: SimulationLog[] } | null>(initialShared);

  return (
    <LaymanModeProvider>
      <InteractiveBackground />

      {view === 'landing' && (
        <LandingPage
          onStartSimulator={() => setShowCreateUniverse(true)}
          onOpenGuide={() => setView('guide')}
          onOpenOurUniverse={() => setView('our-universe')}
        />
      )}

      {view === 'guide' && (
        <HowItWorksPage
          onBack={() => setView('landing')}
          onStartSimulator={() => setShowCreateUniverse(true)}
        />
      )}

      {view === 'our-universe' && (
        <OurUniversePage
          onBack={() => setView('landing')}
          onStartSimulator={() => {
            setView('simulator');
          }}
        />
      )}

      {view === 'simulator' && (
        <SimulatorView
          initialState={generatedState}
          onExit={() => setView('landing')}
          onOpenGuide={() => setView('guide')}
        />
      )}

      {showCreateUniverse && (
        <CreateUniverseModal
          onClose={() => setShowCreateUniverse(false)}
          onCreated={state => {
            setGeneratedState(state);
            setShowCreateUniverse(false);
            setView('simulator');
          }}
        />
      )}
    </LaymanModeProvider>
  );
}

export default App;
