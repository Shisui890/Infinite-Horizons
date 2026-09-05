export enum EventStatus {
  STABLE = 'stable',
  ALTERED = 'altered',
  UNSTABLE = 'unstable',
  COLLAPSED = 'collapsed',
  PARADOXICAL = 'paradoxical',
  ERASED = 'erased',
  DIVERGED = 'diverged',
}

export enum TravelerStatus {
  NORMAL = 'normal',
  TRAVELING = 'traveling',
  DISPLACED = 'displaced',
  ORIGIN_THREATENED = 'origin_threatened',
  PARADOXICAL = 'paradoxical',
  ERASED = 'erased',
  DUPLICATED = 'duplicated',
}

export enum CausalRelation {
  CAUSES = 'causes',
  ENABLES = 'enables',
  PREVENTS = 'prevents',
  DEPENDS_ON = 'depends_on',
  CONTRADICTS = 'contradicts',
  DERIVES = 'derives',
}

export enum ParadoxType {
  GRANDFATHER_PARADOX = 'GRANDFATHER_PARADOX',
  CAUSAL_LOOP = 'CAUSAL_LOOP',
  BOOTSTRAP_PARADOX = 'BOOTSTRAP_PARADOX',
  TEMPORAL_CONTRADICTION = 'TEMPORAL_CONTRADICTION',
}

export enum ParadoxSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  CATASTROPHIC = 'CATASTROPHIC',
}

export type EvidenceKind =
  | 'documented_fact'
  | 'scientific_theory'
  | 'inference'
  | 'user_hypothesis'
  | 'model_result';

export interface Position {
  x: number;
  y: number;
}

export type ScientificStatus = 'proven' | 'theoretical_untested' | 'computational';

export interface SpacetimeVector {
  ct: number; // Coordenada temporal (c=1, anos)
  x: number;  // Coordenada espacial x
  y: number;  // Coordenada espacial y
  z: number;  // Coordenada espacial z
}

export interface SpacetimeIntervalResult {
  s2: number; // Intervalo invariante de Minkowski: s^2 = -(c*dt)^2 + dx^2 + dy^2 + dz^2
  intervalType: 'timelike' | 'spacelike' | 'lightlike';
  dtYears: number;
  dxSpace: number;
  properTimeTau: number | null; // sqrt(-s^2) para tipo-tempo
  lorentzGamma: number;
  causalStatusLabel: string;
  scientificExplanation: string;
}

export interface MonteCarloResult {
  iterations: number;
  stableProbability: number;      // %
  bifurcationProbability: number; // %
  inconsistencyProbability: number; // %
  shannonEntropyBits: number;
  lyapunovMax: number;
  convergenceSeries: number[];
}

export interface TemporalEvent {
  id: string;
  dimensionId: string;
  title: string;
  description?: string;
  sourceUrl?: string;
  evidenceKind?: EvidenceKind;
  evidenceConfidence?: number;
  uncertainty?: string;
  scientificStatus?: ScientificStatus;
  doi?: string;
  academicCitation?: string;
  year: number;
  category: string;
  importance: number; // 1 - 100
  position: Position;
  status: EventStatus;
  parents: string[]; // event IDs causing this
  children: string[]; // event IDs caused by this
  causes: string[];
  consequences: string[];
  isAnchor?: boolean;
  isAIAnomaly?: boolean;
  alteredBy?: string[];
}

export interface CausalEdge {
  id: string;
  source: string;
  target: string;
  type: CausalRelation;
  active: boolean;
  confidence?: number;
  evidence?: string;
}

export interface Dimension {
  id: string;
  universeId: string;
  name: string;
  designation: string; // e.g. Ω-01
  color: string;
  events: TemporalEvent[];
  integrity: number; // 0 - 100
}

export interface TravelRecord {
  id: string;
  travelerId: string;
  originDimensionId: string;
  originYear: number;
  destinationDimensionId: string;
  destinationYear: number;
  purpose?: string;
  timestamp: number;
}

export interface Traveler {
  id: string;
  name: string;
  originDimensionId: string;
  originYear: number;
  currentDimensionId: string;
  currentYear: number;
  originEventId?: string;
  status: TravelerStatus;
  travelHistory: TravelRecord[];
}

export interface Paradox {
  id: string;
  type: ParadoxType;
  severity: ParadoxSeverity;
  title: string;
  description: string;
  dimensionId: string;
  eventId?: string;
  travelerId?: string;
  causalChain: string[]; // Event IDs forming the paradox chain
}

export interface Universe {
  id: string;
  name: string;
  description?: string;
  temporalIntegrity: number; // 0 - 100
  dimensions: Dimension[];
  travelers: Traveler[];
  edges: CausalEdge[];
  paradoxes: Paradox[];
  createdAt: number;
  updatedAt: number;
}

export interface SimulationLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

// AI Integration Types
export interface AIConfig {
  provider: 'builtin' | 'openrouter' | 'custom_api';
  endpoint?: string;
  apiKey?: string;
  openRouterModel?: string;
  modelName?: string;
  autoButterflyEnabled: boolean;
}

