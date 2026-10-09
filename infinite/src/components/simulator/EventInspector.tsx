import { useState, useMemo } from 'react';
import { useLaymanMode } from '../../context/LaymanModeContext';
import { useSimulationStore } from '../../store/useSimulationStore';
import { getLaymanExplanation } from '../../utils/laymanContent';
import type { TemporalEvent } from '../../types/temporal';
import { EventStatus } from '../../types/temporal';
import { AITemporalService } from '../../engine/AITemporalService';
import { LigoAudio } from '../../engine/LigoAudioService';
import MathFormula, { MathText, InlineMathText } from '../MathFormula';
import PhysicsCalculatorWidget from './PhysicsCalculatorWidget';
import ScientificStatusBadge from './ScientificStatusBadge';
import SpacetimeIntervalCard from './SpacetimeIntervalCard';
import GlossaryTerm from '../common/GlossaryTerm';
import { formatHistoricalYear } from '../../utils/formatters';

interface Props {
  event: TemporalEvent | null;
  events: TemporalEvent[];
  onAlterEvent: (eventId: string, status: EventStatus) => void;
  onSimulateAI: (event: TemporalEvent) => void;
  onClose: () => void;
  onOpenVintageNewspaper?: (year?: number, title?: string) => void;
  onOpenSplitComparator?: (scenarioId?: string) => void;
  onOpenCosmicAcoustics?: (signalId?: string) => void;
}

const STATUS_LABELS: Record<EventStatus, { label: string; color: string }> = {
  [EventStatus.STABLE]: { label: 'ESTÁVEL (MINKOWSKI)', color: 'var(--color-stable)' },
  [EventStatus.ALTERED]: { label: 'PERTURBAÇÃO MÉTRICA', color: 'var(--color-warning)' },
  [EventStatus.UNSTABLE]: { label: 'FLUTUAÇÃO QUÂNTICA', color: 'var(--color-warning)' },
  [EventStatus.COLLAPSED]: { label: 'COLAPSO DE SINGULARIDADE', color: 'var(--text-muted)' },
  [EventStatus.PARADOXICAL]: { label: 'PARADOXO (CTC / NOVIKOV)', color: 'var(--color-paradox)' },
  [EventStatus.ERASED]: { label: 'ANIQUILAÇÃO CAUSAL', color: 'var(--text-muted)' },
  [EventStatus.DIVERGED]: { label: 'RAMIFICAÇÃO EVERETTIANA (11D)', color: 'var(--color-dimensional)' },
};

function getStatusInfo(status: EventStatus) {
  return STATUS_LABELS[status] || { label: status, color: '#fff' };
}

