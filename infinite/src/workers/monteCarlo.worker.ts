import type { Universe, MonteCarloResult } from '../types/temporal';

self.onmessage = (e: MessageEvent<{ universe: Universe; iterations: number }>) => {
  const { universe, iterations } = e.data;
  
  const allEvents = universe.dimensions.flatMap(d => d.events);
  const edges = universe.edges.filter(e => e.active);
  const baseIntegrity = universe.temporalIntegrity / 100;

  let stableCount = 0;
  let bifurcationCount = 0;
  let inconsistencyCount = 0;

  const convergenceSeries: number[] = [];
  const stepSize = Math.max(1, Math.floor(iterations / 20));

  const connectivityFactor = edges.length / Math.max(allEvents.length, 1);
  const lambdaMax = Number((0.25 * connectivityFactor * (1.1 - baseIntegrity)).toFixed(3));

  for (let i = 1; i <= iterations; i++) {
    // Box-Muller Gaussian Noise
    const u1 = Math.random() || 1e-10;
    const u2 = Math.random() || 1e-10;
    const gaussianNoise = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    const perturbedIntegrity = baseIntegrity + gaussianNoise * 0.08 * (1 + lambdaMax);

    if (perturbedIntegrity >= 0.72) {
      stableCount++;
    } else if (perturbedIntegrity >= 0.40) {
      bifurcationCount++;
    } else {
      inconsistencyCount++;
    }

    if (i % stepSize === 0 || i === iterations) {
      const currentStableProb = (stableCount / i) * 100;
      convergenceSeries.push(Number(currentStableProb.toFixed(1)));
    }
  }

  const pStable = stableCount / iterations;
  const pBifurcation = bifurcationCount / iterations;
  const pInconsistency = inconsistencyCount / iterations;

  const probabilities = [pStable, pBifurcation, pInconsistency].filter(p => p > 0);
  const shannonEntropy = -probabilities.reduce((acc, p) => acc + p * Math.log2(p), 0);

  const result: MonteCarloResult = {
    iterations,
    stableProbability: Number((pStable * 100).toFixed(1)),
    bifurcationProbability: Number((pBifurcation * 100).toFixed(1)),
    inconsistencyProbability: Number((pInconsistency * 100).toFixed(1)),
    shannonEntropyBits: Number(shannonEntropy.toFixed(3)),
    lyapunovMax: lambdaMax,
    convergenceSeries,
  };

  self.postMessage(result);
};
