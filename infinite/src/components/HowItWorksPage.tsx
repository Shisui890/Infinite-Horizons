import { useState } from 'react';
import { useLaymanMode } from '../context/LaymanModeContext';
import MathFormula from './MathFormula';

interface Props {
  onBack: () => void;
  onStartSimulator: () => void;
}

type GuideTab =
  | 'quickstart'
  | 'causal_engine'
  | 'aerospace_cartography'
  | 'advanced_tools'
  | 'theoretical_dossier';

export default function HowItWorksPage({ onBack, onStartSimulator }: Props) {
  const { isLaymanMode, toggleLaymanMode } = useLaymanMode();
  const [activeTab, setActiveTab] = useState<GuideTab>('quickstart');

  return (
    <div className="how-it-works-page">
      {/* Background Lighting */}
      <div className="guide-ambient-glow" />

      {/* Top Floating Navigation */}
      <header className="guide-navbar">
        <div className="guide-nav-content">
          <button type="button" className="btn-guide-back" onClick={onBack} title="Retornar à tela inicial">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Retornar ao Início</span>
          </button>

          <div className="guide-brand">
            <span className="guide-brand-dot" />
            <span className="guide-brand-title">INFINITE<strong>HORIZONS</strong></span>
            <span className="guide-brand-badge">MANUAL DO LABORATÓRIO</span>
          </div>

          <div className="guide-nav-actions">
            <button
              type="button"
              className={`btn-mode-toggle ${isLaymanMode ? 'mode-layman' : 'mode-academic'}`}
              onClick={toggleLaymanMode}
              title="Alternar entre explicações intuitivas do cotidiano e formalismo físico-matemático com tensores"
            >
              <span className="mode-toggle-dot" />
              <span>{isLaymanMode ? 'MODO DIDÁTICO' : 'MODO RIGOROSO'}</span>
            </button>

            <button type="button" className="btn-cta-sim" onClick={onStartSimulator}>
              <span>ABRIR SIMULADOR</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="guide-hero">
        <div className="guide-hero-container">
          <div className="guide-pill-badge">
            <span className="pill-dot" />
            DOCUMENTAÇÃO CIENTÍFICA & OPERACIONAL // v2.4
          </div>
          <h1 className="guide-hero-title">
            Manual de Operações do <span className="text-gradient-cyan">Laboratório Cósmico</span>
          </h1>
          <p className="guide-hero-desc">
            {isLaymanMode
              ? 'Guia passo a passo ilustrado para manipular linhas do tempo históricas, explorar o cosmos real em 3D, pilotar foguetes da NASA e simular futuros possíveis com física de verdade.'
              : 'Dossiê técnico e compêndio teórico abrangendo causalidade Lorentziana, mecânica estatística de Monte Carlo, cartografia estelar astrométrica e dinâmica aeroespacial orbital.'}
          </p>

          {/* 5-Tab Navigation Bar */}
          <div className="guide-tabs-bar" role="tablist" aria-label="Abas do Manual">
            <button
              type="button"
              className={`guide-tab-btn ${activeTab === 'quickstart' ? 'active' : ''}`}
              onClick={() => setActiveTab('quickstart')}
              role="tab"
              aria-selected={activeTab === 'quickstart'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>1. Guia Rápido & Interface</span>
            </button>

            <button
              type="button"
              className={`guide-tab-btn ${activeTab === 'causal_engine' ? 'active' : ''}`}
              onClick={() => setActiveTab('causal_engine')}
              role="tab"
              aria-selected={activeTab === 'causal_engine'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>2. Manipulação Causal</span>
            </button>

            <button
              type="button"
              className={`guide-tab-btn ${activeTab === 'aerospace_cartography' ? 'active' : ''}`}
              onClick={() => setActiveTab('aerospace_cartography')}
              role="tab"
              aria-selected={activeTab === 'aerospace_cartography'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 22 22 22" />
              </svg>
              <span>3. Cartografia & Voo Aeroespacial</span>
            </button>

            <button
              type="button"
              className={`guide-tab-btn ${activeTab === 'advanced_tools' ? 'active' : ''}`}
              onClick={() => setActiveTab('advanced_tools')}
              role="tab"
              aria-selected={activeTab === 'advanced_tools'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span>4. Ferramentas & Observatório NASA</span>
            </button>

            <button
              type="button"
              className={`guide-tab-btn ${activeTab === 'theoretical_dossier' ? 'active' : ''}`}
              onClick={() => setActiveTab('theoretical_dossier')}
              role="tab"
              aria-selected={activeTab === 'theoretical_dossier'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>5. Dossiê Teórico Formal</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="guide-body-container">
        {/* ========================================================================= */}
        {/* TAB 1: GUIA RÁPIDO & INTERFACE CÓSMICA */}
        {/* ========================================================================= */}
        {activeTab === 'quickstart' && (
          <div className="guide-instruction-layout">
            <div className="instruction-intro-card">
              <div className="inst-badge-row">
                <span className="inst-badge-primary">TOPOLOGIA DA INTERFACE</span>
                <span className="inst-badge-tech">4 ÁREAS OPERACIONAIS</span>
              </div>
              <h3>Anatomia do Console de Simulação</h3>
              <p>
                {isLaymanMode
                  ? 'A tela do simulador foi projetada para colocar todos os controles na ponta dos seus dedos. Veja como cada área funciona:'
                  : 'Arquitetura modular de cockpit com desacoplamento funcional entre viewport Lorentziano, matriz de dimensões e subsistema telemetria.'}
              </p>
              <div className="screen-areas-grid">
                <div className="screen-area-item">
                  <span className="area-badge">TOPO</span>
                  <strong>Barra Superior de Controle</strong>
                  <span>Acesso a ações instantâneas (+ Nó, + Observador, Intervenção), ferramentas estocásticas (Monte Carlo, Comparador, Cones 3D) e Oráculo de IA.</span>
                </div>
                <div className="screen-area-item">
                  <span className="area-badge">ESQUERDA</span>
                  <strong>Painel de Variedades (Dimensões)</strong>
                  <span>Gerenciamento das linhas temporais paralelas ativas (ex: Linha Alfa, Variedades de Everett) e lista de viajantes/sondas espaciais.</span>
                </div>
                <div className="screen-area-item">
                  <span className="area-badge">CENTRO</span>
                  <strong>Canvas Interativo Lorentziano</strong>
                  <span>Grafo dinâmico com nós históricos conectados por geodésicas de causa e efeito. Suporta pan, zoom e inspeção direta.</span>
                </div>
                <div className="screen-area-item">
                  <span className="area-badge">RODAPÉ</span>
                  <strong>Scrubber Temporal & Replay</strong>
                  <span>Linha do tempo contínua com slider de anos, reprodutor automático (Play/Pause/Velocidade) e console expansível de telemetria.</span>
                </div>
              </div>
            </div>

            <div className="guide-steps-vertical">
              <div className="instruction-card">
                <div className="inst-header">
                  <span className="inst-step-num">PASSO 1</span>
                  <h4>Navegação Espacial no Gráfico Central</h4>
                </div>
                <ul className="inst-action-list">
                  <li><strong>Arrastar Nós:</strong> Clique com o botão esquerdo do mouse (ou toque no mobile) sobre qualquer evento histórico e arraste para reorganizar o layout espacial.</li>
                  <li><strong>Pan no Espaço-Tempo:</strong> Clique em qualquer ponto vazio do fundo cósmico e arraste para explorar diferentes épocas da linha temporal.</li>
                  <li><strong>Zoom Infinito:</strong> Use a roda do mouse (scroll) ou gesto de pinça no smartphone para aproximar ou ter uma visão panorâmica global.</li>
                  <li><strong>Gravidade Causal (Heatmap):</strong> Clique no botão <em>"Calor Ativo / Gravidade Causal"</em> no canto superior esquerdo do canvas para ativar a iluminação estocástica sobre nós de alto impacto histórico.</li>
                </ul>
              </div>

              {/* Keyboard Shortcuts & Gestures Card */}
              <div className="instruction-card">
                <div className="inst-header">
                  <span className="inst-step-num">ATALHOS & GESTOS</span>
                  <h4>Teclas Rápidas & Ergonomia Mobile</h4>
                </div>
                <div className="shortcuts-showcase-grid">
                  <div className="shortcut-box">
                    <div className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>Z</kbd></div>
                    <span className="shortcut-label">Desfazer última alteração causal</span>
                  </div>
                  <div className="shortcut-box">
                    <div className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>Y</kbd></div>
                    <span className="shortcut-label">Refazer alteração histórica</span>
                  </div>
                  <div className="shortcut-box">
                    <div className="shortcut-keys"><kbd>Espaço</kbd></div>
                    <span className="shortcut-label">Iniciar / Pausar Replay Temporal</span>
                  </div>
                  <div className="shortcut-box">
                    <div className="shortcut-keys"><kbd>M</kbd></div>
                    <span className="shortcut-label">Alternar Modo Didático / Técnico</span>
                  </div>
                  <div className="shortcut-box">
                    <div className="shortcut-keys"><kbd>Esc</kbd></div>
                    <span className="shortcut-label">Fechar qualquer janela / modal</span>
                  </div>
                  <div className="shortcut-box">
                    <div className="shortcut-keys"><kbd>Swipe</kbd> / <kbd>Toque</kbd></div>
                    <span className="shortcut-label">Navegação tátil fluida no mobile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MANIPULAÇÃO CAUSAL & EFEITO BORBOLETA */}
        {/* ========================================================================= */}
        {activeTab === 'causal_engine' && (
          <div className="guide-instruction-layout">
            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">PROCESSO 1</span>
                <h4>Como Inspecionar, Editar e Deletar um Evento Histórico</h4>
              </div>
              <p className="inst-desc">
                {isLaymanMode
                  ? 'Cada círculo no gráfico representa um momento crucial da humanidade. Ao mexer no passado, você aciona o Efeito Borboleta:'
                  : 'Cada nó representa uma singularidade temporal no grafo acíclico direcionado (DAG). Modificações disparam a propagação de ondas causais retroalimentadas.'}
              </p>
              <div className="step-by-step-box">
                <div className="step-sub-item">
                  <span className="sub-num">1</span>
                  <div>
                    <strong>Clique sobre qualquer nó no gráfico:</strong>
                    <p>Por exemplo, selecione <em>"Relatividade Geral (1915)"</em> ou <em>"Pouso na Lua (1969)"</em>. O painel lateral direito (Inspetor Causal) se abrirá instantaneamente com telemetria do evento.</p>
                  </div>
                </div>
                <div className="step-sub-item">
                  <span className="sub-num">2</span>
                  <div>
                    <strong>Analise a Ficha e Métricas do Evento:</strong>
                    <p>Verifique o ano cronológico, a categoria, os cones de luz e as fórmulas matemáticas que fundamentam aquele acontecimento.</p>
                  </div>
                </div>
                <div className="step-sub-item">
                  <span className="sub-num">3</span>
                  <div>
                    <strong>Acione Intervenções Causa-Efeito:</strong>
                    <ul>
                      <li><strong>Simular com IA:</strong> Calcula de imediato como a história mundial seria reescrita se este evento não tivesse ocorrido.</li>
                      <li><strong>Alterar Estado:</strong> Transforma o evento em estável, alternativo ou em risco de colapso.</li>
                      <li><strong>Apagar Evento:</strong> Exclui o acontecimento e abre o modal de Pré-visualização de Impacto Causal, exibindo quantas ramificações futuras serão deletadas.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">PROCESSO 2</span>
                <h4>Criação de Novos Acontecimentos (+ Nó) e Conexões</h4>
              </div>
              <div className="step-by-step-box">
                <div className="step-sub-item">
                  <span className="sub-num">1</span>
                  <div>
                    <strong>Clique no botão "+ Nó" na barra superior:</strong>
                    <p>Um modal holográfico abrirá o formulário de ancoragem de evento.</p>
                  </div>
                </div>
                <div className="step-sub-item">
                  <span className="sub-num">2</span>
                  <div>
                    <strong>Defina os Parâmetros Históricos:</strong>
                    <p>Insira o <em>Título do Evento</em>, o <em>Ano Cronológico</em> (ex: 2045) e a <em>Categoria</em> (Científico, Social, Tecnológico, Filosófico).</p>
                  </div>
                </div>
                <div className="step-sub-item">
                  <span className="sub-num">3</span>
                  <div>
                    <strong>Estabeleça as Relações de Causa:</strong>
                    <p>Selecione quais eventos passados tornaram esse novo fato possível. O motor verificará se não há violação de causalidade (retrocausalidade indesejada) e inserirá o nó perfeitamente conectado.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">PROCESSO 3</span>
                <h4>Viagens no Tempo, Sondas & Saltos Temporais</h4>
              </div>
              <div className="step-by-step-box">
                <div className="step-sub-item">
                  <span className="sub-num">1</span>
                  <div>
                    <strong>Cadastre um Observador no botão "+ Obs":</strong>
                    <p>Dê um nome para a sonda exploratória ou viajante (ex: <em>"Sonda Kepler-X"</em>) e defina o referencial temporal de partida.</p>
                  </div>
                </div>
                <div className="step-sub-item">
                  <span className="sub-num">2</span>
                  <div>
                    <strong>Clique no botão ciano "Intervenção":</strong>
                    <p>O console de dobra cronológica calculará as coordenadas mundiais de destino.</p>
                  </div>
                </div>
                <div className="step-sub-item">
                  <span className="sub-num">3</span>
                  <div>
                    <strong>Execute o Salto Temporal:</strong>
                    <p>O motor testará se a chegada da sonda ao passado gera Curvas Temporais Fechadas (CTCs) ou loops inconsistentes. Se houver paradoxo, o sistema indicará a probabilidade de estabilidade via Princípio de Novikov.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CARTOGRAFIA ESTELAR & VOO AEROESPACIAL */}
        {/* ========================================================================= */}
        {activeTab === 'aerospace_cartography' && (
          <div className="guide-instruction-layout">
            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">MÓDULO 1</span>
                <h4>Cartografia Estelar & Banco de Astrofísica Real</h4>
              </div>
              <p className="inst-desc">
                {isLaymanMode
                  ? 'Explore estrelas, planetas e buracos negros reais do nosso Universo com fotografias de sondas espaciais e dados da NASA e da ESA:'
                  : 'Mapeamento astrométrico de corpos celestes em coordenadas euclidianas e hiperesféricas com telemetria física calibrada por observatórios astronômicos.'}
              </p>
              <ul className="inst-action-list">
                <li><strong>5 Setores Catalogados:</strong> Alterne rapidamente entre Sistema Solar [SOL-01], Espaço Interestelar Local [LOC-02], Braço de Órion / Via Láctea [MW-03], Grupo Local de Galáxias [LOC-04] e Céu Profundo & Quasares [DEEP-05].</li>
                <li><strong>Painel de Telemetria com 6 Abas:</strong>
                  <ul>
                    <li><em>Visão Geral:</em> Dados dimensionais, massa, gravidade e velocidade de escape.</li>
                    <li><em>Fórmulas & Física:</em> Equações hidrostáticas, raio de Schwarzschild e temperatura efetiva de Hawking renderizadas em KaTeX.</li>
                    <li><em>Fotografias Reais:</em> Imagens de alta fidelidade capturadas por sondas como New Horizons, Cassini, Voyager 1 e James Webb.</li>
                    <li><em>Simulador 3D:</em> Visualização orbital tridimensional em tempo real com controle de rotação.</li>
                    <li><em>Dossiê Científico:</em> Histórico de descobertas e impactos astronômicos.</li>
                    <li><em>Geologia & Estrutura:</em> Camadas internas, composição do manto e núcleos planetários.</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">MÓDULO 2</span>
                <h4>Simulador de Voo Aeroespacial (Saturn V, DSKY & Re-entry)</h4>
              </div>
              <p className="inst-desc">
                {isLaymanMode
                  ? 'Assuma o comando da missão Apollo com instrumentos autênticos dos astronautas e física gravitacional real:'
                  : 'Propagador numérico de dinâmica orbital tipo Kerbal Space Program / Re-entry implementando equações de empuxo vetorial e reentrada atmosférica.'}
              </p>
              <div className="step-by-step-box">
                <div className="step-sub-item">
                  <span className="sub-num">1</span>
                  <div>
                    <strong>Computador DSKY (Apollo Guidance Computer):</strong>
                    <p>O painel numérico verde reproduz o sistema de bordo das missões lunares. Use as teclas <kbd>VERB</kbd> e <kbd>NOUN</kbd> para consultar velocidades de queima, altitude de apogeu e alinhamento inercial.</p>
                  </div>
                </div>
                <div className="step-sub-item">
                  <span className="sub-num">2</span>
                  <div>
                    <strong>Navball 3D com Vetores de Atitude:</strong>
                    <p>Monitore o horizonte artificial com indicadores de <em>Prograde</em> (direção do movimento) e <em>Retrograde</em> (direção de frenagem). Use para manobras de injeção translunar e desorbitação.</p>
                  </div>
                </div>
                <div className="step-sub-item">
                  <span className="sub-num">3</span>
                  <div>
                    <strong>Fórmula do Foguete de Tsiolkovsky:</strong>
                    <p>O simulador calcula o <MathFormula math="\Delta v" /> disponível em tempo real considerando impulso específico (<MathFormula math="I_{sp}" />) e consumo de massa de propelente.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: FERRAMENTAS AVANÇADAS & OBSERVATÓRIO NASA */}
        {/* ========================================================================= */}
        {activeTab === 'advanced_tools' && (
          <div className="guide-instruction-layout">
            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">ANÁLISE 1</span>
                <h4>Simulação de Monte Carlo & Recomendações Causa-Efeito</h4>
              </div>
              <p className="inst-desc">
                {isLaymanMode
                  ? 'Roda até 100.000 testes instantâneos para calcular o risco de conflitos na história e oferece um plano de ação para proteger o tempo:'
                  : 'Mecânica estatística de Metropolis-Ulam com perturbações gaussianas de Box-Muller, cálculo da Entropia de Shannon e expoente de Lyapunov causal.'}
              </p>
              <ul className="inst-action-list">
                <li><strong>Abas de Análise:</strong> Alterne entre <em>Distribuição Probabilística</em> (Estabilidade vs Ramificação vs Paradoxo), <em>Convergência</em> (curva de estabilização assintótica) e <em>Estabilização Prescritiva</em>.</li>
                <li><strong>Diagnósticos Prescritivos:</strong> O sistema detecta automaticamente se há ciclos temporais (CTCs), nós isolados ou hiperconectados e fornece sugestões diretas de intervenção para restaurar o equilíbrio de Novikov.</li>
              </ul>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">ANÁLISE 2</span>
                <h4>Observatório Cosmológico da NASA (Big Bang ao Big Freeze)</h4>
              </div>
              <p className="inst-desc">
                {isLaymanMode
                  ? 'Acesse os maiores arquivos científicos da NASA diretamente no topo da página Nosso Universo:'
                  : 'Compilado astrofísico baseado nas missões do Science Mission Directorate da NASA com parametrização do Modelo Lambda-CDM.'}
              </p>
              <ul className="inst-action-list">
                <li><strong>7 Grandes Épocas Cósmicas:</strong> Da Era de Planck (<MathFormula math="10^{-43}\text{ s}" />) e Inflação Cósmica até a Recombinação do CMB, Cosmic Dawn com o James Webb e a Era da Energia Escura.</li>
                <li><strong>5 Grandes Observatórios:</strong> Especificações e espelhos de JWST (L2), Hubble (LEO), Planck/WMAP (CMB), Chandra (Raios-X) e Voyager 1 (Espaço Interestelar a mais de 24 bilhões de km).</li>
                <li><strong>Alvos de Campo Profundo:</strong> Análise de SMACS 0723, Hubble Ultra Deep Field e do sistema exoplanetário de TRAPPIST-1.</li>
              </ul>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">ANÁLISE 3</span>
                <h4>Oráculo de IA Token-Otimizado (0 Tokens Consumidos)</h4>
              </div>
              <p className="inst-desc">
                {isLaymanMode
                  ? 'Converse com um assistente astrofísico que responde na hora e usa uma base interna rápida sem gastar seus créditos de internet ou IA:'
                  : 'Mecanismo híbrido com banco de dados factual embutido de alta densidade semântica para consulta local imediata e prompt engineering comprimido.'}
              </p>
              <ul className="inst-action-list">
                <li><strong>Resposta Instantânea Local (0 Tokens):</strong> Dúvidas comuns sobre o Paradoxo de Novikov, Cones de Luz, Dilatação Temporal de Einstein e Buracos Negros são respondidas em 0ms pela base científica interna.</li>
                <li><strong>Chips de Perguntas Rápidas:</strong> Clique nos botões sugeridos no rodapé do chat para obter insights físicos imediatos sobre a sua linha do tempo.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: DOSSIÊ TEÓRICO FORMAL (MODO RIGOROSO) */}
        {/* ========================================================================= */}
        {activeTab === 'theoretical_dossier' && (
          <div className="guide-instruction-layout">
            <div className="instruction-intro-card">
              <div className="inst-badge-row">
                <span className="inst-badge-primary">FUNDAMENTAÇÃO ACADÊMICA</span>
                <span className="inst-badge-tech">RELATIVIDADE GERAL & MECÂNICA ESTATÍSTICA</span>
              </div>
              <h3>Formalismo Matemático & Leis Físicas do Simulador</h3>
              <p>
                O Infinite Horizons não é uma obra de ficção arbitrária. Todos os algoritmos de integridade, propagação causal e cálculo gravitacional derivam diretamente de equações canônicas da física teórica moderna.
              </p>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">TEORIA 1</span>
                <h4>Equações de Campo de Einstein & Curvatura do Espaço-Tempo</h4>
              </div>
              <p className="inst-desc">
                A geometria do contínuo quadridimensional é curvada pela distribuição de matéria e energia, determinando a trajetória geodésica de todos os acontecimentos:
              </p>
              <div className="math-display-container">
                <MathFormula
                  math="G_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^4} T_{\mu\nu}"
                  block
                />
              </div>
              <ul className="inst-action-list">
                <li><MathFormula math="G_{\mu\nu} = R_{\mu\nu} - \frac{1}{2} R g_{\mu\nu}" />: Tensor de Einstein que quantifica a curvatura intrínseca da variedade Lorentziana.</li>
                <li><MathFormula math="\Lambda" />: Constante cosmológica associada à densidade de energia do vácuo quântico e à aceleração do Universo.</li>
                <li><MathFormula math="T_{\mu\nu}" />: Tensor de energia-momento representando o fluxo de massa, pressão e radiação.</li>
              </ul>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">TEORIA 2</span>
                <h4>Métrica de Minkowski & Causalidade dos Cones de Luz</h4>
              </div>
              <p className="inst-desc">
                A separação entre dois acontecimentos no espaço-tempo é quantificada pelo intervalo invariante pseudo-Riemanniano:
              </p>
              <div className="math-display-container">
                <MathFormula
                  math="ds^2 = g_{\mu\nu} dx^\mu dx^\nu = -c^2 dt^2 + dx^2 + dy^2 + dz^2"
                  block
                />
              </div>
              <ul className="inst-action-list">
                <li><strong>Intervalo Tipo-Tempo (<MathFormula math="ds^2 < 0" />):</strong> Conexão causal direta. Acontecimentos dentro do cone de luz onde a velocidade de transmissão é subluminar (<MathFormula math="v < c" />).</li>
                <li><strong>Intervalo Tipo-Luz (<MathFormula math="ds^2 = 0" />):</strong> Fronteira do horizonte de eventos percorrida por fótons e ondas gravitacionais (<MathFormula math="v = c" />).</li>
                <li><strong>Intervalo Tipo-Espaço (<MathFormula math="ds^2 > 0" />):</strong> Eventos causalmente desconectados. Nenhuma informação pode viajar entre eles sem violar a causalidade relativística.</li>
              </ul>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">TEORIA 3</span>
                <h4>Princípio de Autoconsistência de Novikov</h4>
              </div>
              <p className="inst-desc">
                Proposto pelo astrofísico russo Igor Dmitriyevich Novikov em 1990, estabelece que em variedades contendo Curvas Temporais Fechadas (CTCs), a probabilidade local de ocorrência de eventos autodestrutivos ou paradoxais é estritamente nula:
              </p>
              <div className="math-display-container">
                <MathFormula
                  math="P(\text{paradoxo}) = 0 \iff \sum_{\text{geodésicas}} S_{\text{clássica}} = \text{extremizada}"
                  block
                />
              </div>
              <p className="inst-desc">
                O motor do simulador implementa essa lei bloqueando ramificações impossíveis e forçando a convergência da história para soluções globalmente autoconsistentes.
              </p>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">TEORIA 4</span>
                <h4>Métrica de Kerr & Termodinâmica de Bekenstein-Hawking</h4>
              </div>
              <p className="inst-desc">
                Para corpos celestes de rotação extrema (como o buraco negro supermassivo Sagittarius A* e o pulsar do Caranguejo), o simulador calcula o horizonte e a radiação térmica:
              </p>
              <div className="math-display-container">
                <MathFormula
                  math="r_+ = \frac{GM}{c^2} + \sqrt{\left(\frac{GM}{c^2}\right)^2 - a^2}, \quad S_{BH} = \frac{k_B c^3 A}{4 G \hbar}"
                  block
                />
              </div>
              <ul className="inst-action-list">
                <li><MathFormula math="r_+" />: Raio do horizonte de eventos exterior de Kerr onde a velocidade de escape atinge a velocidade da luz.</li>
                <li><MathFormula math="a = J / Mc" />: Parâmetro de spin angular adimensional do corpo celeste em rotação.</li>
                <li><MathFormula math="S_{BH}" />: Entropia termodinâmica máxima proporcional à área bidimensional da superfície do horizonte.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Bottom Call to Action */}
        <section className="guide-footer-cta">
          <span className="cta-badge">EXPERIÊNCIA COMPLETA</span>
          <h2>Pronto para assumir o controle do Espaço-Tempo?</h2>
          <p>
            {isLaymanMode
              ? 'Abra o laboratório agora, crie acontecimentos, viaje para o passado e teste os limites da história.'
              : 'Inicialize a variedade Lorentziana e execute simulações determinísticas e estocásticas de alta precisão.'}
          </p>
          <div className="guide-cta-buttons">
            <button type="button" className="btn-guide-back-secondary" onClick={onBack}>
              Retornar ao Início
            </button>
            <button type="button" className="btn-guide-start-primary" onClick={onStartSimulator}>
              <span>Entrar no Simulador</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
