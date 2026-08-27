import { useState } from 'react';
import { AITemporalService } from '../engine/AITemporalService';
import { SimulationService } from '../engine/SimulationService';
import type { Universe, SimulationLog } from '../types/temporal';

interface Props {
  onClose: () => void;
  onCreated: (state: { universe: Universe; logs: SimulationLog[] }) => void;
}

export default function CreateUniverseModal({ onClose, onCreated }: Props) {
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<'historical' | 'theoretical'>('theoretical');
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!topic.trim()) return;
    setIsCreating(true);
    setMessage('Estruturando equações de campo, geodésicas e eventos no continuum...');
    try {
      const state = await AITemporalService.createUniverseFromTopic(topic, mode);
      onCreated(state);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível sintetizar este modelo de realidade.');
      setIsCreating(false);
    }
  }

  function handleLoadDefault() {
    const defaultData = SimulationService.createDefaultUniverse();
    onCreated(defaultData);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card universe-create-card">
        <div className="modal-header">
          <div>
            <span className="modal-kicker">MOTOR DE GÊNESE FÍSICO-TEMPORAL</span>
            <h2>SINTETIZAR REALIDADE COM IA</h2>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose} disabled={isCreating}>✕</button>
        </div>

        <p className="universe-create-intro">
          Defina um tema de física teórica ou hipótese cosmológica. A IA pesquisa os fundamentos,
          estabelece os cones de luz causais e prepara uma realidade para você testar.
        </p>

        {/* Quick Shortcut Banner */}
        <div className="universe-quick-shortcut">
          <div className="shortcut-text">
            <strong>Modelo Padrão da Plataforma</strong>
            <span>Cosmologia Relativística (1915-2019) & Teoria M em 11D</span>
          </div>
          <button
            type="button"
            className="btn-quick-load"
            onClick={handleLoadDefault}
            disabled={isCreating}
          >
            Carregar Padrão ⚡
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            <span>Tema da Realidade ou Hipótese Física</span>
            <input
              autoFocus
              type="text"
              value={topic}
              onChange={event => setTopic(event.target.value)}
              placeholder="Ex.: Teoria M e Supercordas em 11D"
              disabled={isCreating}
              required
            />
          </label>

          <div className="universe-mode-picker" role="group" aria-label="Modo de criação">
            <button
              type="button"
              className={mode === 'theoretical' ? 'active' : ''}
              onClick={() => setMode('theoretical')}
            >
              MODELO TEÓRICO / FÍSICA
              <small>Equações, cordas e cones de luz</small>
            </button>
            <button
              type="button"
              className={mode === 'historical' ? 'active' : ''}
              onClick={() => setMode('historical')}
            >
              RECONSTRUÇÃO HISTÓRICA
              <small>Fatos e observações documentadas</small>
            </button>
          </div>

          <div className="universe-create-examples">
            <span className="examples-label">Sugestões:</span>
            <div className="examples-pills">
              <button type="button" onClick={() => setTopic('Teoria M e Supercordas em 11D')}>Supercordas 11D</button>
              <button type="button" onClick={() => setTopic('Buracos de Minhoca e Pontes ER=EPR')}>Pontes ER=EPR</button>
              <button type="button" onClick={() => setTopic('Multiverso Quântico de Hugh Everett')}>Multiverso Everett</button>
              <button type="button" onClick={() => setTopic('Métrica de Alcubierre e Dobra Espacial')}>Dobra Espacial</button>
            </div>
          </div>

          {message && <p className="research-event-message">{message}</p>}

          <div className="modal-actions-clean">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isCreating}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit-universe" disabled={isCreating}>
              {isCreating ? 'Sintetizando...' : 'Sintetizar Universo com IA →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
