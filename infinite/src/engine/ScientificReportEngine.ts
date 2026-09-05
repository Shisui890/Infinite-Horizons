// ====================================================================
// GERADOR DE ARTIGO CIENTÍFICO (LATEX .TEX & RELATÓRIO IMPRIMÍVEL PDF)
// Padrão arXiv / Physical Review para o universo ativo
// ====================================================================

import { Universe } from '../types/temporal';

export class ScientificReportEngine {
  /**
   * Gera código fonte LaTeX (.tex) completo e pronto para compilar no Overleaf / TeXLive
   */
  public static generateLaTeX(universe: Universe): string {
    const allEvents = universe.dimensions.flatMap(d => d.events);
    const dateStr = new Date().toISOString().split('T')[0];

    return `% ====================================================================
% ARTIGO CIENTÍFICO: SIMULAÇÃO COSMOLÓGICA & CAUSALIDADE
% Gerado pelo Laboratório Infinite Horizons
% ====================================================================
\\documentclass[11pt,twocolumn,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{booktabs}
\\usepackage{microtype}
\\usepackage{hyperref}
\\usepackage{geometry}
\\geometry{margin=2cm}

\\title{\\textbf{Topologia Geodésica e Autoconsistência Causal na Variedade Multidimensional: \\textit{${universe.name}}}}
\\author{Laboratório de Física Teórica Infinite Horizons \\\\ Investigação Computacional do Espaço-Tempo}
\\date{${dateStr}}

\\begin{document}

\\maketitle

\\begin{abstract}
Investiga-se a dinâmica causal e a evolução geométrica do universo simulado \\textit{${universe.name}}. 
O sistema é constituído por ${universe.dimensions.length} variedades dimensionais acopladas, totalizando ${allEvents.length} nós de geodésica fundamentais. 
Sob imposição estrita do Princípio de Autoconsistência de Novikov, o continuum apresenta um índice global de integridade temporal de \\textbf{${universe.temporalIntegrity}\\%}, com detecção de \\textbf{${universe.paradoxes.length}} Curvas Tipo-Tempo Fechadas (CTCs). 
Apresentam-se as equações métricas de propagação e as ramificações sob a ótica da relatividade e supercordas.
\\end{abstract}

\\section{Estrutura Métrica, Crise do Éter e Invariância de Lorentz}
A geometria local do espaço-tempo é regida pelo intervalo invariante pseudo-riemanniano de Minkowski:
\\begin{equation}
ds^2 = -c^2 dt^2 + dx^2 + dy^2 + dz^2
\\end{equation}
Historicamente fundamentada na refutação da hipótese mecânica do éter luminífero pelo experimento de Michelson-Morley (1887), a velocidade de propagação de perturbações gravitacionais e eletromagnéticas é delimitada com exatidão invariante por $c \\approx 2.998 \\times 10^8\\,\\text{m/s}$. As conexões entre eventos satisfazem a condição de separação causal:
\\begin{equation}
\\Delta s^2 \\le 0 \\quad \\implies \\quad c^2 \\Delta t^2 \\ge \\Delta r^2
\\end{equation}

\\section{Variedades Dimensionais Ativas}
O multiverso é estratificado nas seguintes variedades topológicas:
\\begin{itemize}
${universe.dimensions.map(d => `  \\item \\textbf{[${d.designation}] ${d.name}}: ${d.events.length} eventos manifestos, integridade de ${d.integrity}\\%.`).join('\n')}
\\end{itemize}

\\section{Tabela de Eventos Geodésicos Fundamentais}
A Tabela~\\ref{tab:events} documenta os principais nós temporais registrados no continuum.

\\begin{table*}[t]
\\centering
\\small
\\caption{Nós de Geodésica e Propriedades Físicas}
\\label{tab:events}
\\begin{tabular}{lllcc}
\\toprule
\\textbf{Ano (AD)} & \\textbf{Evento Histórico / Marco Físico} & \\textbf{Categoria} & \\textbf{Importância} & \\textbf{Estado} \\\\
\\midrule
${allEvents.slice(0, 15).map(e => `${e.year} & ${e.title.replace(/&/g, '\\&')} & ${e.category} & ${e.importance}/100 & ${e.status} \\\\`).join('\n')}
\\bottomrule
\\end{tabular}
\\end{table*}

\\section{Diagnóstico de Entropia e Paradoxos}
O monitoramento da Segunda Lei da Termodinâmica Generalizada de Bekenstein assegura:
\\begin{equation}
\\Delta S_{\\text{total}} = \\Delta S_{\\text{matéria}} + \\Delta S_{\\text{horizonte}} \\ge 0
\\end{equation}
Para as ${universe.paradoxes.length} anomalias detectadas, foram computadas geodésicas de compensação para mitigar violações causais sem colapso descontínuo da função de onda universal.

\\section{Conclusão}
A simulação comprova a estabilidade do continuum sob perturbações não-lineares, validando as projeções computacionais do modelo ${universe.name}.

\\end{document}
`;
  }

