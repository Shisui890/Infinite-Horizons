import { useState } from 'react';
import { AITemporalService } from '../engine/AITemporalService';
import type { Universe, SimulationLog } from '../types/temporal';

interface Props {
  onClose: () => void;
  onCreated: (state: { universe: Universe; logs: SimulationLog[] }) => void;
}

export default function CreateUniverseModal({ onClose, onCreated }: Props) {
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<'historical' | 'theoretical'>('historical');
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!topic.trim()) return;
    setIsCreating(true);
    setMessage('Pesquisando fontes e montando a linha temporal...');
    try {
      const state = await AITemporalService.createUniverseFromTopic(topic, mode);
      onCreated(state);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível criar esta realidade.');
      setIsCreating(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card universe-create-card">
        <div className="modal-header">
          <div>
            <span className="modal-kicker">NOVO EXPERIMENTO</span>
            <h2>CRIAR REALIDADE COM IA</h2>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose} disabled={isCreating}>Fechar</button>
        </div>
        <p className="universe-create-intro">
          Descreva um tema, evento ou período. A IA pesquisa o contexto, constrói os acontecimentos
          e prepara uma linha para você alterar. Você decide se quer estudar o que aconteceu ou explorar o que poderia ter acontecido.
        </p>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            <span>Tema da realidade</span>
            <input
              autoFocus
              type="text"
              value={topic}
              onChange={event => setTopic(event.target.value)}
              placeholder="Ex.: Segunda Guerra Mundial"
              disabled={isCreating}
              required
            />
          </label>
          <div className="universe-mode-picker" role="group" aria-label="Modo de criação">
            <button type="button" className={mode === 'historical' ? 'active' : ''} onClick={() => setMode('historical')}>
              RECONSTRUÇÃO HISTÓRICA
              <small>Baseada em fontes</small>
            </button>
            <button type="button" className={mode === 'theoretical' ? 'active' : ''} onClick={() => setMode('theoretical')}>
              MODELO TEÓRICO
              <small>Use teorias testáveis</small>
            </button>
          </div>
          <div className="universe-create-examples">
            <span>Experimente:</span>
            <button type="button" onClick={() => setTopic('Segunda Guerra Mundial')}>Segunda Guerra Mundial</button>
            <button type="button" onClick={() => setTopic('Revolução Industrial')}>Revolução Industrial</button>
          </div>
          {message && <p className="research-event-message">{message}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isCreating}>Cancelar</button>
            <button type="submit" className="btn-cta" disabled={isCreating}>
              {isCreating ? 'CONSTRUINDO...' : 'CRIAR LINHA TEMPORAL'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
