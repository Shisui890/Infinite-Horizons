export interface RocketStage {
  stageNumber: number;
  name: string;
  engineName: string;
  engineCount: number;
  thrustVacuumKN: number;
  thrustSeaLevelKN: number;
  ispVacuumS: number;
  ispSeaLevelS: number;
  propellantMassKg: number;
  dryMassKg: number;
  fuelType: string;
  burnTimeSeconds: number;
}

export interface AerospaceRocket {
  id: string;
  name: string;
  historicalProgram: 'Apollo' | 'Mercury' | 'Gemini' | 'Space Shuttle' | 'Commercial Space';
  agency: string;
  yearIntroduced: number;
  historicalMission: string;
  description: string;
  payloadMassKg: number;
  payloadName: string;
  fairingDiameterMeters: number;
  heightMeters: number;
  totalMassKg: number;
  stages: RocketStage[];
  targetOrbitAltitudeKm: number;
}

export const AEROSPACE_ROCKETS: AerospaceRocket[] = [
  {
    id: 'saturn_v',
    name: 'Saturn V (Apollo 11)',
    historicalProgram: 'Apollo',
    agency: 'NASA / Wernher von Braun',
    yearIntroduced: 1967,
    historicalMission: 'Apollo 11 (Primeiro Pouso Lunar Humano - 1969)',
    description: 'O mais potente foguete operacional do século XX. Três estágios gigantescos projetados para escapar da gravidade terrestre e enviar o Módulo de Comando e Serviço (CSM) e Módulo Lunar (LM) em rota de colisão translunar para a Lua.',
    payloadMassKg: 45000,
    payloadName: 'Apollo 11 CSM "Columbia" + LM "Eagle"',
    fairingDiameterMeters: 10.1,
    heightMeters: 110.6,
    totalMassKg: 2970000,
    targetOrbitAltitudeKm: 185,
    stages: [
      {
        stageNumber: 1,
        name: 'S-IC (Primeiro Estágio)',
        engineName: 'Rocketdyne F-1 (x5)',
        engineCount: 5,
        thrustSeaLevelKN: 34020,
        thrustVacuumKN: 38700,
        ispSeaLevelS: 263,
        ispVacuumS: 304,
        propellantMassKg: 2160000,
        dryMassKg: 130000,
        fuelType: 'RP-1 (Querosene Refinado) / LOX (Oxigênio Líquido)',
        burnTimeSeconds: 168,
      },
      {
        stageNumber: 2,
        name: 'S-II (Segundo Estágio Criogênico)',
        engineName: 'Rocketdyne J-2 (x5)',
        engineCount: 5,
        thrustSeaLevelKN: 4400,
        thrustVacuumKN: 5140,
        ispSeaLevelS: 200,
        ispVacuumS: 421,
        propellantMassKg: 456000,
        dryMassKg: 40100,
        fuelType: 'LH2 (Hidrogênio Líquido) / LOX',
        burnTimeSeconds: 360,
      },
      {
        stageNumber: 3,
        name: 'S-IVB (Terceiro Estágio / Injeção Translunar TLI)',
        engineName: 'Rocketdyne J-2 (x1)',
        engineCount: 1,
        thrustSeaLevelKN: 800,
        thrustVacuumKN: 1000,
        ispSeaLevelS: 200,
        ispVacuumS: 421,
        propellantMassKg: 107000,
        dryMassKg: 15200,
        fuelType: 'LH2 / LOX (Re-ignição no vácuo)',
        burnTimeSeconds: 475,
      },
    ],
  },
  {
    id: 'mercury_atlas',
    name: 'Mercury-Atlas 6 (Friendship 7)',
    historicalProgram: 'Mercury',
    agency: 'NASA / Convair',
    yearIntroduced: 1962,
    historicalMission: 'Primeira Órbita Americana (John Glenn - 1962)',
    description: 'Foguete de 1,5 estágio derivado do míssil balístico intercontinental Atlas D. Possui estrutura em monocoque de parede de aço inoxidável pressurizada ("tanque balão") que impulsionou John Glenn a 3 voltas completas ao redor da Terra.',
    payloadMassKg: 1355,
    payloadName: 'Cápsula Mercury "Friendship 7"',
    fairingDiameterMeters: 3.05,
    heightMeters: 28.7,
    totalMassKg: 120000,
    targetOrbitAltitudeKm: 160,
    stages: [
      {
        stageNumber: 1,
        name: 'Atlas Booster Stage (Motores Auxiliares Descartáveis)',
        engineName: 'Rocketdyne XLR89-NA-5 (x2)',
        engineCount: 2,
        thrustSeaLevelKN: 1378,
        thrustVacuumKN: 1590,
        ispSeaLevelS: 248,
        ispVacuumS: 282,
        propellantMassKg: 85000,
        dryMassKg: 3200,
        fuelType: 'RP-1 / LOX',
        burnTimeSeconds: 131,
      },
      {
        stageNumber: 2,
        name: 'Atlas Sustainer Core (Motor de Sustentação até a Órbita)',
        engineName: 'Rocketdyne XLR105-NA-5 (x1)',
        engineCount: 1,
        thrustSeaLevelKN: 267,
        thrustVacuumKN: 360,
        ispSeaLevelS: 215,
        ispVacuumS: 309,
        propellantMassKg: 28000,
        dryMassKg: 2500,
        fuelType: 'RP-1 / LOX',
        burnTimeSeconds: 310,
      },
    ],
  },
  {
    id: 'gemini_titan',
    name: 'Gemini-Titan II (Gemini 8)',
    historicalProgram: 'Gemini',
    agency: 'NASA / Martin Marietta',
    yearIntroduced: 1965,
    historicalMission: 'Primeiro Acoplamento Espacial da História (Neil Armstrong - 1966)',
    description: 'Foguete de dois estágios com propelentes hipergólicos que entram em combustão espontânea por contato mútuo. Foi o veículo de treinamento crucial para manobras de aproximação orbital (rendezvous) e caminhadas espaciais do Projeto Gemini.',
    payloadMassKg: 3800,
    payloadName: 'Espaçonave Gemini 8 com Módulo de Reentrada e OAMS',
    fairingDiameterMeters: 3.05,
    heightMeters: 33.2,
    totalMassKg: 154000,
    targetOrbitAltitudeKm: 270,
    stages: [
      {
        stageNumber: 1,
        name: 'Titan II Estágio 1 (Hipergólico)',
        engineName: 'Aerojet LR-87-7 (x2 câmaras)',
        engineCount: 2,
        thrustSeaLevelKN: 1913,
        thrustVacuumKN: 2124,
        ispSeaLevelS: 258,
        ispVacuumS: 302,
        propellantMassKg: 114000,
        dryMassKg: 4200,
        fuelType: 'Aerozine 50 (50% Hidrazina + 50% UDMH) / NTO (Tetróxido de Nitrogênio)',
        burnTimeSeconds: 156,
      },
      {
        stageNumber: 2,
        name: 'Titan II Estágio 2',
        engineName: 'Aerojet LR-91-7 (x1)',
        engineCount: 1,
        thrustSeaLevelKN: 350,
        thrustVacuumKN: 445,
        ispSeaLevelS: 210,
        ispVacuumS: 316,
        propellantMassKg: 26000,
        dryMassKg: 2100,
        fuelType: 'Aerozine 50 / NTO',
        burnTimeSeconds: 180,
      },
    ],
  },
  {
    id: 'falcon_9',
    name: 'Falcon 9 Block 5 (Crew Dragon)',
    historicalProgram: 'Commercial Space',
    agency: 'SpaceX / NASA Commercial Crew',
    yearIntroduced: 2018,
    historicalMission: 'Demo-2 / Crew-1 (Retorno dos Voos Tripulados Americanos - 2020)',
    description: 'Veículo aeroespacial reutilizável de última geração. O primeiro estágio conta com 9 motores Merlin 1D dispostos em anel Octaweb, capazes de desacelerar por retropropulsão hipersônica e pousar autonomamente em balsa-drone oceânica.',
    payloadMassKg: 12500,
    payloadName: 'Crew Dragon "Endeavour" + Trunk de Carga',
    fairingDiameterMeters: 3.7,
    heightMeters: 70.0,
    totalMassKg: 549000,
    targetOrbitAltitudeKm: 400,
    stages: [
      {
        stageNumber: 1,
        name: 'Falcon 9 Booster (Reutilizável / Pouso Suave)',
        engineName: 'Merlin 1D+ (x9)',
        engineCount: 9,
        thrustSeaLevelKN: 7607,
        thrustVacuumKN: 8227,
        ispSeaLevelS: 282,
        ispVacuumS: 311,
        propellantMassKg: 395700,
        dryMassKg: 25600,
        fuelType: 'RP-1 Sub-resfriado / LOX Criogênico Denso',
        burnTimeSeconds: 162,
      },
      {
        stageNumber: 2,
        name: 'Falcon 9 Second Stage (Motor Vácuo)',
        engineName: 'Merlin 1D Vacuum (x1)',
        engineCount: 1,
        thrustSeaLevelKN: 400,
        thrustVacuumKN: 981,
        ispSeaLevelS: 200,
        ispVacuumS: 348,
        propellantMassKg: 92000,
        dryMassKg: 4000,
        fuelType: 'RP-1 / LOX',
        burnTimeSeconds: 397,
      },
    ],
  },
];
