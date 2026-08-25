import { useState } from 'react';
import InteractiveBackground from './components/InteractiveBackground';
import LandingPage from './components/LandingPage';
import SimulatorView from './components/simulator/SimulatorView';
import './App.css';

function App() {
  const [view, setView] = useState<'landing' | 'simulator'>('landing');

  return (
    <>
      <InteractiveBackground />

      {view === 'landing' ? (
        <LandingPage onStartSimulator={() => setView('simulator')} />
      ) : (
        <SimulatorView onExit={() => setView('landing')} />
      )}
    </>
  );
}

export default App;
