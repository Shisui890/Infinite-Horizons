import { useState, useRef, useCallback } from 'react';
import { useLaymanMode } from '../../context/LaymanModeContext';

interface Props {
  onClose: () => void;
  initialScenarioId?: string;
}

interface SplitScenario {
  id: string;
  year: number;
  discoveryTitle: string;
  historicalPioneer: string;
  realWorld2026: {
    headline: string;
    description: string;
    techLevelScore: number;
    connectivityScore: number;
    energyScore: number;
    bulletPoints: string[];
  };
  counterfactual2026: {
    headline: string;
    description: string;
    techLevelScore: number;
    connectivityScore: number;
    energyScore: number;
    bulletPoints: string[];
  };
  academicHistoriography: {
    bottleneckAnalysis: string;
    substituteTheories: string;
    academicCitation: {
      author: string;
      year: number;
      title: string;
      journal: string;
      doi: string;
    };
  };
}

const COMPARISON_SCENARIOS: SplitScenario[] = [
  {
    id: 'maxwell',
    year: 1865,
    discoveryTitle: 'Equações de Maxwell & Eletromagnetismo',
    historicalPioneer: 'James Clerk Maxwell',
    realWorld2026: {
      headline: 'Era Digital Hiperconectada & Fotônica',
      description: 'A unificação das leis da eletricidade e do magnetismo em 4 equações fundamentou toda a infraestrutura eletromagnética do planeta Terra.',
      techLevelScore: 98,
      connectivityScore: 99,
      energyScore: 92,
      bulletPoints: [
        'Redes elétricas continentais trifásicas alimentando cidades inteiras',
        'Cabos submarinos de fibra óptica transmitindo petabytes à velocidade da luz',
        'Internet móvel 5G/6G, satélites Starlink e computação em nuvem',
        'Tomografia por Ressonância Magnética (MRI) e eletroencefalografia na medicina',
      ],
    },
    counterfactual2026: {
      headline: 'Civilização Mecânica Presa ao Vapor e Carvão',
      description: 'Sem a compreensão teórica de que a luz é uma onda eletromagnética, a humanidade jamais desenvolveu transmissores de rádio, motores elétricos eficientes ou microchips.',
      techLevelScore: 34,
      connectivityScore: 18,
      energyScore: 45,
      bulletPoints: [
        'Usinas de carvão e motores a vapor de baixa eficiência dominam a indústria',
        'Comunicação intercontinental restrita a telegrafia mecânica por cabos de cobre',
        'Sem rádio, televisão, Wi-Fi, celulares ou semicondutores de silício',
        'Medicina sem diagnósticos por imagem; cirurgias e tratamentos rudimentares',
      ],
    },
    academicHistoriography: {
      bottleneckAnalysis: 'O atraso no acoplamento rotacional dos campos vetoriais E e B bloquearia a dedução da radiação dipolar de Hertz (1887), postergando a física dos elétrons de Thomson (1897) e inviabilizando a revolução do estado sólido.',
      substituteTheories: 'A ciência permaneceria ancorada na ação à distância instantânea newtoniana com fluidos elétricos de Weber e Neumann, incapaz de formular teorias de calibre.',
      academicCitation: {
        author: 'Harman, Peter M.',
        year: 1998,
        title: 'The Natural Philosophy of James Clerk Maxwell',
        journal: 'Cambridge University Press',
        doi: 'doi:10.1017/CBO9780511564284',
      },
    },
  },
  {
    id: 'einstein_sr',
    year: 1905,
    discoveryTitle: 'Relatividade Especial (Eletrodinâmica dos Corpos em Movimento)',
    historicalPioneer: 'Albert Einstein',
    realWorld2026: {
      headline: 'Navegação por Satélite & Era Nuclear',
      description: 'A equivalência massa-energia (E=mc²) e a dilatação temporal relativística permitiram a sincronia satelital global e a física de altas energias.',
      techLevelScore: 96,
      connectivityScore: 98,
      energyScore: 95,
      bulletPoints: [
        'Sistemas de GPS com correção relativística precisa de 38 microssegundos/dia',
        'Reatores nucleares e medicina diagnóstica por emissão de pósitrons (PET-Scan)',
        'Aceleradores de partículas do CERN investigando o Bóson de Higgs',
        'Relógios atômicos ópticos de femtossegundos para redes financeiras globais',
      ],
    },
    counterfactual2026: {
      headline: 'Cosmologia Estagnada no Éter & Falha Crítica do GPS',
      description: 'Sem a invariância relativística de Lorentz, sistemas de posicionamento por satélite acumulam erro de 11 quilômetros a cada 24 horas, tornando a aviação moderna inviável.',
      techLevelScore: 52,
      connectivityScore: 48,
      energyScore: 40,
      bulletPoints: [
        'Ausência de GPS: aviação e marinhas dependentes de bússolas e sextantes astronômicos',
        'Sem física nuclear: matriz energética global 100% dependente de combustíveis fósseis',
        'Física teórica dividida em modelos contraditórios de contração mecânica do éter',
        'Aceleradores de partículas colapsam ao não calcular o ganho relativístico de massa',
      ],
    },
    academicHistoriography: {
      bottleneckAnalysis: 'A rejeição da métrica de Minkowski preservaria as transformações de Galileu, gerando divergências assintóticas nas equações da eletrodinâmica de Maxwell em referenciais acelerados.',
      substituteTheories: 'Hipótese de arrastamento parcial do éter de Fresnel e modelo de éter elástico de Kelvin com vórtices hidrodinâmicos.',
      academicCitation: {
        author: 'Pais, Abraham',
        year: 1982,
        title: 'Subtle is the Lord: The Science and the Life of Albert Einstein',
        journal: 'Oxford University Press',
        doi: 'ISBN 978-0-19-280672-7',
      },
    },
  },
  {
    id: 'quantum_epr',
    year: 1935,
    discoveryTitle: 'Mecânica Quântica & Emaranhamento (EPR)',
    historicalPioneer: 'Einstein, Podolsky, Rosen & Niels Bohr',
    realWorld2026: {
      headline: 'Revolução Quântica & Supercomputação QPU',
      description: 'A não-localidade quântica permitiu a criação de criptografia inviolável, sensores de ressonância atômica e processadores quânticos avançados.',
      techLevelScore: 99,
      connectivityScore: 97,
      energyScore: 94,
      bulletPoints: [
        'Computadores quânticos resolvendo fármacos e novos supercondutores em segundos',
        'Criptografia quântica QKD transmitida por satélites seguros contra espionagem',
        'Transistores atômicos em chips de 2 nanômetros permitindo smartphones ultrarrápidos',
        'Microscopia eletrônica de varredura visualizando vírus e cadeias de DNA',
      ],
    },
    counterfactual2026: {
      headline: 'Mundo Clássico: Computadores a Válvula do Tamanho de Prédios',
      description: 'Sem a física quântica e a mecânica das bandas de energia em cristais, não existem transistores de silício nem microprocessadores integrados.',
      techLevelScore: 46,
      connectivityScore: 32,
      energyScore: 50,
      bulletPoints: [
        'Supercomputadores pesam 40 toneladas e usam milhares de válvulas de vidro aquecidas',
        'Sem internet portátil: memórias baseadas em tambores magnéticos e cartões perfurados',
        'Genética sem compreensão de ligações moleculares de hidrogênio do DNA',
        'Criptografia clássica vulnerável a espionagem manual mecânica',
      ],
    },
    academicHistoriography: {
      bottleneckAnalysis: 'A ausência do postulado de colapso de estado e das inequações de Bell (1964) manteria a teoria da informação restrita à teoria determinística de canais de Claude Shannon.',
      substituteTheories: 'Modelos de variáveis ocultas locais estritamente mecânicas de Bohm-de Broglie sem suporte empírico para violação de desigualdades de CHSH.',
      academicCitation: {
        author: 'Bell, John Stewart',
        year: 1964,
        title: 'On the Einstein Podolsky Rosen Paradox',
        journal: 'Physics Physique Fizika, 1(3): 195–200',
        doi: 'doi:10.1103/PhysicsPhysiqueFizika.1.195',
      },
    },
  },
];

