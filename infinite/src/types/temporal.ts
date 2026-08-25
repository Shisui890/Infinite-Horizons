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

export interface Position {
  x: number;
  y: number;
}

export interface TemporalEvent {
  id: string;
  dimensionId: string;
  title: string;
  description?: string;
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
  provider: 'builtin' | 'custom_api';
  endpoint?: string;
  apiKey?: string;
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
export const AIFutureScenario = {};
export const AIParadoxResolution = {};
