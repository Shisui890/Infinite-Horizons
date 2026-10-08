import { Universe } from '../types/temporal';

export interface AcademicPaperMetrics {
  totalEvents: number;
  totalEdges: number;
  dimensionsCount: number;
  paradoxCount: number;
  temporalIntegrity: number;
  lyapunovExponent: number;
  kolmogorovEntropy: number;
  novikovIndex: number;
  avgGeodesicDistance: number;
  networkDensity: number;
  generatedDate: string;
}

export class AcademicPaperExportService {
  /**
   * Calcula métricas físico-matemáticas e topológicas a partir da variedade universal
   */
  public static computePaperMetrics(universe: Universe): AcademicPaperMetrics {
    const allEvents = universe.dimensions.flatMap(d => d.events);
    const n = Math.max(allEvents.length, 1);
    const e = universe.edges.length;
    const paradoxes = universe.paradoxes.length;
    const integrity = universe.temporalIntegrity;

    const maxPossibleEdges = (n * (n - 1)) / 2;
    const networkDensity = maxPossibleEdges > 0 ? Number((e / maxPossibleEdges).toFixed(4)) : 0;

    const perturbationScale = (100 - integrity) / 100;
    const lyapunovExponent = Number((0.082 + perturbationScale * 0.418 + (paradoxes * 0.095)).toFixed(3));
    const kolmogorovEntropy = Number((Math.max(0.05, lyapunovExponent * 1.34)).toFixed(3));
    const novikovIndex = Number(Math.max(0, Math.min(1, (integrity / 100) * Math.exp(-paradoxes * 0.25))).toFixed(3));

    let totalYears = 0;
    universe.edges.forEach(edge => {
      const src = allEvents.find(ev => ev.id === edge.source);
      const tgt = allEvents.find(ev => ev.id === edge.target);
      if (src && tgt) {
        totalYears += Math.abs(tgt.year - src.year);
      }
    });
    const avgGeodesicDistance = e > 0 ? Number((totalYears / e).toFixed(1)) : 124.5;

    return {
      totalEvents: n,
      totalEdges: e,
      dimensionsCount: universe.dimensions.length,
      paradoxCount: paradoxes,
      temporalIntegrity: integrity,
      lyapunovExponent,
      kolmogorovEntropy,
      novikovIndex,
      avgGeodesicDistance,
      networkDensity,
      generatedDate: new Date().toISOString().split('T')[0],
    };
  }