export default function TimelineSplitComparatorModal({ onClose, initialScenarioId }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const [selectedId, setSelectedId] = useState<string>(initialScenarioId || COMPARISON_SCENARIOS[0].id);
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100 percentage
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef<boolean>(false);

  const scenario = COMPARISON_SCENARIOS.find(s => s.id === selectedId) || COMPARISON_SCENARIOS[0];

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  }, []);

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="split-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="split-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <header className="split-modal-header">
          <div className="split-header-left">
            <span className="split-pill-badge">
              <span className="pill-dot" />
              {isLaymanMode ? 'COMPARADOR VISUAL // MUNDO REAL VS HISTÓRIA ALTERADA' : 'ANÁLISE CONTRAFACTUAL HISTORIOGRÁFICA // DIVERGÊNCIA CIENTÍFICA'}
            </span>
            <h2 className="split-modal-title">
              {isLaymanMode ? 'Como Seria o Ano de 2026 Sem Esta Grande Descoberta?' : 'Simulador Contrafactual do Século XXI: Bifurcação Geodésica'}
            </h2>
          </div>

          <button
            type="button"
            className="btn-split-close"
            onClick={onClose}
            aria-label="Fechar comparador"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* Scenarios Selector Bar */}
        <div className="split-scenarios-bar">
          <span className="scenarios-label">SELECIONE O EVENTO HISTÓRICO:</span>
          <div className="scenarios-pills-row">
            {COMPARISON_SCENARIOS.map(s => {
              const isSelected = s.id === selectedId;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`scenario-pill-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedId(s.id)}
                >
                  <span className="pill-year">{s.year}</span>
                  <span className="pill-title">{s.discoveryTitle.split('(')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Drag Helper Tip */}
        <div className="split-drag-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Arraste o divisor central para a esquerda ou direita para comparar o impacto no Século XXI</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>

        {/* Interactive Split-Screen Stage */}
        <div
          ref={containerRef}
          className="split-slider-stage"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* LADO DIREITO: HISTÓRIA CONTRAFACTUAL (SEM A DESCOBERTA) */}
          <div className="split-half-panel panel-counterfactual">
            <div className="panel-badge red-badge">
              <span className="panel-status-dot red-dot" />
              <span>SÉCULO XXI SEM A DESCOBERTA (ALTERADO)</span>
            </div>
            <h3 className="panel-headline red-text">{scenario.counterfactual2026.headline}</h3>
            <p className="panel-desc">{scenario.counterfactual2026.description}</p>

            <div className="panel-metrics-grid">
              <div className="metric-pill">
                <span className="metric-lbl">AVANÇO TECNOLÓGICO</span>
                <strong className="metric-val red-text">{scenario.counterfactual2026.techLevelScore}%</strong>
              </div>
              <div className="metric-pill">
                <span className="metric-lbl">CONECTIVIDADE GLOBAL</span>
                <strong className="metric-val red-text">{scenario.counterfactual2026.connectivityScore}%</strong>
              </div>
              <div className="metric-pill">
                <span className="metric-lbl">ENERGIA & POTÊNCIA</span>
                <strong className="metric-val red-text">{scenario.counterfactual2026.energyScore}%</strong>
              </div>
            </div>

            <ul className="panel-bullets-list">
              {scenario.counterfactual2026.bulletPoints.map((bp, i) => (
                <li key={i} className="bullet-item red-bullet">
                  <span className="bullet-sym">✕</span>
                  <span>{bp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* LADO ESQUERDO COM CLIP-PATH: HISTÓRIA REAL (COM A DESCOBERTA) */}
          <div
            className="split-half-panel panel-real"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <div className="panel-badge cyan-badge">
              <span className="panel-status-dot cyan-dot" />
              <span>SÉCULO XXI REAL (HISTÓRIA DOCUMENTADA)</span>
            </div>
            <h3 className="panel-headline cyan-text">{scenario.realWorld2026.headline}</h3>
            <p className="panel-desc">{scenario.realWorld2026.description}</p>

            <div className="panel-metrics-grid">
              <div className="metric-pill">
                <span className="metric-lbl">AVANÇO TECNOLÓGICO</span>
                <strong className="metric-val cyan-text">{scenario.realWorld2026.techLevelScore}%</strong>
              </div>
              <div className="metric-pill">
                <span className="metric-lbl">CONECTIVIDADE GLOBAL</span>
                <strong className="metric-val cyan-text">{scenario.realWorld2026.connectivityScore}%</strong>
              </div>
              <div className="metric-pill">
                <span className="metric-lbl">ENERGIA & POTÊNCIA</span>
                <strong className="metric-val cyan-text">{scenario.realWorld2026.energyScore}%</strong>
              </div>
            </div>

            <ul className="panel-bullets-list">
              {scenario.realWorld2026.bulletPoints.map((bp, i) => (
                <li key={i} className="bullet-item cyan-bullet">
                  <span className="bullet-sym">✓</span>
                  <span>{bp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Draggable Divider Handle */}
          <div className="split-divider-line" style={{ left: `${sliderPos}%` }}>
            <div className="split-handle-grip" title="Arraste para comparar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5">
                <polyline points="8 16 4 12 8 8" />
                <polyline points="16 8 20 12 16 16" />
              </svg>
            </div>
          </div>
        </div>

        {/* Academic Historiographical & Primary Sources Deep Box */}
        <div className="split-academic-card">
          <div className="split-academic-header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10M6 10h10" />
            </svg>
            <strong>ANÁLISE HISTORIOGRÁFICA DO GARGALO TÉCNICO (METODOLOGIA DE CIÊNCIA):</strong>
          </div>
          <p className="split-academic-body">
            <strong>Gargalo Causal:</strong> {scenario.academicHistoriography.bottleneckAnalysis}
          </p>
          <p className="split-academic-body" style={{ marginTop: '6px' }}>
            <strong>Teorias Alternativas de Época:</strong> {scenario.academicHistoriography.substituteTheories}
          </p>
          <div className="split-cite-row">
            <span className="split-cite-lbl">REFERÊNCIA CANÔNICA:</span>
            <span className="split-cite-val">
              <strong>{scenario.academicHistoriography.academicCitation.author} ({scenario.academicHistoriography.academicCitation.year})</strong>. 
              <em> "{scenario.academicHistoriography.academicCitation.title}"</em>. {scenario.academicHistoriography.academicCitation.journal}. 
              <span className="split-doi">{scenario.academicHistoriography.academicCitation.doi}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