  /**
   * Abre uma janela de relatório científico com visual acadêmico e comando nativo de impressão em PDF
   */
  public static openPrintableReport(universe: Universe): void {
    const allEvents = universe.dimensions.flatMap(d => d.events);
    const dateStr = new Date().toLocaleDateString('pt-BR');

    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Relatório Científico — ${universe.name}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: 'Times New Roman', Times, serif;
      color: #111;
      background: #fff;
      line-height: 1.5;
      margin: 0;
      padding: 24px;
    }
    .paper-header {
      text-align: center;
      border-bottom: 2px solid #222;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .paper-kicker {
      font-family: Arial, sans-serif;
      font-size: 0.75rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #555;
    }
    .paper-title {
      font-size: 1.6rem;
      font-weight: bold;
      margin: 8px 0 4px;
    }
    .paper-meta {
      font-size: 0.85rem;
      color: #444;
      font-style: italic;
    }
    .paper-abstract {
      background: #f8f9fa;
      border-left: 3px solid #006699;
      padding: 12px 16px;
      margin: 20px 0;
      font-size: 0.9rem;
    }
    .section-title {
      font-size: 1.15rem;
      font-weight: bold;
      border-bottom: 1px solid #ccc;
      padding-bottom: 4px;
      margin-top: 24px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin: 16px 0;
    }
    .metric-box {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;
      border-radius: 4px;
    }
    .metric-box strong {
      display: block;
      font-size: 1.2rem;
      color: #006699;
    }
    .metric-box span {
      font-size: 0.72rem;
      color: #666;
      text-transform: uppercase;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      font-size: 0.82rem;
    }
    th, td {
      border-bottom: 1px solid #ddd;
      padding: 6px 8px;
      text-align: left;
    }
    th {
      background: #f1f3f5;
      font-weight: bold;
    }
    .formula-box {
      text-align: center;
      font-style: italic;
      margin: 12px 0;
      padding: 8px;
      background: #fbfbfb;
      border: 1px dashed #ccc;
      font-family: 'Courier New', Courier, monospace;
    }
    .paper-footer {
      margin-top: 40px;
      padding-top: 12px;
      border-top: 1px solid #ccc;
      font-size: 0.75rem;
      color: #777;
      display: flex;
      justify-content: space-between;
    }
    .no-print {
      margin-bottom: 20px;
      text-align: right;
    }
    .btn-print {
      background: #006699;
      color: white;
      border: none;
      padding: 8px 18px;
      font-size: 0.9rem;
      cursor: pointer;
      border-radius: 4px;
      font-weight: bold;
    }
    @media print {
      .no-print { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="btn-print" onclick="window.print()">Imprimir / Salvar como PDF</button>
  </div>

  <div class="paper-header">
    <span class="paper-kicker">Infinite Horizons • Laboratório de Física Teórica e Causalidade</span>
    <h1 class="paper-title">Relatório Técnico e Topológico do Espaço-Tempo: ${universe.name}</h1>
    <div class="paper-meta">Publicação Experimental Computacional • Data de Emissão: ${dateStr}</div>
  </div>

  <div class="paper-abstract">
    <strong>Resumo Executivo:</strong> Este documento formaliza o estado métrico e as relações causais simuladas no modelo cosmogônico <em>${universe.name}</em>. Com ${universe.dimensions.length} variedades dimensionais interconectadas e ${allEvents.length} eventos históricos mapeados, o sistema opera sob integridade causal de <strong>${universe.temporalIntegrity}%</strong> com ${universe.paradoxes.length} paradoxo(s) ativo(s) detectado(s).
  </div>

  <div class="metrics-grid">
    <div class="metric-box">
      <strong>${universe.temporalIntegrity}%</strong>
      <span>Integridade Global</span>
    </div>
    <div class="metric-box">
      <strong>${universe.dimensions.length}</strong>
      <span>Variedades Dimensionais</span>
    </div>
    <div class="metric-box">
      <strong>${allEvents.length}</strong>
      <span>Nós de Geodésica</span>
    </div>
    <div class="metric-box">
      <strong>${universe.paradoxes.length}</strong>
      <span>Curvas Tipo-Tempo (CTCs)</span>
    </div>
  </div>

  <div class="section-title">1. Formulação Métrica & Princípios de Relatividade</div>
  <p>
    A velocidade invariante da luz ($c = 299.792\\,\\text{km/s}$) atua como limite assintótico para todas as transmissões de informação no grafo acíclico direcionado (DAG). Com base na superação da hipótese do éter luminífero demonstrada pelo experimento de Michelson-Morley (1887) e formalizada por Einstein (1905), o tensor métrico obedece às equações de campo relativísticas com perturbações atenuadas pelo princípio de Novikov:
  </p>
  <div class="formula-box">
    ds² = -c² dt² + dx² + dy² + dz² &nbsp;&nbsp;|&nbsp;&nbsp; ΔS_total ≥ 0
  </div>

  <div class="section-title">2. Catálogo de Eventos Históricos e Nós Geodésicos</div>
  <table>
    <thead>
      <tr>
        <th>Ano</th>
        <th>Denominação do Evento</th>
        <th>Categoria</th>
        <th>Importância</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${allEvents.map(e => `
        <tr>
          <td><strong>${e.year}</strong></td>
          <td>${e.title}</td>
          <td>${e.category}</td>
          <td>${e.importance}/100</td>
          <td>${e.status.toUpperCase()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="paper-footer">
    <span>Gerado pelo Simulador Infinite Horizons</span>
    <span>Documento Técnico com Validação Relativística</span>
  </div>
</body>
</html>`;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(htmlContent);
      printWin.document.close();
    }
  }
}
