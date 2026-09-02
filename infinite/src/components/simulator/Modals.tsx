import { useState } from 'react';
import { Dimension, Traveler, TemporalEvent } from '../../types/temporal';
import type { HistoricalResearch } from '../../types/temporal';
import { useLaymanMode } from '../../context/LaymanModeContext';

interface AddEventModalProps {
  dimensions: Dimension[];
  events: TemporalEvent[];
  onClose: () => void;
  onAddEvent: (eventData: {
    title: string;
    description: string;
    sourceUrl?: string;
    year: number;
    dimensionId: string;
    category: string;
    importance: number;
    causeIds: string[];
  }) => void;
  onResearchHistoricalEvent: (query: string) => Promise<HistoricalResearch>;
}

export function AddEventModal({ dimensions, events, onClose, onAddEvent, onResearchHistoricalEvent }: AddEventModalProps) {
  const { isLaymanMode } = useLaymanMode();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(2025);
  const [dimensionId, setDimensionId] = useState(dimensions[0]?.id || '');
  const [category, setCategory] = useState('FÍSICA TEÓRICA');
  const [importance, setImportance] = useState(85);
  const [causeId, setCauseId] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [researchMessage, setResearchMessage] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  async function handleHistoricalResearch() {
    if (!title.trim()) {
      setResearchMessage('Digite o nome de uma teoria, experimento ou marco para pesquisar.');
      return;
    }
    setIsResearching(true);
    setResearchMessage('Pesquisando fundamentos com IA e bases científicas...');
    try {
      const result = await onResearchHistoricalEvent(title);
      setTitle(result.title);
      setDescription(result.description);
      setYear(result.year);
      setCategory(result.category);
      setImportance(result.importance);
      setSourceUrl(result.source.startsWith('http') ? result.source : '');
      setResearchMessage(`Fonte / Referência: ${result.source}`);
    } catch (error) {
      setResearchMessage(error instanceof Error ? error.message : 'Não foi possível pesquisar este tema.');
    } finally {
      setIsResearching(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent({
      title,
      description,
      sourceUrl: sourceUrl || undefined,
      year: Number(year),
      dimensionId,
      category,
      importance: Number(importance),
      causeIds: causeId ? [causeId] : [],
    });
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {isLaymanMode ? '+ NOVO ACONTECIMENTO NA HISTÓRIA' : '+ NOVO NÓ CAUSAL NO ESPAÇO-TEMPO'}
          </h2>
          <button type="button" className="btn-modal-close" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            <span>{isLaymanMode ? 'Nome do Acontecimento ou Invenção *' : 'Título do Evento / Descoberta Teórica *'}</span>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={isLaymanMode ? 'Ex: Invenção do Computador ou Descoberta da Luz' : 'Ex: Equações de Yang-Mills ou Detecção de Matéria Escura'}
              required
            />
            <button type="button" className="research-event-button" onClick={handleHistoricalResearch} disabled={isResearching}>
              {isResearching ? 'PESQUISANDO...' : (isLaymanMode ? 'PESQUISAR AUTOMATICAMENTE COM IA' : 'PESQUISAR COM IA & BASES CIENTÍFICAS')}
            </button>
            {researchMessage && <span className="research-event-message">{researchMessage}</span>}
          </label>

          <label>
            <span>{isLaymanMode ? 'Ano em que Aconteceu' : 'Coordenada Temporal (Ano)'}</span>
            <input
              type="number"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              placeholder="2025"
            />
          </label>

          <label>
            <span>{isLaymanMode ? 'Linha do Tempo' : 'Variedade Dimensional'}</span>
            <select value={dimensionId} onChange={e => setDimensionId(e.target.value)}>
              {dimensions.map(d => (
                <option key={d.id} value={d.id}>
                  {d.designation} — {d.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{isLaymanMode ? 'Área da Ciência' : 'Domínio da Física / Categoria'}</span>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="FÍSICA TEÓRICA">FÍSICA TEÓRICA (RELATIVIDADE / CORDAS)</option>
              <option value="COSMOLOGIA">COSMOLOGIA (BIG BANG / UNIVERSO)</option>
              <option value="MECÂNICA QUÂNTICA">MECÂNICA QUÂNTICA (ÁTOMOS / PARTÍCULAS)</option>
              <option value="ASTROFÍSICA">ASTROFÍSICA (ESTRELAS / BURACOS NEGROS)</option>
              <option value="OBSERVAÇÃO">OBSERVAÇÃO & ASTRONOMIA (TELESCÓPIOS)</option>
              <option value="HISTÓRICO">HISTÓRIA DA CIÊNCIA</option>
              <option value="TECNOLÓGICO">TECNOLOGIA & ENGENHARIA</option>
            </select>
          </label>

          <label>
            <span>{isLaymanMode ? `Importância para a História: ${importance}%` : `Peso Causal no Continuum: ${importance}/100`}</span>
            <input
              type="range"
              min="1"
              max="100"
              value={importance}
              onChange={e => setImportance(Number(e.target.value))}
            />
          </label>

          <label>
            <span>{isLaymanMode ? 'O que causou este acontecimento? (Opcional)' : 'Geodésica Causa Anterior (Opcional)'}</span>
            <select value={causeId} onChange={e => setCauseId(e.target.value)}>
              <option value="">{isLaymanMode ? 'Nenhum (Ponto de Partida Inicial)' : 'Nenhuma (Nó Inicial Independente)'}</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} (Ano {ev.year})
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{isLaymanMode ? 'Explicação do que Aconteceu' : 'Descrição e Fundamentos Teóricos'}</span>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={isLaymanMode ? 'Escreva um breve resumo de como esse acontecimento mudou a história...' : 'Breve resumo da implicação física, equações ou descobertas...'}
              rows={3}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-cta">
              {isLaymanMode ? 'ADICIONAR À HISTÓRIA' : 'ESTABELECER NÓ TEMPORAL'}
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
  const { isLaymanMode } = useLaymanMode();
  const [name, setName] = useState('');
  const [originDimensionId, setOriginDimensionId] = useState(dimensions[0]?.id || '');
  const [originYear, setOriginYear] = useState(2045);
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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {isLaymanMode ? '+ NOVO VIAJANTE NO TEMPO' : '+ NOVA SONDA / OBSERVADOR RELATIVÍSTICO'}
          </h2>
          <button type="button" className="btn-modal-close" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            <span>{isLaymanMode ? 'Nome do Viajante ou Sonda *' : 'Identificação da Sonda / Observador *'}</span>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={isLaymanMode ? 'Ex: Cientista Temporal ou Explorador Alfa' : 'Ex: Sonda Quântica ER-01'}
              required
            />
          </label>

          <label>
            <span>{isLaymanMode ? 'Linha do Tempo de Origem' : 'Variedade de Origem'}</span>
            <select value={originDimensionId} onChange={e => setOriginDimensionId(e.target.value)}>
              {dimensions.map(d => (
                <option key={d.id} value={d.id}>
                  {d.designation} — {d.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{isLaymanMode ? 'Ano em que ele Começou' : 'Ano da Coordenada de Origem'}</span>
            <input
              type="number"
              value={originYear}
              onChange={e => setOriginYear(Number(e.target.value))}
            />
          </label>

          <label>
            <span>{isLaymanMode ? 'Acontecimento Conectado ao Ponto de Partida' : 'Nó Geodésico Âncora de Origem (Preservação de Novikov)'}</span>
            <select value={originEventId} onChange={e => setOriginEventId(e.target.value)}>
              <option value="">{isLaymanMode ? 'Nenhum' : 'Nenhum'}</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} (Ano {ev.year})
                </option>
              ))}
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-cta">
              {isLaymanMode ? 'CRIAR VIAJANTE' : 'LANÇAR OBSERVADOR'}
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
  const { isLaymanMode } = useLaymanMode();
  const [travelerId, setTravelerId] = useState(travelers[0]?.id || '');
  const [destinationYear, setDestinationYear] = useState(1935);
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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {isLaymanMode ? 'FAZER UMA VIAGEM NO TEMPO' : 'INTERVENÇÃO MÉTRICA NO CONE DE LUZ'}
          </h2>
          <button type="button" className="btn-modal-close" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            <span>{isLaymanMode ? 'Quem vai Viajar?' : 'Selecione a Sonda / Observador'}</span>
            <select value={travelerId} onChange={e => setTravelerId(e.target.value)}>
              {travelers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({isLaymanMode ? `Ano Atual: ${t.currentYear}` : `Coordenada Atual: Ano ${t.currentYear}`})
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{isLaymanMode ? 'Ano para onde Deseja Viajar' : 'Ano de Destino da Intervenção'}</span>
            <input
              type="number"
              value={destinationYear}
              onChange={e => setDestinationYear(Number(e.target.value))}
            />
          </label>

          <label>
            <span>{isLaymanMode ? 'Qual acontecimento alterar no passado?' : 'Nó Geodésico a Perturbar (Efeito Borboleta)'}</span>
            <select value={alterTargetEventId} onChange={e => setAlterTargetEventId(e.target.value)}>
              <option value="">{isLaymanMode ? 'Apenas Observar (Sem mudar nada na história)' : 'Apenas Observação Relativística (Sem perturbação)'}</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {isLaymanMode ? `Alterar o Rumos de: ${ev.title} (Ano ${ev.year})` : `Perturbar / Aniquilar: ${ev.title} (Ano ${ev.year})`}
                </option>
              ))}
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-cta btn-travel-submit">
              {isLaymanMode ? 'SALTAR NO TEMPO' : 'DISPARAR INTERVENÇÃO CAUSAL'}
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
  const { isLaymanMode } = useLaymanMode();
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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {isLaymanMode ? '+ CRIAR NOVA LINHA DO TEMPO' : '+ NOVA VARIEDADE DIMENSIONAL (11D)'}
          </h2>
          <button type="button" className="btn-modal-close" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            <span>{isLaymanMode ? 'Nome da Nova Linha do Tempo *' : 'Nome da Dimensão Paralela *'}</span>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={isLaymanMode ? 'Ex: Linha Alternativa Onde a Luz é Mais Rápida' : 'Ex: Ramo Quântico AdS-03 ou Vácuo de Calabi-Yau B'}
              required
            />
          </label>

          <label>
            <span>{isLaymanMode ? 'Sigla / Código' : 'Designação Métrica (Código)'}</span>
            <input
              type="text"
              value={designation}
              onChange={e => setDesignation(e.target.value)}
              placeholder="Ω-03"
            />
          </label>

          <label>
            <span>{isLaymanMode ? 'Cor da Linha do Tempo' : 'Espectro Cromático de Frequência'}</span>
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
              {isLaymanMode ? 'CRIAR LINHA DO TEMPO' : 'SINTETIZAR DIMENSÃO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