export interface AIButterflyAnomaly {
  title: string;
  year: number;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AIButterflyResult {
  impactScore: number; // 0 - 100
  summary: string;
  unexpectedEffects: string[];
  generatedAnomalies: AIButterflyAnomaly[];
}

export interface AIUniverseInsight {
  health: 'stable' | 'watch' | 'critical';
  healthLabel: string;
  confidence: number;
  eventCount: number;
  exposedEvents: number;
  connectedEvents: number;
  affectedTravelers: number;
  recommendation: string;
}

export interface HistoricalResearch {
  title: string;
  description: string;
  year: number;
  category: string;
  importance: number;
  source: string;
  evidenceKind?: EvidenceKind;
  confidence?: number;
  uncertainty?: string;
}

export interface ScientificExplanation {
  title: string;
  laymanTitle?: string;
  status: 'established' | 'supported' | 'speculative';
  statusLabel: string;
  theoryBadge: string;
  formula?: string;
  explanation: string;
  laymanFormulaMeaning?: string;
  laymanExplanation?: string;
}

export interface AIFutureScenario {
  id: string;
  title: string;
  probability: number; // 0 - 100 %
  predictedIntegrity: number;
  summary: string;
  keyEvents: string[];
}

export interface AIParadoxResolution {
  id: string;
  title: string;
  description: string;
  successRate: number; // 0 - 100 %
  actionType: 'restore_origin' | 'create_branch' | 'anchor_event';
  targetEventId?: string;
}

export interface KerrMetricResult {
  massSolar: number;
  spinParamA: number; // 0 to 1 (a* = J / M)
  thetaRad: number; // Co-latitude
  rsKm: number; // Schwarzschild radius
  rPlusKm: number; // Outer Event Horizon: M + sqrt(M^2 - a^2)
  rMinusKm: number; // Inner Cauchy Horizon: M - sqrt(M^2 - a^2)
  rErgosphereKm: number; // Ergosphere Boundary: M + sqrt(M^2 - a^2 cos^2(theta))
  frameDraggingOmegaRadPerSec: number; // Lense-Thirring angular velocity
  penroseEfficiencyMaxPercent: number; // Max rotational energy extraction (up to 29%)
  isInsideErgosphere: boolean;
  isInsideEventHorizon: boolean;
}

export interface HawkingThermodynamicsResult {
  massKg: number;
  massSolar: number;
  temperatureKelvin: number; // T_H = hbar c^3 / (8 pi G M k_B)
  entropyBekensteinJoulesPerKelvin: number; // S_BH
  entropyBits: number; // Bits of quantum info encoded on horizon
  horizonAreaM2: number; // A = 4 pi r_s^2
  luminosityWatts: number; // Hawking radiation power
  evaporationTimeYears: number; // t_evap ~ 5120 pi G^2 M^3 / (hbar c^4)
  informationStatus: 'unitary_preserved' | 'thermal_radiation' | 'page_curve_turnover';
}

export interface MichelsonMorleyResult {
  vKmS: number;
  beta: number; // v / c
  armLengthM: number;
  wavelengthNm: number;
  timeParallelSec: number;
  timePerpendicularSec: number;
  classicalDeltaTSec: number;
  classicalFringeShift: number; // Delta N = 2 * L * v^2 / (lambda * c^2)
  observedFringeShift: number; // 0.00 (resultado nulo experimental)
  lorentzContractionFactor: number; // sqrt(1 - beta^2)
  etherStatus: 'refuted_by_null_result';
  einsteinResolution: string;
}

export interface ReplayFrame {
  step: number;
  eventId: string;
  type: 'alteration' | 'propagation' | 'paradox_trigger' | 'integrity_shift' | 'branch_created';
  description: string;
  affectedEventIds: string[];
  integritySnapshot: number;
}

export interface PreflightImpact {
  targetEventId: string;
  targetEventTitle: string;
  action: 'erase' | 'alter' | 'branch';
  directEffectsCount: number;
  indirectEffectsCount: number;
  threatenedTravelers: string[];
  predictedParadoxesCount: number;
  currentIntegrity: number;
  predictedIntegrity: number;
  criticalAnchorsAtRisk: string[];
}

export interface CLICommandLog {
  id: string;
  command: string;
  output: string;
  timestamp: string;
  type: 'success' | 'error' | 'info';
}

// Runtime fallbacks for Babel ESM module resolution
export const Position = {};
export const TemporalEvent = {};
export const CausalEdge = {};
export const Dimension = {};
export const TravelRecord = {};
export const Traveler = {};
export const Paradox = {};
export const Universe = {};
export const SimulationLog = {};
export const AIConfig = {};
export const AIButterflyAnomaly = {};
export const AIButterflyResult = {};
export const AIUniverseInsight = {};
export const EvidenceKind = {};
export const ScientificExplanation = {};
export const AIFutureScenario = {};
export const AIParadoxResolution = {};
export const KerrMetricResult = {};
export const HawkingThermodynamicsResult = {};
export const MichelsonMorleyResult = {};
export const ReplayFrame = {};
export const PreflightImpact = {};
export const CLICommandLog = {};



