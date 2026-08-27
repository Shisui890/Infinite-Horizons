import type { Universe } from '../types/temporal';

export function exportToBibTeX(universe: Universe): string {
  return `% ====================================================================
% BIBLIOGRAFIA ACADÊMICA — INFINITE HORIZONS
% Gerado automaticamente para o modelo: ${universe.name}
% ====================================================================

@article{einstein1915feldgleichungen,
  author = {Einstein, Albert},
  title = {Die Feldgleichungen der Gravitation},
  journal = {Sitzungsberichte der K{\\"o}niglich Preu{\\ss}ischen Akademie der Wissenschaften},
  pages = {844--847},
  year = {1915}
}

@article{einstein1935can,
  author = {Einstein, Albert and Podolsky, Boris and Rosen, Nathan},
  title = {Can Quantum-Mechanical Description of Physical Reality be Considered Complete?},
  journal = {Physical Review},
  volume = {47},
  number = {10},
  pages = {777--780},
  year = {1935},
  doi = {10.1103/PhysRev.47.777}
}

@article{penzias1965measurement,
  author = {Penzias, Arno A. and Wilson, Robert W.},
  title = {A Measurement of Excess Antenna Temperature at 4080 Mc/s},
  journal = {The Astrophysical Journal},
  volume = {142},
  pages = {419--421},
  year = {1965},
  doi = {10.1086/148307}
}

@article{green1984anomaly,
  author = {Green, Michael B. and Schwarz, John H.},
  title = {Anomaly cancellations in supersymmetric $D=10$ gauge theory and superstring theory},
  journal = {Physics Letters B},
  volume = {149},
  number = {1-3},
  pages = {117--122},
  year = {1984},
  doi = {10.1016/0370-2693(84)91565-X}
}

@article{witten1995string,
  author = {Witten, Edward},
  title = {String theory dynamics in various dimensions},
  journal = {Nuclear Physics B},
  volume = {443},
  number = {1-2},
  pages = {85--126},
  year = {1995},
  doi = {10.1016/0550-3213(95)00158-O}
}

@article{maldacena1999large,
  author = {Maldacena, Juan},
  title = {The Large-$N$ Limit of Superconformal Field Theories and Supergravity},
  journal = {International Journal of Theoretical Physics},
  volume = {38},
  number = {4},
  pages = {1113--1133},
  year = {1999},
  doi = {10.1023/A:1026654312961}
}

@article{perlmutter1999measurements,
  author = {Perlmutter, Saul and others},
  title = {Measurements of $\\Omega$ and $\\Lambda$ from 42 High-Redshift Supernovae},
  journal = {The Astrophysical Journal},
  volume = {517},
  number = {2},
  pages = {565--586},
  year = {1999},
  doi = {10.1086/307221}
}

@article{abbott2016observation,
  author = {Abbott, B. P. and others},
  collaboration = {LIGO Scientific Collaboration and Virgo Collaboration},
  title = {Observation of Gravitational Waves from a Binary Black Hole Merger},
  journal = {Physical Review Letters},
  volume = {116},
  number = {6},
  pages = {061102},
  year = {2016},
  doi = {10.1103/PhysRevLett.116.061102}
}

@article{eht2019first,
  author = {Akiyama, Kazunori and others},
  collaboration = {Event Horizon Telescope Collaboration},
  title = {First M87 Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole},
  journal = {The Astrophysical Journal Letters},
  volume = {875},
  number = {1},
  pages = {L1},
  year = {2019},
  doi = {10.3847/2041-8213/ab0ec7}
}

@article{maldacena2013cool,
  author = {Maldacena, Juan and Susskind, Leonard},
  title = {Cool horizons for entangled black holes},
  journal = {Fortschritte der Physik},
  volume = {61},
  number = {9},
  pages = {781--811},
  year = {2013},
  doi = {10.1002/prop.201300020}
}
`;
}

export function exportToLaTeX(universe: Universe): string {
  const allEvents = universe.dimensions.flatMap(d => d.events).sort((a, b) => a.year - b.year);

  const statusLabel = universe.temporalIntegrity >= 80 ? 'Estável e Congruente' : 'Sob Tensão Métrica';

  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[portuguese]{babel}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{geometry}
\\usepackage{booktabs}
\\usepackage{tikz}
\\usetikzlibrary{arrows.meta,positioning}

\\geometry{margin=2.5cm}

\\title{\\textbf{Modelagem de Causalidade no Espa\\c{c}o-Tempo:\\\\ ${universe.name}}}
\\author{Laborat\\'orio de F\\'isica Te\\'orica Infinite Horizons}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
Este documento apresenta a estrutura\\c{c}\\~ao formal e o grafo de depend\\^encias causais do modelo \\textbf{${universe.name}}, sintetizado pelo sistema Infinite Horizons. O modelo integra a Relatividade Geral de Einstein, cosmologia observacional $\\Lambda$CDM, a Teoria das Supercordas em 11 dimens\\~oes e a conjectura hologr\\'afica $ER = EPR$. A an\\'alise de autoconsist\\^encia temporal atesta uma integridade m\\'etrica de \\textbf{${universe.temporalIntegrity}\\%}.
\\end{abstract}

\\section{Introdu\\c{c}\\~ao e Fundamenta\\c{c}\\~ao Te\\'orica}
O estudo da din\\^amica causal fundamenta-se nas equa\\c{c}\\~oes de campo da Relatividade Geral:
\\begin{equation}
G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}
\\end{equation}
onde a curvatura geom\\'etrica do espa\\c{c}o-tempo delimita rigorosamente os cones de luz passado e futuro para cada evento, proibindo transmiss\\~oes causais superluminais ($v > c$).

Na escala de Planck ($\\ell_p \\sim 1.6 \\times 10^{-35}\\,\\text{m}$), a a\\c{c}\\~ao de Polyakov da Teoria das Supercordas descreve part\\'iculas como modos vibracionais em variedades de Calabi-Yau:
\\begin{equation}
S = -\\frac{1}{4\\pi\\alpha'} \\int d^2\\sigma \\sqrt{-\\gamma} \\gamma^{ab} \\partial_a X^\\mu \\partial_b X^\\nu \\eta_{\\mu\\nu}
\\end{equation}

\\section{Marcos Geod\\'esicos e Linha Temporal}
A Tabela~\\ref{tab:events} sumariza os principais eventos estruturados no modelo.

\\begin{table}[h!]
\\centering
\\small
\\begin{tabular}{rlll}
\\toprule
\\textbf{Ano} & \\textbf{Marco Cient\\'ifico} & \\textbf{Dom\\'inio} & \\textbf{Import\\^ancia} \\\\
\\midrule
${allEvents.map(e => `${e.year} & ${e.title.replace(/&/g, '\\&')} & ${e.category} & ${e.importance}/100 \\\\`).join('\n')}
\\bottomrule
\\end{tabular}
\\caption{Eventos e v\\'ertices causais que comp\\~oem o continuum.}
\\label{tab:events}
\\end{table}

\\section{An\\'alise de Autoconsist\\^encia de Novikov}
O Princ\\'ipio de Autoconsist\\^encia de Igor Novikov postula que a probabilidade global de qualquer trajet\\'oria que gere inconsist\\^encia causal autodestrutiva \\'e identicamente nula:
\\begin{equation}
P(\\text{inconsist\\^encia}) = 0
\\end{equation}
Com ${universe.paradoxes.length} inconsist\\^encias ativas, a estabilidade termodin\\^amica do modelo permanece \\textbf{${statusLabel}}.

\\bibliographystyle{plain}
\\bibliography{references}

\\end{document}
`;
}
