import { useState } from 'react';
import { Dimension, Traveler, TemporalEvent } from '../../types/temporal';

interface AddEventModalProps {
  dimensions: Dimension[];
  events: TemporalEvent[];
  onClose: () => void;
  onAddEvent: (eventData: {
    title: string;
    description: string;
    year: number;
    dimensionId: string;
    category: string;
    importance: number;
    causeIds: string[];
  }) => void;
}

export function AddEventModal({ dimensions, events, onClose, onAddEvent }: AddEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(2025);
  const [dimensionId, setDimensionId] = useState(dimensions[0]?.id || '');
  const [category, setCategory] = useState('HISTÓRICO');
  const [importance, setImportance] = useState(80);
  const [causeId, setCauseId] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent({
      title,
      description,
      year: Number(year),
      dimensionId,
      category,
      importance: Number(importance),
      causeIds: causeId ? [causeId] : [],
    });
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>+ NOVO EVENTO TEMPORAL</h2>
          <button type="button" className="btn-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            <span>Título do Evento *</span>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Fundação da Primeira Colônia"
              required
            />
          </label>

          <label>
            <span>Ano / Data</span>
            <input
              type="number"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              placeholder="2025"
            />
          </label>

          <label>
            <span>Dimensão</span>
            <select value={dimensionId} onChange={e => setDimensionId(e.target.value)}>
              {dimensions.map(d => (
                <option key={d.id} value={d.id}>
                  {d.designation} — {d.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Categoria</span>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="HISTÓRICO">HISTÓRICO</option>
              <option value="CIENTÍFICO">CIENTÍFICO</option>
              <option value="TECNOLÓGICO">TECNOLÓGICO</option>
              <option value="POLÍTICO">POLÍTICO</option>
              <option value="NASCIMENTO">NASCIMENTO</option>
              <option value="VIAGEM">VIAGEM</option>
            </select>
          </label>

          <label>
            <span>Evento Causa (Opcional)</span>
            <select value={causeId} onChange={e => setCauseId(e.target.value)}>
              <option value="">Nenhum (Evento Independente)</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.year})
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Descrição</span>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Breve resumo da importância desse evento..."
              rows={3}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-cta">
              CRIAR EVENTO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AddTravelerModalProps {
  dimensions: Dimension[];
  events: TemporalEvent[];
  onClose: () => void;
  onAddTraveler: (data: { name: string; originDimensionId: string; originYear: number; originEventId?: string }) => void;
}

export function AddTravelerModal({ dimensions, events, onClose, onAddTraveler }: AddTravelerModalProps) {
  const [name, setName] = useState('');
  const [originDimensionId, setOriginDimensionId] = useState(dimensions[0]?.id || '');
  const [originYear, setOriginYear] = useState(2060);
  const [originEventId, setOriginEventId] = useState(events[0]?.id || '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    onAddTraveler({
      name,
      originDimensionId,
      originYear: Number(originYear),
      originEventId: originEventId || undefined,
    });
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>+ NOVO VIAJANTE TEMPORAL</h2>
          <button type="button" className="btn-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            <span>Nome do Viajante *</span>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Dr. Chronos"
              required
            />
          </label>

          <label>
            <span>Dimensão de Origem</span>
            <select value={originDimensionId} onChange={e => setOriginDimensionId(e.target.value)}>
              {dimensions.map(d => (
                <option key={d.id} value={d.id}>
                  {d.designation} — {d.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Ano de Origem</span>
            <input
              type="number"
              value={originYear}
              onChange={e => setOriginYear(Number(e.target.value))}
            />
          </label>

          <label>
            <span>Evento de Nascimento/Origem (Para cálculo de Paradoxo do Avô)</span>
            <select value={originEventId} onChange={e => setOriginEventId(e.target.value)}>
              <option value="">Nenhum</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.year})
                </option>
              ))}
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-cta">
              CRIAR VIAJANTE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TimeTravelModalProps {
  travelers: Traveler[];
  events: TemporalEvent[];
  onClose: () => void;
  onExecuteTravel: (data: { travelerId: string; destinationYear: number; alterTargetEventId?: string }) => void;
}

export function TimeTravelModal({ travelers, events, onClose, onExecuteTravel }: TimeTravelModalProps) {
  const [travelerId, setTravelerId] = useState(travelers[0]?.id || '');
  const [destinationYear, setDestinationYear] = useState(1990);
  const [alterTargetEventId, setAlterTargetEventId] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!travelerId) return;

    onExecuteTravel({
      travelerId,
      destinationYear: Number(destinationYear),
      alterTargetEventId: alterTargetEventId || undefined,
    });
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>⚡ EXECUTAR VIAGEM TEMPORAL</h2>
          <button type="button" className="btn-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            <span>Selecione o Viajante</span>
            <select value={travelerId} onChange={e => setTravelerId(e.target.value)}>
              {travelers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} (Atual: {t.currentYear})
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Ano de Destino</span>
            <input
              type="number"
              value={destinationYear}
              onChange={e => setDestinationYear(Number(e.target.value))}
            />
          </label>

          <label>
            <span>Interferência Temporal / Evento Alterado no Passado (Opcional)</span>
            <select value={alterTargetEventId} onChange={e => setAlterTargetEventId(e.target.value)}>
              <option value="">Nenhuma interferência (Apenas observação)</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  Apagar/Modificar: {ev.title} ({ev.year})
                </option>
              ))}
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-cta btn-travel-submit">
              ⚡ SALTAR NO TEMPO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AddDimensionModalProps {
  onClose: () => void;
  onAddDimension: (data: { name: string; designation: string; color: string }) => void;
}

export function AddDimensionModal({ onClose, onAddDimension }: AddDimensionModalProps) {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('Ω-03');
  const [color, setColor] = useState('#ec4899');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    onAddDimension({ name, designation, color });
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>+ NOVA DIMENSÃO</h2>
          <button type="button" className="btn-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            <span>Nome da Dimensão *</span>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Realidade Primordial"
              required
            />
          </label>

          <label>
            <span>Designação Código</span>
            <input
              type="text"
              value={designation}
              onChange={e => setDesignation(e.target.value)}
              placeholder="Ω-03"
            />
          </label>

          <label>
            <span>Cor de Identificação</span>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-cta">
              CRIAR DIMENSÃO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