  /**
   * Gera o código completo em LaTeX (padrão Physical Review Letters / RevTeX 4-2)
   */
  public static generateRevTeX(universe: Universe): string {
    const metrics = this.computePaperMetrics(universe);
    const allEvents = universe.dimensions.flatMap(d => d.events).sort((a, b) => a.year - b.year);
    const sampleEvents = allEvents.slice(0, 12);

    const eventRows = sampleEvents
      .map(e => {
        const yearFormatted = e.year < 0 ? `${Math.abs(e.year)} a.C.` : `${e.year} d.C.`;
        const titleSafe = e.title.replace(/&/g, '\\&').replace(/_/g, ' ');
        return `${yearFormatted} & ${titleSafe} & ${e.category} & ${e.importance}/100 & ${e.status} \\\\`;
      })
      .join('\n');

    const lines: string[] = [
      '% =========================================================================',
      '% PREPRINT: PHYSICAL REVIEW D / CLASSICAL AND QUANTUM GRAVITY',
      '% Topologia Geodesica e Autoconsistencia Causal em Variedades Multidimensionais',
      '% Gerado pelo Laboratorio Infinite Horizons',
      '% =========================================================================',
      '\\documentclass[aps,prd,twocolumn,showpacs,superscriptaddress,floatfix,nofootinbib,10pt]{revtex4-2}',
      '',
      '\\usepackage[utf8]{inputenc}',
      '\\usepackage[T1]{fontenc}',
      '\\usepackage{amsmath,amssymb,amsfonts,bm}',
      '\\usepackage{graphicx}',
      '\\usepackage{booktabs}',
      '\\usepackage{microtype}',
      '\\usepackage{hyperref}',
      '\\usepackage{xcolor}',
      '',
      '\\hypersetup{',
      '    colorlinks=true,',
      '    linkcolor=blue!70!black,',
      '    citecolor=cyan!80!black,',
      '    urlcolor=blue!80!black',
      '}',
      '',
      '\\begin{document}',
      '',
      `\\title{Topologia Geodésica, Invariância de Lorentz e Autoconsistência de Novikov na Variedade Relativística: \\textit{${universe.name}}}`,
      '',
      '\\author{Consórcio Internacional de Astrofísica Teórica}',
      '\\affiliation{Laboratório de Física Computacional e Causalidade Infinite Horizons}',
      '\\affiliation{Department of Physics, Institute for Advanced Study, Princeton, NJ, USA}',
      '',
      `\\date{${metrics.generatedDate}}`,
      '',
      '\\begin{abstract}',
      `Investigamos analiticamente e computacionalmente a estabilidade causal e a propagação geodésica na variedade Lorentziana quadridimensional associada ao continuum \\textit{${universe.name}}. O sistema modelado é parametrizado por ${metrics.dimensionsCount} variedades paralelas acopladas, abrangendo ${metrics.totalEvents} singularidades históricas e ${metrics.totalEdges} geodésicas causais orientadas. Sob perturbações não-lineares, obtemos um expoente máximo de Lyapunov $\\lambda = ${metrics.lyapunovExponent}\\,\\text{ano}^{-1}$, correspondente a uma taxa de produção de entropia de Kolmogorov-Sinai $h_{\\text{KS}} = ${metrics.kolmogorovEntropy}\\,\\text{nats/ano}$. A imposição do Princípio de Autoconsistência de Igor Novikov resulta em um índice de integridade temporal de ${metrics.temporalIntegrity}\\%, contendo ${metrics.paradoxCount} curvas tipo-tempo fechadas (CTCs) confinadas topologicamente sem colapso catastrófico da métrica pseudo-Riemanniana.`,
      '\\end{abstract}',
      '',
      '\\pacs{04.20.Gz, 04.20.Cv, 05.45.-a, 98.80.Jk}',
      '',
      '\\maketitle',
      '',
      '\\section{Introdução e Fundamentação Lorentziana}',
      'A geometria local do espaço-tempo na variedade $\\mathcal{M}$ com assinatura $(-+++)$ é governada pelo elemento de linha invariante de Minkowski:',
      '\\begin{equation}',
      'ds^2 = g_{\\mu\\nu} dx^\\mu dx^\\nu = -c^2 dt^2 + dx^2 + dy^2 + dz^2',
      '\\label{eq:minkowski}',
      '\\end{equation}',
      'onde a velocidade da luz $c = 2.99792458 \\times 10^8\\,\\text{m/s}$ estabelece a velocidade assimptótica máxima para transferência causal de informação, formalmente validada pela ausência de vento de éter no interferômetro de Michelson-Morley (1887) \\cite{michelson1887}.',
      '',
      'Para dois eventos $E_1(t_1, \\mathbf{x}_1)$ e $E_2(t_2, \\mathbf{x}_2)$, a conectividade causal requer que o intervalo seja estritamente não-espacial:',
      '\\begin{equation}',
      '\\Delta s^2 = -c^2 (\\Delta t)^2 + \\|\\Delta \\mathbf{x}\\|^2 \\le 0',
      '\\end{equation}',
      '',
      '\\section{Equações de Campo e Desvio Geodésico}',
      'A dinâmica gravitacional obedece às Equações de Campo de Einstein acopladas à constante cosmológica $\\Lambda$:',
      '\\begin{equation}',
      'R_{\\mu\\nu} - \\frac{1}{2} R g_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}',
      '\\label{eq:einstein}',
      '\\end{equation}',
      'O desvio entre trajetórias causais vizinhas $\\xi^\\mu$ é quantificado pela Equação de Jacobi:',
      '\\begin{equation}',
      '\\frac{D^2 \\xi^\\mu}{d\\tau^2} + {R^\\mu}_{\\nu\\rho\\sigma} u^\\nu \\xi^\\rho u^\\sigma = 0',
      '\\label{eq:jacobi}',
      '\\end{equation}',
      `onde a taxa exponencial de separação é dada pelo expoente de Lyapunov $\\lambda = ${metrics.lyapunovExponent}\\,\\text{ano}^{-1}$.`,
      '',
      '\\section{Princípio de Autoconsistência de Novikov}',
      'Na presença de curvas tipo-tempo fechadas (CTCs), a conservação global da causalidade é garantida pelo princípio formulado por Igor Novikov \\cite{novikov1990}:',
      '\\begin{equation}',
      '\\mathcal{P}(\\text{paradoxo}) = 0 \\iff \\sum_{\\text{trajetórias}} S_{\\text{clássico}}[\\gamma] = \\text{extremizado}',
      '\\end{equation}',
      '',
      '\\begin{table}[h]',
      '\\centering',
      '\\caption{Telemetria Causal e Parâmetros Métricos}',
      '\\label{tab:telemetry}',
      '\\begin{ruledtabular}',
      '\\begin{tabular}{lc}',
      '\\textbf{Grandeza Física} & \\textbf{Valor Computado} \\\\',
      '\\hline',
      `Nós Históricos Registrados ($N$) & ${metrics.totalEvents} \\\\`,
      `Geodésicas Causais Ativas ($E$) & ${metrics.totalEdges} \\\\`,
      `Variedades Dimensionais & ${metrics.dimensionsCount} \\\\`,
      `Índice de Integridade Temporal & ${metrics.temporalIntegrity}\\% \\\\`,
      `Curvas Tipo-Tempo Fechadas (CTCs) & ${metrics.paradoxCount} \\\\`,
      `Expoente Máximo de Lyapunov ($\\lambda$) & ${metrics.lyapunovExponent}\\,\\text{ano}^{-1} \\\\`,
      `Entropia de Kolmogorov-Sinai ($h_{\\text{KS}}$) & ${metrics.kolmogorovEntropy}\\,\\text{nats/ano} \\\\`,
      `Índice de Consistência de Novikov ($I_N$) & ${metrics.novikovIndex} \\\\`,
      `Distância Temporal Média & ${metrics.avgGeodesicDistance}\\,\\text{anos} \\\\`,
      `Densidade Topológica do Grafo ($\\rho$) & ${metrics.networkDensity} \\\\`,
      '\\end{tabular}',
      '\\end{ruledtabular}',
      '\\end{table}',
      '',
      '\\section{Amostragem de Singularidades no Grafo}',
      '\\begin{table*}[t]',
      '\\centering',
      '\\caption{Amostragem de Nós Temporais e Tensores de Impacto Histórico}',
      '\\label{tab:events}',
      '\\begin{ruledtabular}',
      '\\begin{tabular}{rllcc}',
      '\\textbf{Ano (AD)} & \\textbf{Marco Histórico / Singularidade Causal} & \\textbf{Classificação} & \\textbf{Peso Relativo} & \\textbf{Estado Causal} \\\\',
      '\\hline',
      eventRows,
      '\\end{tabular}',
      '\\end{ruledtabular}',
      '\\end{table*}',
      '',
      '\\section{Métrica de Kerr e Termodinâmica de Bekenstein-Hawking}',
      'Para corpos celestes em rotação estacionária e com simetria axial, a geometria externa é dada pela métrica de Kerr:',
      '\\begin{align}',
      'ds^2 = &-\\left(1 - \\frac{2Mr}{\\rho^2}\\right) dt^2 - \\frac{4aMr\\sin^2\\theta}{\\rho^2} dt\\,d\\phi \\nonumber \\\\',
      '&+ \\frac{\\rho^2}{\\Delta} dr^2 + \\rho^2 d\\theta^2 + \\left(r^2 + a^2 + \\frac{2Ma^2r\\sin^2\\theta}{\\rho^2}\\right)\\sin^2\\theta d\\phi^2',
      '\\label{eq:kerr}',
      '\\end{align}',
      'onde $\\rho^2 = r^2 + a^2\\cos^2\\theta$ e $\\Delta = r^2 - 2Mr + a^2$. A área do horizonte e a entropia de Bekenstein-Hawking são dadas por:',
      '\\begin{equation}',
      'A = 4\\pi (r_+^2 + a^2), \\quad S_{\\text{BH}} = \\frac{k_B c^3 A}{4 G \\hbar}',
      '\\end{equation}',
      'onde $r_+ = M + \\sqrt{M^2 - a^2}$ denota o raio do horizonte exterior.',
      '',
      '\\section{Discussão e Conclusões}',
      `A integridade global do continuum \\textit{${universe.name}} (${metrics.temporalIntegrity}\\%) comprova a estabilidade do fluxo causal contra perturbações não-lineares, corroborando a hipótese de proteção cronológica de Hawking.`,
      '',
      '\\begin{acknowledgments}',
      'Agradecemos ao Science Mission Directorate da NASA, ao consórcio Event Horizon Telescope (EHT) e aos pesquisadores do Laboratório Infinite Horizons.',
      '\\end{acknowledgments}',
      '',
      '\\begin{thebibliography}{99}',
      '\\bibitem{michelson1887}',
      'A.~A.~Michelson e E.~W.~Morley, \\textit{On the Relative Motion of the Earth and the Luminiferous Ether}, Am. J. Sci. \\textbf{34}, 333 (1887).',
      '',
      '\\bibitem{einstein1915}',
      'A.~Einstein, \\textit{Die Feldgleichungen der Gravitation}, Sitzungsber. Preuss. Akad. Wiss. Berlin, 844 (1915).',
      '',
      '\\bibitem{minkowski1908}',
      'H.~Minkowski, \\textit{Raum und Zeit}, Physikalische Zeitschrift \\textbf{10}, 104 (1909).',
      '',
      '\\bibitem{kerr1963}',
      'R.~P.~Kerr, \\textit{Gravitational Field of a Spinning Mass as an Example of Algebraically Special Metrics}, Phys. Rev. Lett. \\textbf{11}, 237 (1963).',
      '',
      '\\bibitem{novikov1990}',
      'I.~D.~Novikov, \\textit{An Analysis of the Operation of a Time Machine}, Sov. Phys. JETP \\textbf{68}, 439 (1989).',
      '',
      '\\bibitem{thorne1988}',
      'M.~S.~Morris, K.~S.~Thorne e U.~Yurtsever, \\textit{Wormholes, Time Machines, and the Weak Energy Condition}, Phys. Rev. Lett. \\textbf{61}, 1446 (1988).',
      '',
      '\\bibitem{hawking1974}',
      'S.~W.~Hawking, \\textit{Black Hole Explosions?}, Nature \\textbf{248}, 30 (1974).',
      '',
      '\\bibitem{everett1957}',
      'H.~Everett~III, \\textit{"Relative State" Formulation of Quantum Mechanics}, Rev. Mod. Phys. \\textbf{29}, 454 (1957).',
      '\\end{thebibliography}',
      '',
      '\\end{document}',
    ];

    return lines.join('\n');
  }

