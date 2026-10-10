import { useState, useMemo } from 'react';
import { Universe } from '../../types/temporal';
import { AcademicPaperExportService } from '../../engine/AcademicPaperExportService';
import { ScientificReportEngine } from '../../engine/ScientificReportEngine';
import MathFormula from '../MathFormula';
import { formatHistoricalYear } from '../../utils/formatters';
import { useLaymanMode } from '../../context/LaymanModeContext';

interface Props {
  universe: Universe;
  onClose: () => void;
}

type TabMode = 'preview' | 'latex' | 'bibtex';

const STATUS_LABELS: Record<string, string> = {
  stable: 'Estável',
  altered: 'Alterado',
  unstable: 'Instável',
  collapsed: 'Colapsado',
  paradoxical: 'Paradoxal',
  erased: 'Apagado',
  diverged: 'Divergente',
};

export default function AcademicPaperExportModal({ universe, onClose }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const [tab, setTab] = useState<TabMode>('preview');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const metrics = useMemo(() => AcademicPaperExportService.computePaperMetrics(universe), [universe]);
  const latexCode = useMemo(() => AcademicPaperExportService.generateRevTeX(universe), [universe]);
  const bibtexCode = useMemo(() => AcademicPaperExportService.generateBibTeX(universe), [universe]);

  const allEvents = useMemo(() => {
    return universe.dimensions.flatMap(d => d.events).sort((a, b) => a.year - b.year);
  }, [universe]);

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`${label} copiado para a área de transferência!`);
    setTimeout(() => setCopyFeedback(null), 3000);
  }

  function downloadFile(content: string, filename: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setCopyFeedback(`Download iniciado: ${filename}`);
    setTimeout(() => setCopyFeedback(null), 3000);
  }

  return (
    <div className="academic-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="academic-modal-card" onClick={e => e.stopPropagation()}>
        {/* Modal Top Header */}
        <header className="academic-modal-header">
          <div className="academic-header-left">
            <span className="academic-pill-badge">
              <span className="pill-dot" />
              {isLaymanMode ? 'DOCUMENTO FORMATADO PARA REVISTA CIENTÍFICA (REVTeX)' : 'PHYSICAL REVIEW D // REVTEX 4-2 PREPRINT'}
            </span>
            <h2 className="academic-modal-title">
              {isLaymanMode ? 'Artigo Científico em Formato de Revista: ' : 'Exportador de Artigo Científico: '}<em>{universe.name}</em>
            </h2>
          </div>

          <div className="academic-header-right">
            <button
              type="button"
              className="btn-print-academic"
              onClick={() => ScientificReportEngine.openPrintableReport(universe)}
              title="Abrir versão de impressão em PDF de alta resolução"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Imprimir / Gerar PDF</span>
            </button>

            <button
              type="button"
              className="btn-academic-close"
              onClick={onClose}
              aria-label="Fechar modal de artigo acadêmico"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        {isLaymanMode && (
          <div className="layman-explanation-card" style={{ margin: '12px 20px 0', padding: '10px 14px', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <strong style={{ fontSize: '0.78rem', color: '#38bdf8', letterSpacing: '0.04em' }}>O QUE É ESTE DOCUMENTO?</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.4' }}>
              Este é um <strong>artigo científico oficial</strong> gerado a partir da sua simulação, formatado exatamente no mesmo padrão que cientistas e universidades (como Harvard, MIT e Physical Review) usam para publicar novas descobertas na física!
            </p>
          </div>
        )}

        {/* Tab Navigation & Action Bar */}
        <div className="academic-tab-bar">
          <div className="academic-tabs-group">
            <button
              type="button"
              className={`academic-tab-btn ${tab === 'preview' ? 'active' : ''}`}
              onClick={() => setTab('preview')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>{isLaymanMode ? 'Como Fica na Revista (Prévia)' : 'Prévia Formatada (Journal Layout)'}</span>
            </button>

            <button
              type="button"
              className={`academic-tab-btn ${tab === 'latex' ? 'active' : ''}`}
              onClick={() => setTab('latex')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span>{isLaymanMode ? 'Código para Cientistas (LaTeX)' : 'Código LaTeX (.tex)'}</span>
            </button>

            <button
              type="button"
              className={`academic-tab-btn ${tab === 'bibtex' ? 'active' : ''}`}
              onClick={() => setTab('bibtex')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>{isLaymanMode ? 'Livros e Fontes Citadas (BibTeX)' : 'Bibliografia BibTeX (.bib)'}</span>
            </button>
          </div>

          <div className="academic-actions-group">
            {tab === 'latex' && (
              <>
                <button
                  type="button"
                  className="btn-academic-util"
                  onClick={() => copyToClipboard(latexCode, 'Código LaTeX')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copiar .tex</span>
                </button>
                <button
                  type="button"
                  className="btn-academic-util"
                  onClick={() => downloadFile(latexCode, `artigo_${universe.id}.tex`, 'application/x-latex')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Baixar .tex</span>
                </button>
              </>
            )}

            {tab === 'bibtex' && (
              <>
                <button
                  type="button"
                  className="btn-academic-util"
                  onClick={() => copyToClipboard(bibtexCode, 'Bibliografia BibTeX')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copiar .bib</span>
                </button>
                <button
                  type="button"
                  className="btn-academic-util"
                  onClick={() => downloadFile(bibtexCode, `referencias_${universe.id}.bib`, 'text/plain')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Baixar .bib</span>
                </button>
              </>
            )}

            {tab === 'preview' && (
              <button
                type="button"
                className="btn-academic-util"
                onClick={() => copyToClipboard(latexCode, 'Código LaTeX')}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copiar Fonte LaTeX</span>
              </button>
            )}
          </div>
        </div>

        {/* Copy Feedback Notification */}
        {copyFeedback && (
          <div className="academic-toast-feedback">
            <span className="toast-dot" />
            <span>{copyFeedback}</span>
          </div>
        )}

        {/* Modal Main Viewport */}
        <div className="academic-viewport">
          {/* TAB 1: PREVIEW */}
          {tab === 'preview' && (
            <div className="academic-paper-sheet">
              {/* Journal Banner */}
              <div className="paper-journal-banner">
                <div className="journal-id">PHYSICAL REVIEW D 109, 084021 (2026)</div>
                <div className="journal-doi">DOI: 10.1103/PhysRevD.109.084021</div>
              </div>

              {/* Title & Authors */}
              <h1 className="paper-headline">
                Topologia Geodésica, Invariância de Lorentz e Autoconsistência de Novikov na Variedade Relativística: <em>{universe.name}</em>
              </h1>

              <div className="paper-authors-block">
                <div className="author-names">Consórcio Internacional de Astrofísica Teórica e Causalidade</div>
                <div className="author-affil">Laboratório de Física Computacional Infinite Horizons, Rio de Janeiro & Princeton</div>
                <div className="paper-date-stamp">(Recebido em 14 de Fevereiro de 2026; Aceito para publicação em {metrics.generatedDate})</div>
              </div>

              {/* Abstract */}
              <div className="paper-abstract-box">
                <div className="abstract-label">RESUMO</div>
                <p>
                  Investigamos analiticamente e computacionalmente a estabilidade causal e a propagação geodésica na variedade Lorentziana quadridimensional associada ao continuum <em>{universe.name}</em>. O sistema modelado é parametrizado por {metrics.dimensionsCount} variedades paralelas acopladas, abrangendo {metrics.totalEvents} singularidades históricas e {metrics.totalEdges} geodésicas causais orientadas. Sob perturbações não-lineares, obtemos um expoente máximo de Lyapunov <MathFormula math={`\\lambda = ${metrics.lyapunovExponent}\\,\\text{ano}^{-1}`} />, correspondente a uma taxa de produção de entropia de Kolmogorov-Sinai <MathFormula math={`h_{\\text{KS}} = ${metrics.kolmogorovEntropy}\\,\\text{nats/ano}`} />. A imposição do Princípio de Autoconsistência de Igor Novikov resulta em um índice de integridade temporal de <strong>{metrics.temporalIntegrity}%</strong>, contendo <strong>{metrics.paradoxCount}</strong> curvas tipo-tempo fechadas (CTCs) confinadas topologicamente sem colapso catastrófico da métrica pseudo-Riemanniana. Nossos resultados corroboram a conjectura de proteção cronológica em grafos causais assintoticamente planos.
                </p>
                <div className="paper-pacs">
                  <strong>PACS:</strong> 04.20.Gz, 04.20.Cv, 05.45.-a, 98.80.Jk &mdash; <strong>Códigos de Assunto:</strong> Relatividade Geral, Causalidade Global, Sistemas Caóticos.
                </div>
              </div>

              {/* Two-Column Journal Body */}
              <div className="paper-two-col-body">
                {/* Column 1 */}
                <div className="paper-col">
                  <h3 className="paper-sec-heading">I. INTRODUÇÃO & FUNDAMENTAÇÃO</h3>
                  <p>
                    A geometria local do espaço-tempo na variedade quadri-dimensional <MathFormula math="\mathcal{M}" /> com assinatura lorentziana <MathFormula math="(-+++)" /> é governada pelo elemento de linha invariante de Minkowski:
                  </p>
                  <div className="paper-formula-box">
                    <MathFormula math="ds^2 = g_{\mu\nu} dx^\mu dx^\nu = -c^2 dt^2 + dx^2 + dy^2 + dz^2" block />
                  </div>
                  <p>
                    Historicamente validada pela ausência de vento de éter no experimento de Michelson-Morley (1887), a velocidade limite da causalidade é rigorosamente <MathFormula math="c \approx 2.998 \times 10^8\,\text{m/s}" />. A separação entre quaisquer dois acontecimentos históricos satisfaz:
                  </p>
                  <div className="paper-formula-box">
                    <MathFormula math="\Delta s^2 \le 0 \implies c^2 (\Delta t)^2 \ge \|\Delta \mathbf{x}\|^2" block />
                  </div>

                  <h3 className="paper-sec-heading">II. EQUAÇÃO DE JACOBI & CAOS CAUSAL</h3>
                  <p>
                    A dispersão de geodésicas vizinhas sob perturbações pontuais do tipo Efeito Borboleta é descrita pelo tensor de Riemann via equação de desvio geodésico:
                  </p>
                  <div className="paper-formula-box">
                    <MathFormula math="\frac{D^2 \xi^\mu}{d\tau^2} + {R^\mu}_{\nu\rho\sigma} u^\nu \xi^\rho u^\sigma = 0" block />
                  </div>
                  <p>
                    O expoente máximo de Lyapunov extraído da dinâmica das variedades é <MathFormula math={`\\lambda = ${metrics.lyapunovExponent}\\,\\text{ano}^{-1}`} />, demonstrando convergência estável da matriz de transição.
                  </p>

                  <h3 className="paper-sec-heading">III. AUTOCONSISTÊNCIA DE NOVIKOV</h3>
                  <p>
                    O Princípio de Igor Dmitriyevich Novikov (1990) postula que a probabilidade local de eventos paradoxais é estritamente nula:
                  </p>
                  <div className="paper-formula-box">
                    <MathFormula math="\mathcal{P}(\text{paradoxo}) = 0 \iff \sum_{\gamma} S[\gamma] = \text{extremizado}" block />
                  </div>
                  <p>
                    O índice global obtido para o continuum ativo é <MathFormula math={`I_N = ${metrics.novikovIndex}`} />.
                  </p>

                  <h3 className="paper-sec-heading">IV. MÉTRICA DE KERR & TERMODINÂMICA</h3>
                  <p>
                    Para corpos celestes em rotação estacionária com simetria axial, a geometria externa da variedade é regida pela métrica de Kerr:
                  </p>
                  <div className="paper-formula-box">
                    <MathFormula math="ds^2 = -\left(1 - \frac{2Mr}{\rho^2}\right) dt^2 - \frac{4aMr\sin^2\theta}{\rho^2} dt\,d\phi + \frac{\rho^2}{\Delta} dr^2 + \rho^2 d\theta^2 + \Sigma\sin^2\theta d\phi^2" block />
                  </div>
                  <p>
                    A área do horizonte de eventos exterior <MathFormula math="r_+ = M + \sqrt{M^2 - a^2}" /> e a correspondente entropia de Bekenstein-Hawking satisfazem:
                  </p>
                  <div className="paper-formula-box">
                    <MathFormula math="A = 4\pi (r_+^2 + a^2), \qquad S_{\text{BH}} = \frac{k_B c^3 A}{4 G \hbar}" block />
                  </div>
                </div>

                {/* Column 2 */}
                <div className="paper-col">
                  <h3 className="paper-sec-heading">V. TELEMETRIA DA SIMULAÇÃO</h3>
                  <table className="paper-data-table">
                    <thead>
                      <tr>
                        <th>Parâmetro Físico</th>
                        <th>Valor Computado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Nós Históricos Registrados (<MathFormula math="N" />)</td>
                        <td><strong>{metrics.totalEvents}</strong></td>
                      </tr>
                      <tr>
                        <td>Geodésicas Causais (<MathFormula math="E" />)</td>
                        <td><strong>{metrics.totalEdges}</strong></td>
                      </tr>
                      <tr>
                        <td>Variedades Dimensionais</td>
                        <td><strong>{metrics.dimensionsCount}</strong></td>
                      </tr>
                      <tr>
                        <td>Integridade Temporal</td>
                        <td><strong>{metrics.temporalIntegrity}%</strong></td>
                      </tr>
                      <tr>
                        <td>CTCs / Paradoxos Ativos</td>
                        <td><strong>{metrics.paradoxCount}</strong></td>
                      </tr>
                      <tr>
                        <td>Expoente de Lyapunov (<MathFormula math="\lambda" />)</td>
                        <td><strong>{metrics.lyapunovExponent}</strong> ano⁻¹</td>
                      </tr>
                      <tr>
                        <td>Entropia Kolmogorov-Sinai (<MathFormula math="h_{\text{KS}}" />)</td>
                        <td><strong>{metrics.kolmogorovEntropy}</strong> nats/ano</td>
                      </tr>
                      <tr>
                        <td>Índice de Novikov (<MathFormula math="I_N" />)</td>
                        <td><strong>{metrics.novikovIndex}</strong></td>
                      </tr>
                      <tr>
                        <td>Distância Geodésica Média</td>
                        <td><strong>{metrics.avgGeodesicDistance}</strong> anos</td>
                      </tr>
                      <tr>
                        <td>Densidade Topológica (<MathFormula math="\rho" />)</td>
                        <td><strong>{metrics.networkDensity}</strong></td>
                      </tr>
                    </tbody>
                  </table>

                  <h3 className="paper-sec-heading">VI. AMOSTRAGEM DE SINGULARIDADES</h3>
                  <table className="paper-data-table paper-events-table">
                    <thead>
                      <tr>
                        <th style={{ width: '85px' }}>Ano</th>
                        <th>Marco Histórico</th>
                        <th style={{ width: '95px', textAlign: 'center' }}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allEvents.slice(0, 8).map(ev => {
                        const statusKey = ev.status.toLowerCase();
                        const statusLabel = STATUS_LABELS[statusKey] || ev.status;
                        return (
                          <tr key={ev.id}>
                            <td><strong>{formatHistoricalYear(ev.year)}</strong></td>
                            <td>{ev.title}</td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`paper-status-tag status-${statusKey}`}>
                                {statusLabel}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <h3 className="paper-sec-heading">VII. DISCUSSÃO & CONCLUSÕES</h3>
                  <p>
                    A integridade temporal de <strong>{metrics.temporalIntegrity}%</strong> obtida no continuum <em>{universe.name}</em> comprova a estabilidade do fluxo causal contra perturbações não-lineares, corroborando a hipótese de proteção cronológica de Hawking em variedades assintoticamente planas.
                  </p>

                  <h3 className="paper-sec-heading">VIII. REFERÊNCIAS CITADAS</h3>
                  <ol className="paper-ref-list">
                    <li>A. A. Michelson, E. W. Morley, <em>Am. J. Sci.</em> <strong>34</strong>, 333 (1887).</li>
                    <li>A. Einstein, <em>Sitzungsber. Preuss. Akad. Wiss.</em>, 844 (1915).</li>
                    <li>H. Minkowski, <em>Phys. Z.</em> <strong>10</strong>, 104 (1909).</li>
                    <li>R. P. Kerr, <em>Phys. Rev. Lett.</em> <strong>11</strong>, 237 (1963).</li>
                    <li>I. D. Novikov, <em>Sov. Phys. JETP</em> <strong>68</strong>, 439 (1989).</li>
                    <li>K. S. Thorne et al., <em>Phys. Rev. Lett.</em> <strong>61</strong>, 1446 (1988).</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LATEX SOURCE CODE */}
          {tab === 'latex' && (
            <div className="academic-code-container">
              <div className="academic-code-banner">
                <span>FORMATO: RevTeX 4-2 (Physical Review / arXiv) &mdash; Pronto para Overleaf, TeXLive ou MacTeX</span>
              </div>
              <pre className="academic-code-block">
                <code>{latexCode}</code>
              </pre>
            </div>
          )}

          {/* TAB 3: BIBTEX REFERENCES */}
          {tab === 'bibtex' && (
            <div className="academic-code-container">
              <div className="academic-code-banner">
                <span>FORMATO: BibTeX Padrão (.bib) &mdash; Compatível com Zotero, Mendeley e Overleaf</span>
              </div>
              <pre className="academic-code-block">
                <code>{bibtexCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
