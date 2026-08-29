import { useState } from 'react';
import InteractiveBackground from './components/InteractiveBackground';
import LandingPage from './components/LandingPage';
import SimulatorView from './components/simulator/SimulatorView';
import CreateUniverseModal from './components/CreateUniverseModal';
import { LaymanModeProvider } from './context/LaymanModeContext';
import type { SimulationLog, Universe } from './types/temporal';
import './App.css';

function App() {
  const [view, setView] = useState<'landing' | 'simulator'>('landing');
  const [showCreateUniverse, setShowCreateUniverse] = useState(false);
  const [generatedState, setGeneratedState] = useState<{ universe: Universe; logs: SimulationLog[] } | null>(null);

  return (
    <LaymanModeProvider>
      <InteractiveBackground />

      {view === 'landing' ? (
        <LandingPage onStartSimulator={() => setShowCreateUniverse(true)} />
      ) : (
        <SimulatorView initialState={generatedState} onExit={() => setView('landing')} />
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