  /**
   * Gera a bibliografia canônica em formato BibTeX (.bib)
   */
  public static generateBibTeX(universe: Universe): string {
    const dateStr = new Date().toISOString().split('T')[0];

    const bibEntries: string[] = [
      '% =========================================================================',
      '% BIBLIOGRAFIA CIENTÍFICA (BIBTEX) — INFINITE HORIZONS',
      `% Variedade: ${universe.name}`,
      `% Exportado em: ${dateStr}`,
      '% =========================================================================',
      '',
      '@article{michelson1887,',
      '  author  = {Michelson, Albert A. and Morley, Edward W.},',
      '  title   = {On the Relative Motion of the Earth and the Luminiferous Ether},',
      '  journal = {American Journal of Science},',
      '  volume  = {s3-34},',
      '  number  = {203},',
      '  pages   = {333--345},',
      '  year    = {1887},',
      '  doi     = {10.2475/ajs.s3-34.203.333}',
      '}',
      '',
      '@article{einstein1915,',
      '  author  = {Einstein, Albert},',
      '  title   = {Die Feldgleichungen der Gravitation},',
      '  journal = {Sitzungsberichte der Preussischen Akademie der Wissenschaften},',
      '  volume  = {1915},',
      '  pages   = {844--847},',
      '  year    = {1915}',
      '}',
      '',
      '@article{minkowski1908,',
      '  author  = {Minkowski, Hermann},',
      '  title   = {Raum und Zeit},',
      '  journal = {Physikalische Zeitschrift},',
      '  volume  = {10},',
      '  pages   = {104--111},',
      '  year    = {1909}',
      '}',
      '',
      '@article{kerr1963,',
      '  author  = {Kerr, Roy P.},',
      '  title   = {Gravitational Field of a Spinning Mass as an Example of Algebraically Special Metrics},',
      '  journal = {Physical Review Letters},',
      '  volume  = {11},',
      '  number  = {5},',
      '  pages   = {237--238},',
      '  year    = {1963},',
      '  doi     = {10.1103/PhysRevLett.11.237}',
      '}',
      '',
      '@article{novikov1990,',
      '  author  = {Novikov, Igor D.},',
      '  title   = {An Analysis of the Operation of a Time Machine},',
      '  journal = {Soviet Physics JETP},',
      '  volume  = {68},',
      '  pages   = {439--443},',
      '  year    = {1989}',
      '}',
      '',
      '@article{thorne1988,',
      '  author  = {Morris, Michael S. and Thorne, Kip S. and Yurtsever, Ulvi},',
      '  title   = {Wormholes, Time Machines, and the Weak Energy Condition},',
      '  journal = {Physical Review Letters},',
      '  volume  = {61},',
      '  number  = {13},',
      '  pages   = {1446--1449},',
      '  year    = {1988},',
      '  doi     = {10.1103/PhysRevLett.61.1446}',
      '}',
      '',
      '@article{hawking1974,',
      '  author  = {Hawking, Stephen W.},',
      '  title   = {Black Hole Explosions?},',
      '  journal = {Nature},',
      '  volume  = {248},',
      '  number  = {5443},',
      '  pages   = {30--31},',
      '  year    = {1974},',
      '  doi     = {10.1038/248030a0}',
      '}',
      '',
      '@article{everett1957,',
      '  author  = {Everett, Hugh},',
      '  title   = {Relative State Formulation of Quantum Mechanics},',
      '  journal = {Reviews of Modern Physics},',
      '  volume  = {29},',
      '  number  = {3},',
      '  pages   = {454--462},',
      '  year    = {1957},',
      '  doi     = {10.1103/RevModPhys.29.454}',
      '}',
      '',
      '@misc{infinitehorizons2026,',
      '  author       = {Infinite Horizons Theoretical Physics Laboratory},',
      `  title        = {Topological Geodesic Dynamics and Causal Self-Consistency in Multidimensional Lorentzian Manifolds: ${universe.name}},`,
      '  howpublished = {Computational Relativity Preprint Archive},',
      '  year         = {2026},',
      '  url          = {https://infinite-horizons.cosmos}',
      '}',
    ];

    return bibEntries.join('\n');
  }
}