export default function EventInspector({
  event,
  events,
  onAlterEvent,
  onSimulateAI,
  onClose,
  onOpenVintageNewspaper,
  onOpenSplitComparator,
  onOpenCosmicAcoustics,
}: Props) {
  const { isLaymanMode } = useLaymanMode();
  const { universeState } = useSimulationStore();
  const [showCalculator, setShowCalculator] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showAiRigorAudit, setShowAiRigorAudit] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [copiedBibtex, setCopiedBibtex] = useState(false);

  function handleCopyCitation(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  }

  function handleCopyBibtex(bib: string) {
    navigator.clipboard.writeText(bib);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  }

  const eventRigorAudit = useMemo(
    () => (event ? AITemporalService.auditEventScientificRigor(event) : null),
    [event]
  );
  const counterfactual = useMemo(
    () => (event ? AITemporalService.generateCounterfactualAnalysis(event, universeState.universe) : null),
    [event, universeState.universe]
  );

  function handlePlayLigoSound() {
    setIsPlayingAudio(true);
    LigoAudio.playLigoChirp();
    setTimeout(() => setIsPlayingAudio(false), 700);
  }

  if (!event) {
    return (
      <aside className="sim-inspector sim-inspector-empty">
        <div className="inspector-placeholder">
          <span className="placeholder-icon">INFO</span>
          <h3>{isLaymanMode ? 'Nenhum Evento Selecionado' : 'SCAN'}</h3>
          <p>
            {isLaymanMode
              ? 'Clique em qualquer ponto na linha do tempo para descobrir a história, ver referências de filmes e entender a ciência!'
              : 'Selecione um nó no mapa de geodésicas para inspecionar seus dados de física, métricas e causalidade.'}
          </p>
        </div>
      </aside>
    );
  }

  const statusInfo = getStatusInfo(event.status);
  const layman = getLaymanExplanation(event.year, event.title);
  
  const eventsMap = new Map(events.map(e => [e.id, e]));

  const causesList = (event.causes || [])
    .map(id => eventsMap.get(id))
    .filter((e): e is TemporalEvent => Boolean(e));
  const consequencesList = (event.consequences || [])
    .map(id => eventsMap.get(id))
    .filter((e): e is TemporalEvent => Boolean(e));
  const physics = AITemporalService.explainEventWithPhysics(event);

  return (
    <aside className="sim-inspector">
      <div className="sim-inspector-header">
        <span className="inspector-tag">
          {isLaymanMode ? 'GUIA DO VIAJANTE NO TEMPO' : 'DOSSIÊ DO NÓ CAUSAL'}
        </span>
        <button type="button" className="sim-btn-close" onClick={onClose} aria-label="Fechar painel do evento">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="inspector-body">
        <h2 className="inspector-title">
          {isLaymanMode ? layman.simpleTitle : event.title}
        </h2>

        {/* Rigorous Scientific Status Badge */}
        <div style={{ marginBottom: '10px' }}>
          <ScientificStatusBadge
            status={event.scientificStatus}
            evidenceKind={event.evidenceKind}
            sourceUrl={event.sourceUrl}
            doi={event.doi}
            academicCitation={event.academicCitation}
          />
        </div>

        {/* Quick Action Tools: Jornal de Época, Antes & Depois (2026), Áudio do Cosmos */}
        <div className="inspector-quick-tools-row">
          {onOpenVintageNewspaper && (
            <button
              type="button"
              className="btn-inspector-quick-tool tool-vintage"
              onClick={() => onOpenVintageNewspaper(event.year, event.title)}
              title="Ler a edição de jornal de época desta descoberta (Edição Real vs Contrafactual)"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                <path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>
              </svg>
              <span>Jornal {formatHistoricalYear(event.year)}</span>
            </button>
          )}

          {onOpenSplitComparator && (
            <button
              type="button"
              className="btn-inspector-quick-tool tool-split"
              onClick={() => {
                const scenarioId = event.year === 1865 ? 'maxwell' : event.year <= 1905 ? 'einstein' : 'quantum';
                onOpenSplitComparator(scenarioId);
              }}
              title="Comparar o Século XXI real vs contrafactual com slider interativo"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>
              </svg>
              <span>Antes & Depois (2026)</span>
            </button>
          )}

          {onOpenCosmicAcoustics && (
            <button
              type="button"
              className="btn-inspector-quick-tool tool-audio"
              onClick={() => {
                const signalId = event.year >= 2015 ? 'gw150914' : event.year === 1965 ? 'cmb' : event.year === 1967 ? 'pulsar' : 'gw150914';
                onOpenCosmicAcoustics(signalId);
              }}
              title="Abrir Laboratório de Acústica do Cosmos (Web Audio API & Osciloscópio)"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 10v4"/><path d="M6 6v12"/><path d="M10 3v18"/><path d="M14 8v8"/><path d="M18 5v14"/><path d="M22 10v4"/>
              </svg>
              <span>Som do Cosmos</span>
            </button>
          )}
        </div>

        {/* Auditoria Científica & Rigor Epistêmico das Fontes Primárias */}
        {eventRigorAudit && (
          <div className="inspector-ai-rigor-box">
            <button
              type="button"
              className={`btn-inspector-ai-rigor ${showAiRigorAudit ? 'active' : ''}`}
              onClick={() => setShowAiRigorAudit(!showAiRigorAudit)}
              title="Verificar fontes primárias acadêmicas, revisão por pares e comprovação documental"
            >
              <span className="btn-ai-rigor-left">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>{isLaymanMode ? 'Validação Científica & Fontes Primárias' : 'Auditoria Epistêmica & Revisão por Pares'}</span>
              </span>
              <span className="ai-rigor-pill">
                {showAiRigorAudit ? 'Ocultar' : `${eventRigorAudit.verdictScore}% Rigor`}
              </span>
            </button>

            {showAiRigorAudit && (
              <div className="inspector-ai-audit-card">
                <div className="audit-card-top">
                  <div className="audit-verdict-badge-group">
                    <span className={`inspector-verdict-pill verdict-${eventRigorAudit.verdict}`}>
                      <span className="verdict-dot" />
                      <span className="verdict-text">{eventRigorAudit.verdictLabel}</span>
                    </span>
                    <span className="audit-rigor-score-pill">
                      <strong>{eventRigorAudit.verdictScore}%</strong> Rigor Factual
                    </span>
                  </div>
                </div>

                <div className="audit-card-summary">
                  <InlineMathText text={eventRigorAudit.expertConsensusSummary} />
                </div>

                <div className="audit-card-physics-row">
                  <div className="physics-sub-pill physics-pill-lorentz">
                    <div className="physics-sub-pill-header">
                      <span className="physics-pill-tag">
                        <GlossaryTerm termId="invariancia_lorentz">INVARIÂNCIA DE LORENTZ</GlossaryTerm>
                      </span>
                      <span className="physics-pill-sym">SO(1,3)</span>
                    </div>
                    <div className="physics-sub-pill-body">
                      <InlineMathText text={eventRigorAudit.lorentzInvarianceCheck} />
                    </div>
                  </div>

                  <div className="physics-sub-pill physics-pill-thermo">
                    <div className="physics-sub-pill-header">
                      <span className="physics-pill-tag">
                        <GlossaryTerm termId="entropia">TERMODINÂMICA RELATIVÍSTICA</GlossaryTerm>
                      </span>
                      <span className="physics-pill-sym">ΔS ≥ 0</span>
                    </div>
                    <div className="physics-sub-pill-body">
                      <InlineMathText text={eventRigorAudit.thermodynamicAssessment} />
                    </div>
                    {eventRigorAudit.entropyDeltaFormula && (
                      <div className="audit-formula-snippet">
                        <MathFormula math={eventRigorAudit.entropyDeltaFormula} block className="eq-audit-katex" />
                      </div>
                    )}
                  </div>
                </div>

                {eventRigorAudit.primaryAcademicSources.length > 0 && (
                  <div className="audit-card-sources">
                    <div className="audit-sources-header">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                        <path d="M6 6h10M6 10h10" />
                      </svg>
                      <span className="audit-sources-label">FONTE ACADÊMICA REGISTRADA (PEER-REVIEW)</span>
                    </div>
                    <div className="audit-source-link">
                      <strong>{eventRigorAudit.primaryAcademicSources[0].author} ({formatHistoricalYear(eventRigorAudit.primaryAcademicSources[0].year)})</strong>
                      <span className="source-citation-text"> — {eventRigorAudit.primaryAcademicSources[0].doiOrCitation}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="inspector-meta-grid">
          <div className="meta-item">
            <span className="meta-label">{isLaymanMode ? 'ANO' : 'COORDENADA TEMPORAL'}</span>
            <span className="meta-value meta-year">{formatHistoricalYear(event.year)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">{isLaymanMode ? 'STATUS DO TEMPO' : 'ESTADO MÉTRICO'}</span>
            <span className="meta-value" style={{ color: statusInfo.color }}>
              {isLaymanMode ? (event.status === EventStatus.STABLE ? 'Salvo e Estável' : 'Linha Alterada') : statusInfo.label}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">{isLaymanMode ? 'TIPO DE FENÔMENO' : 'DOMÍNIO TEÓRICO'}</span>
            <span className="meta-value">{isLaymanMode ? layman.laymanCategory : event.category}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">{isLaymanMode ? 'IMPACTO NO UNIVERSO' : 'PESO CAUSAL'}</span>
            <span className="meta-value">{event.importance}/100</span>
          </div>
        </div>

        {/* 4D Minkowski Spacetime Interval Calculator */}
        <SpacetimeIntervalCard currentEvent={event} allEvents={events} />

        {isLaymanMode ? (
          <div className="layman-explanation-card">
            <div className="layman-card-header">
              <span className="layman-badge">COMO FUNCIONA (SEM COMPLICAÇÃO)</span>
            </div>
            <p className="layman-desc">{layman.simpleDescription}</p>
            <div className="layman-analogy-box">
              <strong>Analogia do Dia a Dia:</strong>
              <p>{layman.analogy}</p>
            </div>
            <div className="layman-pop-culture">
              <span>{layman.popCultureRef}</span>
            </div>
            <div className="layman-fun-fact">
              <strong>Curiosidade:</strong>
              <p>{layman.funFact}</p>
            </div>
          </div>
        ) : (
          <>
            {event.description && (
              <p className="inspector-desc">
                <MathText text={event.description} />
              </p>
            )}

            {/* Dossiê para Estudos Acadêmicos & Universitários */}
            <div className="academic-study-dossier">
              <div className="academic-study-header">
                <div className="academic-study-tag-group">
                  <span className="academic-study-tag">CADERNO DE ESTUDOS UNIVERSITÁRIOS</span>
                  <span className="academic-study-badge">FORMALISMO TENSORIAL</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                  COORD: t={event.year} // ID: {event.id.slice(0, 8)}
                </span>
              </div>

              <div className="academic-study-sections">
                {/* Seção 1: Geometria Diferencial & Conexão de Levi-Civita */}
                <div className="academic-study-section">
                  <span className="academic-study-section-title">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/></svg>
                    1. Geometria Diferencial & Geodésica Afim
                  </span>
                  <p className="academic-study-body">
                    Na variedade pseudo-riemanniana <GlossaryTerm termId="geodesica"><MathFormula math="(\mathcal{M}, g)" /></GlossaryTerm>, a propagação de informação causal segue geodésicas que satisfazem o transporte paralelo do 4-vetor tangente velocidade <MathFormula math="u^\nu \nabla_\nu u^\mu = 0" />. Os coeficientes da conexão afim (símbolos de Christoffel) são determinados unicamente pela métrica:
                  </p>
                  <div className="academic-formula-highlight">
                    <MathFormula math="\Gamma^\mu_{\alpha\beta} = \frac{1}{2} g^{\mu\sigma} \big( \partial_\alpha g_{\beta\sigma} + \partial_\beta g_{\alpha\sigma} - \partial_\sigma g_{\alpha\beta} \big)" block />
                  </div>
                </div>

                {/* Seção 2: Teorema de Noether & Leis de Conservação */}
                <div className="academic-study-section">
                  <span className="academic-study-section-title">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
                    2. Simetrias de Noether & Vetores de Killing
                  </span>
                  <p className="academic-study-body">
                    De acordo com o primeiro teorema de Emmy Noether, toda simetria contínua do funcional de ação implica uma corrente conservada <MathFormula math="\nabla_\mu j^\mu = 0" />. A invariância sob translações temporais gerada pelo vetor de Killing <MathFormula math="\xi^\mu = (\partial_t)^\mu" /> assegura que a energia relativística própria <MathFormula math="E = -\xi_\mu p^\mu" /> seja uma constante de movimento ao longo da geodésica.
                  </p>
                  <div className="academic-formula-highlight">
                    <MathFormula math="\mathcal{L}_\xi g_{\mu\nu} = \nabla_\mu \xi_\nu + \nabla_\nu \xi_\mu = 0 \implies \frac{d}{d\tau}(g_{\mu\nu} \xi^\mu u^\nu) = 0" block />
                  </div>
                </div>

                {/* Seção 3: Conjectura de Censura & Horizonte de Cauchy */}
                <div className="academic-study-section">
                  <span className="academic-study-section-title">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    3. Condições de Energia & Proteção Cronológica
                  </span>
                  <p className="academic-study-body">
                    A preservação da estrutura causal impede a criação descontrolada de Curvas Tipo-Tempo Fechadas (CTCs). Pelo <GlossaryTerm termId="novikov">Princípio de Autoconsistência de Novikov</GlossaryTerm>, a integral de caminho em variedades não-simplesmente conexas anula probabilidades de trajetórias que violem a autoconsistência. No regime semiclássico, o valor esperado do tensor energia-momento renormalizado satisfaz:
                  </p>
                  <div className="academic-formula-highlight">
                    <MathFormula math="\lim_{x \to \partial \mathcal{H}^+} \langle \hat{T}_{\mu\nu}(x) \rangle_{\text{ren}} \to \infty \quad \big( \text{Hawking Chronology Protection, 1992} \big)" block />
                  </div>
                </div>

                {/* Seção 4: Citação Canônica para Artigos e Monografias */}
                <div className="academic-study-section">
                  <span className="academic-study-section-title">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
                    4. Ficha Bibliográfica para Citação (Monografia / TCC / Artigo)
                  </span>
                  <div className="academic-citation-box">
                    <div className="citation-text">
                      {event.academicCitation || `${event.title} (${event.year}). In: Infinite Horizons Archival Database of Theoretical Physics.`}
                    </div>
                    <div className="citation-buttons-row">
                      <button
                        type="button"
                        className={`btn-copy-citation ${copiedCitation ? 'copied' : ''}`}
                        onClick={() => handleCopyCitation(event.academicCitation || `${event.title} (${event.year})`)}
                      >
                        {copiedCitation ? 'Copiado em ABNT!' : 'Copiar ABNT'}
                      </button>
                      <button
                        type="button"
                        className={`btn-copy-citation ${copiedBibtex ? 'copied' : ''}`}
                        onClick={() => {
                          const bib = `@article{ih_${event.id},\n  title={${event.title}},\n  year={${event.year}},\n  note={Infinite Horizons Theoretical Physics Laboratory}\n}`;
                          handleCopyBibtex(bib);
                        }}
                      >
                        {copiedBibtex ? 'Copiado em BibTeX!' : 'Copiar BibTeX'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {(event.year === 2015 || event.title.toLowerCase().includes('ondas gravitacionais') || event.title.toLowerCase().includes('m87')) && (
          <div className="ligo-audio-card">
            <div className="ligo-audio-info">
              <strong>{isLaymanMode ? 'Ouça o Som do Espaço-Tempo' : 'Sinal Acústico Real do Espaço-Tempo'}</strong>
              <span>{isLaymanMode ? 'O chiado real de dois buracos negros colidindo gravado pelo LIGO!' : 'Chirp de fusão GW150914 captado pelos interferômetros do LIGO'}</span>
            </div>
            <button
              type="button"
              className={`btn-play-ligo ${isPlayingAudio ? 'playing' : ''}`}
              onClick={handlePlayLigoSound}
            >
              {isPlayingAudio ? 'Reproduzindo...' : 'Ouvir Colisão no Espaço'}
            </button>
          </div>
        )}

        {event.sourceUrl && (
          <a className="event-source-link" href={event.sourceUrl} target="_blank" rel="noreferrer">
            {isLaymanMode ? 'VER ARTIGO CIENTÍFICO ORIGINAL ↗' : 'VER BASE DOCUMENTAL / TEORIA ↗'}
          </a>
        )}

        <div className="calc-toggle-container">
          <button
            type="button"
            className="btn-toggle-calculator"
            onClick={() => setShowCalculator(!showCalculator)}
          >
            {showCalculator
              ? (isLaymanMode ? '▲ Fechar Brincadeira do Tempo' : '▲ Ocultar Calculadora de Tensores')
              : (isLaymanMode ? 'Simular Efeito Interestelar & Dilatação do Tempo ▼' : 'Abrir Calculadora de Física Computacional ▼')}
          </button>
        </div>

        {showCalculator && <PhysicsCalculatorWidget />}

        {event.isAnchor && (
          <div className="anchor-badge">
            <span>{isLaymanMode ? 'EVENTO FUNDAMENTAL DA HISTÓRIA' : 'ÂNCORA GEODÉSICA DO CONTINUUM'}</span>
            <p>
              {isLaymanMode
                ? 'Este acontecimento é tão importante que serve de base firme para todas as descobertas que vieram depois.'
                : 'Evento primordial que estabiliza o tensor métrico e preserva a autoconsistência de Novikov.'}
            </p>
          </div>
        )}

        {event.isAIAnomaly && (
          <div className="ai-anomaly-badge">
            <span>{isLaymanMode ? 'CENÁRIO HISTÓRICO HIPOTÉTICO (SIMULAÇÃO)' : 'RAMIFICAÇÃO CONTRAFACTUAL MODELADA'}</span>
            <p>
              {isLaymanMode
                ? 'Cenário contrafactual gerado para demonstrar as consequências de causa e efeito na história.'
                : 'Bifurcação divergente no continuum espaço-temporal decorrente de perturbação geodésica.'}
            </p>
          </div>
        )}

        <section className="physics-explanation">
          <div className="physics-heading">
            <span className="section-label">
              {isLaymanMode ? 'COMO A CIÊNCIA EXPLICA ESTE EVENTO' : 'INTERPRETAÇÃO EM FÍSICA TEÓRICA'}
            </span>
            <span className="physics-note">
              {isLaymanMode ? '5 LEIS FUNDAMENTAIS' : '5 PILARES DO ESPAÇO-TEMPO'}
            </span>
          </div>
          {physics.map(item => (
            <details key={item.title} className={`physics-item physics-${item.status}`} open={item.status === 'established'}>
              <summary>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontWeight: 600 }}>{isLaymanMode ? (item.laymanTitle || item.title) : item.title}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-dimensional)' }}>[{item.theoryBadge}]</span>
                </div>
                <span>{item.statusLabel}</span>
              </summary>
              <div className="physics-content">
                {item.formula && (
                  <div className="physics-formula">
                    <MathFormula math={item.formula} block />
                  </div>
                )}
                {isLaymanMode && item.laymanFormulaMeaning && (
                  <div className="layman-formula-card">
                    <div className="layman-formula-header">O QUE ESTA FÓRMULA SIGNIFICA</div>
                    <p>{item.laymanFormulaMeaning}</p>
                  </div>
                )}
                <p className="physics-desc-text">
                  <MathText text={isLaymanMode ? (item.laymanExplanation || item.explanation) : item.explanation} />
                </p>
              </div>
            </details>
          ))}
        </section>

        <div className="inspector-section">
          <span className="section-label">
            {isLaymanMode ? `O QUE PROVOCOU ESTE EVENTO (${causesList.length})` : `CONES DE LUZ PASSADO (CAUSAS: ${causesList.length})`}
          </span>
          {causesList.length === 0 ? (
            <span className="empty-text">
              {isLaymanMode ? 'Ponto de partida histórico (sem causa anterior cadastrada)' : 'Origem assintótica / Evento primordial independente'}
            </span>
          ) : (
            <ul className="causal-list">
              {causesList.map(c => (
                <li key={c!.id}>
                  <span>{isLaymanMode ? getLaymanExplanation(c!.year, c!.title).simpleTitle : c!.title}</span>
                  <span className="causal-year">({formatHistoricalYear(c!.year)})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="inspector-section">
          <span className="section-label">
            {isLaymanMode ? `O QUE ESTE EVENTO GEROU NO FUTURO (${consequencesList.length})` : `CONES DE LUZ FUTURO (CONSEQUÊNCIAS: ${consequencesList.length})`}
          </span>
          {consequencesList.length === 0 ? (
            <span className="empty-text">
              {isLaymanMode ? 'Fim da cadeia atual (ainda sem desdobramentos futuros)' : 'Fronteira aberta da linha temporal'}
            </span>
          ) : (
            <ul className="causal-list">
              {consequencesList.map(c => (
                <li key={c!.id}>
                  <span>{isLaymanMode ? getLaymanExplanation(c!.year, c!.title).simpleTitle : c!.title}</span>
                  <span className="causal-year">({formatHistoricalYear(c!.year)})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Counterfactual Hypothesis & Analysis Card */}
        {counterfactual && (
          <div className="counterfactual-dossier-card">
            <div className="cf-dossier-header">
              <span className="cf-dossier-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2L2 7h20L12 2z"/>
                </svg>
                <span>E SE NÃO EXISTISSE?</span>
              </span>
              <span className="cf-dossier-title">Cenário Contrafactual</span>
            </div>
            <div className="cf-dossier-content">
              <p className="cf-dossier-text">
                <MathText text={counterfactual.whatIfNonExistent} />
              </p>
              <div className="cf-dossier-hypothesis">
                <span className="cf-dossier-hypo-tag">RAMIFICAÇÃO ALTERNATIVA:</span>
                <p>
                  <MathText text={counterfactual.alternateHistoryHypothesis} />
                </p>
              </div>
              {counterfactual.brokenDescendants.length > 0 && (
                <div className="cf-dossier-descendants">
                  <span className="cf-dossier-hypo-tag">
                    CONSEQUÊNCIAS NO CONE DE LUZ ({counterfactual.brokenDescendants.length}):
                  </span>
                  <ul className="cf-dossier-list">
                    {counterfactual.brokenDescendants.slice(0, 3).map((desc, idx) => (
                      <li key={`${desc.title}-${desc.year}-${idx}`}>
                        <strong>{desc.title} ({formatHistoricalYear(desc.year)})</strong>: {desc.consequenceIfMissing}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="inspector-actions">
          <span className="actions-label">
            {isLaymanMode ? 'MUDAR A HISTÓRIA & CALCULAR CONSEQUÊNCIAS' : 'INTERVENÇÃO CAUSAL & MODELAGEM PREDITIVA'}
          </span>
          <div className="action-buttons-grid">
            <button
              type="button"
              className="btn-action-alt btn-ai-action"
              onClick={() => onSimulateAI(event)}
            >
              {isLaymanMode ? 'Calcular Efeito Borboleta na História' : 'Simular Divergência de Geodésica'}
            </button>
            <button
              type="button"
              className="btn-action-alt btn-alter"
              onClick={() => onAlterEvent(event.id, EventStatus.ALTERED)}
            >
              {isLaymanMode ? 'Mudar Rumos do Evento' : 'Modificar Geodésica'}
            </button>
            <button
              type="button"
              className="btn-action-alt btn-erase"
              onClick={() => onAlterEvent(event.id, EventStatus.ERASED)}
            >
              {isLaymanMode ? 'Apagar da História' : 'Aniquilar Nó Temporal'}
            </button>
            <button
              type="button"
              className="btn-action-alt btn-restore"
              onClick={() => onAlterEvent(event.id, EventStatus.STABLE)}
            >
              {isLaymanMode ? 'Restaurar Original' : 'Restaurar Estado Fundamental'}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
