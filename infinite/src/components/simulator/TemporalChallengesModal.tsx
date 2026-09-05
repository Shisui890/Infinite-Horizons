import { useState, useMemo } from 'react';
import type { Universe, TemporalEvent, CausalEdge, Traveler } from '../../types/temporal';
import { EventStatus, TravelerStatus, CausalRelation } from '../../types/temporal';
import { LigoAudio } from '../../engine/LigoAudioService';

export interface Challenge {
  id: string;
  title: string;
  badge: string;
  difficulty: 'FÁCIL' | 'MÉDIO' | 'EXTREMO';
  description: string;
  lore: string;
  targetIntegrity: number;
  maxParadoxes: number;
  setupUniverse: () => Universe;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'chal-1',
    title: 'O Colapso da Fissão de 1945',
    badge: 'CRISE DE NOVIKOV',
    difficulty: 'MÉDIO',
    description: 'Restaure a integridade temporal para pelo menos 85% e elimine todos os paradoxos críticos.',
    lore: 'Uma sonda relativística perturbou o nó fundamental da fissão nuclear em 1942. O evento de nascimento do observador primário foi desestabilizado, desencadeando o Paradoxo do Avô.',
    targetIntegrity: 85,
    maxParadoxes: 0,
    setupUniverse: () => {
      const dimId = 'dim-chal-1';
      const events: TemporalEvent[] = [
        {
          id: 'ev-c1-1',
          dimensionId: dimId,
          title: 'Equações de Maxwell (Eletrodinâmica)',
          year: 1865,
          category: 'ELETROMAGNETISMO',
          importance: 95,
          position: { x: 100, y: 150 },
          status: EventStatus.STABLE,
          parents: [],
          children: ['ev-c1-2'],
          causes: [],
          consequences: ['ev-c1-2'],
        },
        {
          id: 'ev-c1-2',
          dimensionId: dimId,
          title: 'Relatividade Especial (E=mc²)',
          year: 1905,
          category: 'FÍSICA TEÓRICA',
          importance: 98,
          position: { x: 280, y: 150 },
          status: EventStatus.STABLE,
          parents: ['ev-c1-1'],
          children: ['ev-c1-3'],
          causes: ['ev-c1-1'],
          consequences: ['ev-c1-3'],
        },
        {
          id: 'ev-c1-3',
          dimensionId: dimId,
          title: 'Descoberta da Fissão Nuclear (Hahn & Strassmann)',
          year: 1938,
          category: 'FÍSICA NUCLEAR',
          importance: 92,
          position: { x: 460, y: 150 },
          status: EventStatus.ERASED, // Perturbed!
          parents: ['ev-c1-2'],
          children: ['ev-c1-4'],
          causes: ['ev-c1-2'],
          consequences: ['ev-c1-4'],
        },
        {
          id: 'ev-c1-4',
          dimensionId: dimId,
          title: 'Primeiro Reator Nuclear Operacional (Fermi)',
          year: 1942,
          category: 'ENGENHARIA',
          importance: 88,
          position: { x: 640, y: 150 },
          status: EventStatus.UNSTABLE,
          parents: ['ev-c1-3'],
          children: [],
          causes: ['ev-c1-3'],
          consequences: [],
        },
      ];

      const edges: CausalEdge[] = [
        { id: 'edg-c1-1', source: 'ev-c1-1', target: 'ev-c1-2', type: CausalRelation.CAUSES, active: true },
        { id: 'edg-c1-2', source: 'ev-c1-2', target: 'ev-c1-3', type: CausalRelation.CAUSES, active: true },
        { id: 'edg-c1-3', source: 'ev-c1-3', target: 'ev-c1-4', type: CausalRelation.CAUSES, active: true },
      ];

      const travelers: Traveler[] = [
        {
          id: 'trv-chal-1',
          name: 'Chronos-01',
          originDimensionId: dimId,
          originYear: 1942,
          currentDimensionId: dimId,
          currentYear: 1900,
          originEventId: 'ev-c1-3',
          status: TravelerStatus.NORMAL,
          travelHistory: [],
        },
      ];

      return {
        id: 'univ-chal-1',
        name: 'Desafio: O Colapso da Fissão de 1945',
        description: 'Cenário de crise temporal sob violação do contorno de Novikov.',
        temporalIntegrity: 38,
        dimensions: [
          {
            id: dimId,
            universeId: 'univ-chal-1',
            name: 'Linha Temporal Sob Tensão',
            designation: 'Ω-DESAFIO',
            color: '#ef4444',
            events,
            integrity: 38,
          },
        ],
        travelers,
        edges,
        paradoxes: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    },
  },
  {
    id: 'chal-2',
    title: 'O Paradoxo Ontológico de Bootstrap',
    badge: 'LOOP DE INFORMAÇÃO',
    difficulty: 'EXTREMO',
    description: 'Desfaça o ciclo fechado de informação sem origem causal restaurando a entropia positiva.',
    lore: 'Em 1950, um manuscrito com as equações de Yang-Mills foi recebido do futuro e copiado, sendo reenviado em 2000 sem que ninguém o tivesse deduzido primordialmente.',
    targetIntegrity: 90,
    maxParadoxes: 0,
    setupUniverse: () => {
      const dimId = 'dim-chal-2';
      const events: TemporalEvent[] = [
        {
          id: 'ev-c2-1',
          dimensionId: dimId,
          title: 'Manuscrito Quântico Entregue ao Passado',
          year: 1950,
          category: 'FÍSICA TEÓRICA',
          importance: 90,
          position: { x: 200, y: 150 },
          status: EventStatus.PARADOXICAL,
          parents: ['ev-c2-2'],
          children: ['ev-c2-2'],
          causes: ['ev-c2-2'],
          consequences: ['ev-c2-2'],
        },
        {
          id: 'ev-c2-2',
          dimensionId: dimId,
          title: 'Manuscrito Quântico Enviado no Tempo',
          year: 2000,
          category: 'FÍSICA TEÓRICA',
          importance: 90,
          position: { x: 550, y: 150 },
          status: EventStatus.PARADOXICAL,
          parents: ['ev-c2-1'],
          children: ['ev-c2-1'],
          causes: ['ev-c2-1'],
          consequences: ['ev-c2-1'],
        },
      ];

      const edges: CausalEdge[] = [
        { id: 'edg-c2-1', source: 'ev-c2-1', target: 'ev-c2-2', type: CausalRelation.CAUSES, active: true },
        { id: 'edg-c2-2', source: 'ev-c2-2', target: 'ev-c2-1', type: CausalRelation.CAUSES, active: true },
      ];

      return {
        id: 'univ-chal-2',
        name: 'Desafio: O Paradoxo de Bootstrap',
        description: 'Loop causal fechado com ausência de entropia criadora.',
        temporalIntegrity: 45,
        dimensions: [
          {
            id: dimId,
            universeId: 'univ-chal-2',
            name: 'Loop Ontológico',
            designation: 'Ω-LOOP',
            color: '#a855f7',
            events,
            integrity: 45,
          },
        ],
        travelers: [],
        edges,
        paradoxes: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    },
  },
  {
    id: 'chal-ether',
    title: 'A Crise do Éter Luminífero de 1887',
    badge: 'COLAPSO RELATIVÍSTICO',
    difficulty: 'MÉDIO',
    description: 'Restaure o resultado nulo de Michelson-Morley para permitir a formulação da Relatividade Especial de 1905 e salvar o continuum.',
    lore: 'Uma perturbação anômala no interferômetro óptico de Michelson e Morley simulou um vento do éter positivo em 1887. Essa falsa confirmação do éter clássico impediu Einstein de postular a invariância de c em 1905, desencadeando a anulação da Relatividade Especial e Geral.',
    targetIntegrity: 88,
    maxParadoxes: 0,
    setupUniverse: () => {
      const dimId = 'dim-chal-ether';
      const events: TemporalEvent[] = [
        {
          id: 'ev-ce-1',
          dimensionId: dimId,
          title: 'Equações de Maxwell (Eletrodinâmica)',
          year: 1865,
          category: 'ELETROMAGNETISMO',
          importance: 95,
          position: { x: 80, y: 150 },
          status: EventStatus.STABLE,
          parents: [],
          children: ['ev-ce-2'],
          causes: [],
          consequences: ['ev-ce-2'],
        },
        {
          id: 'ev-ce-2',
          dimensionId: dimId,
          title: 'Experimento de Michelson-Morley (1887)',
          year: 1887,
          category: 'FÍSICA EXPERIMENTAL',
          importance: 97,
          position: { x: 260, y: 150 },
          status: EventStatus.UNSTABLE, // Falso positivo do éter!
          parents: ['ev-ce-1'],
          children: ['ev-ce-3'],
          causes: ['ev-ce-1'],
          consequences: ['ev-ce-3'],
        },
        {
          id: 'ev-ce-3',
          dimensionId: dimId,
          title: 'Relatividade Especial de Einstein (1905)',
          year: 1905,
          category: 'FÍSICA TEÓRICA',
          importance: 100,
          position: { x: 440, y: 150 },
          status: EventStatus.ERASED, // Bloqueada pela anomalia do éter!
          parents: ['ev-ce-2'],
          children: ['ev-ce-4'],
          causes: ['ev-ce-2'],
          consequences: ['ev-ce-4'],
        },
        {
          id: 'ev-ce-4',
          dimensionId: dimId,
          title: 'Relatividade Geral & Curvatura (1915)',
          year: 1915,
          category: 'FÍSICA TEÓRICA',
          importance: 99,
          position: { x: 620, y: 150 },
          status: EventStatus.UNSTABLE,
          parents: ['ev-ce-3'],
          children: [],
          causes: ['ev-ce-3'],
          consequences: [],
        },
      ];

      const edges: CausalEdge[] = [
        { id: 'edg-ce-1', source: 'ev-ce-1', target: 'ev-ce-2', type: CausalRelation.CAUSES, active: true },
        { id: 'edg-ce-2', source: 'ev-ce-2', target: 'ev-ce-3', type: CausalRelation.CAUSES, active: false },
        { id: 'edg-ce-3', source: 'ev-ce-3', target: 'ev-ce-4', type: CausalRelation.CAUSES, active: false },
      ];

      const travelers: Traveler[] = [
        {
          id: 'trv-chal-ether',
          name: 'Sonda Inercial Lorentz',
          originDimensionId: dimId,
          originYear: 1905,
          currentDimensionId: dimId,
          currentYear: 1887,
          originEventId: 'ev-ce-2',
          status: TravelerStatus.NORMAL,
          travelHistory: [],
        },
      ];

      return {
        id: 'univ-chal-ether',
        name: 'Desafio: A Crise do Éter Luminífero de 1887',
        description: 'Colapso na transição da Física Clássica para a Relatividade Especial.',
        temporalIntegrity: 42,
        dimensions: [
          {
            id: dimId,
            universeId: 'univ-chal-ether',
            name: 'Continuum sob Hipótese do Éter',
            designation: 'Ω-ÉTER',
            color: '#f43f5e',
            events,
            integrity: 42,
          },
        ],
        travelers,
        edges,
        paradoxes: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    },
  },
];

interface Props {
  currentUniverse: Universe;
  onLoadChallenge: (challengeUniverse: Universe) => void;
  onClose: () => void;
}

export default function TemporalChallengesModal({ currentUniverse, onLoadChallenge, onClose }: Props) {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(CHALLENGES[0].id);

  const selectedChallenge = CHALLENGES.find(c => c.id === selectedChallengeId) || CHALLENGES[0];

  // Evaluate if current active universe fulfills the challenge conditions
  const isCompleted = useMemo(() => {
    return (
      currentUniverse.temporalIntegrity >= selectedChallenge.targetIntegrity &&
      currentUniverse.paradoxes.length <= selectedChallenge.maxParadoxes
    );
  }, [currentUniverse, selectedChallenge]);

  const score = useMemo(() => {
    if (!isCompleted) return 0;
    const bonusIntegrity = Math.round(currentUniverse.temporalIntegrity * 8);
    const bonusParadox = (3 - currentUniverse.paradoxes.length) * 100;
    return bonusIntegrity + bonusParadox;
  }, [isCompleted, currentUniverse]);

  return (
    <div className="modal-backdrop">
      <div className="modal-card challenges-modal">
        <div className="modal-header">
          <div>
            <span className="conf-badge">LABORATÓRIO DE CRISES TEMPORAIS</span>
            <h2>DESAFIOS & PUZZLES DE AUTOCONSISTÊNCIA DE NOVIKOV</h2>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="challenges-grid-layout">
          {/* Left Challenge Selection List */}
          <div className="challenges-sidebar">
            {CHALLENGES.map(ch => (
              <button
                key={ch.id}
                type="button"
                className={`challenge-card-item ${ch.id === selectedChallengeId ? 'active' : ''}`}
                onClick={() => setSelectedChallengeId(ch.id)}
              >
                <div className="challenge-card-top">
                  <span className="challenge-badge-tag">{ch.badge}</span>
                  <span className={`challenge-diff ${ch.difficulty.toLowerCase()}`}>{ch.difficulty}</span>
                </div>
                <h4 className="challenge-item-title">{ch.title}</h4>
              </button>
            ))}
          </div>

          {/* Right Challenge Detail */}
          <div className="challenge-detail-panel">
            <div className="challenge-detail-header">
              <span className="challenge-badge-tag">{selectedChallenge.badge}</span>
              <h3>{selectedChallenge.title}</h3>
              <p className="challenge-lore-text">"{selectedChallenge.lore}"</p>
            </div>

            <div className="challenge-objectives-box">
              <h4>METAS DE ESTABILIZAÇÃO:</h4>
              <ul>
                <li>
                  Integridade Temporal mínima: <strong>{selectedChallenge.targetIntegrity}%</strong> (Atual: {currentUniverse.temporalIntegrity}%)
                </li>
                <li>
                  Paradoxos Ativos máximos permitidos: <strong>{selectedChallenge.maxParadoxes}</strong> (Atual: {currentUniverse.paradoxes.length})
                </li>
              </ul>
            </div>

            {/* Victory Badge Card */}
            {isCompleted ? (
              <div className="challenge-victory-card">
                <div className="victory-medal-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ color: '#10b981', margin: '0 0 4px' }}>PARABÉNS! DESAFIO CONCLUÍDO</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>
                    O princípio de Novikov foi restabelecido com sucesso. Pontuação: <strong>{score} pts</strong>
                  </p>
                </div>
              </div>
            ) : (
              <div className="challenge-pending-card">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: 6 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>Condições de contorno ainda não satisfeitas. Execute as intervenções causais necessárias.</span>
              </div>
            )}

            <div className="challenge-actions-footer">
              <button
                type="button"
                className="btn-challenge-load"
                onClick={() => {
                  const challengeUniv = selectedChallenge.setupUniverse();
                  onLoadChallenge(challengeUniv);
                  LigoAudio.playParadoxAlarm();
                  onClose();
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                CARREGAR ESTE CENÁRIO DE CRISE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
