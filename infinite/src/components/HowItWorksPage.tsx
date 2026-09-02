import { useState } from 'react';
import { useLaymanMode } from '../context/LaymanModeContext';

interface Props {
  onBack: () => void;
  onStartSimulator: () => void;
}

export default function HowItWorksPage({ onBack, onStartSimulator }: Props) {
  const { isLaymanMode, toggleLaymanMode } = useLaymanMode();
  const [activeTab, setActiveTab] = useState<'quickstart' | 'actions' | 'tools' | 'timeline_export'>('quickstart');

  return (
    <div className="how-it-works-page">
      {/* Background Lighting */}
      <div className="guide-ambient-glow" />

      {/* Top Floating Navigation */}
      <header className="guide-navbar">
        <div className="guide-nav-content">
          <button type="button" className="btn-guide-back" onClick={onBack}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Retornar ao Início</span>
          </button>

          <div className="guide-brand">
            <span className="guide-brand-dot" />
            <span className="guide-brand-title">INFINITE<strong>HORIZONS</strong></span>
            <span className="guide-brand-badge">MANUAL DE INSTRUÇÕES</span>
          </div>

          <div className="guide-nav-actions">
            <button
              type="button"
              className={`btn-mode-toggle ${isLaymanMode ? 'mode-layman' : 'mode-academic'}`}
              onClick={toggleLaymanMode}
              title="Alternar Modo de Exibição"
            >
              <span className="mode-toggle-dot" />
              <span>{isLaymanMode ? 'Modo Didático' : 'Modo Rigoroso'}</span>
            </button>

            <button type="button" className="btn-cta-sim" onClick={onStartSimulator}>
              <span>Abrir o Simulador</span>
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
            GUIA PRÁTICO DE USO
          </div>
          <h1 className="guide-hero-title">
            Como Usar o <span className="text-gradient-cyan">Simulador</span>
          </h1>
          <p className="guide-hero-desc">
            Aprenda passo a passo onde clicar, como manipular a linha do tempo, alterar acontecimentos históricos, viajar no tempo e usar todas as ferramentas do laboratório.
          </p>

          {/* Tab Filter Navigation */}
          <div className="guide-tabs-bar">
            <button
              type="button"
              className={`guide-tab-btn ${activeTab === 'quickstart' ? 'active' : ''}`}
              onClick={() => setActiveTab('quickstart')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>1. Primeiros Passos na Tela</span>
            </button>
            <button
              type="button"
              className={`guide-tab-btn ${activeTab === 'actions' ? 'active' : ''}`}
              onClick={() => setActiveTab('actions')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>2. Como Alterar e Criar Eventos</span>
            </button>
            <button
              type="button"
              className={`guide-tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
              onClick={() => setActiveTab('tools')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span>3. Ferramentas da Barra Superior</span>
            </button>
            <button
              type="button"
              className={`guide-tab-btn ${activeTab === 'timeline_export' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline_export')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>4. Linha do Tempo, Replay & Exportação</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="guide-body-container">
        {/* TAB 1: PRIMEIROS PASSOS */}
        {activeTab === 'quickstart' && (
          <div className="guide-instruction-layout">
            <div className="instruction-intro-card">
              <h3>Estrutura da Tela do Simulador</h3>
              <p>Ao abrir o simulador, a tela é dividida em 4 áreas principais:</p>
              <div className="screen-areas-grid">
                <div className="screen-area-item">
                  <span className="area-badge">TOPO</span>
                  <strong>Barra Superior de Controle</strong>
                  <span>Onde ficam os botões de ações (+ Nó, + Obs, Intervenção), ferramentas (Comparador, 3D, IA) e opções de exportação/compartilhamento.</span>
                </div>
                <div className="screen-area-item">
                  <span className="area-badge">ESQUERDA</span>
                  <strong>Menu Lateral de Dimensões</strong>
                  <span>Lista as linhas do tempo existentes (ex: Continuum Principal, Variedades Quânticas) e os observadores/viajantes registrados.</span>
                </div>
                <div className="screen-area-item">
                  <span className="area-badge">CENTRO</span>
                  <strong>Canvas Interativo da Linha do Tempo</strong>
                  <span>Mostra o gráfico com todos os acontecimentos históricos em círculos brilhantes conectados por linhas de causa e efeito.</span>
                </div>
                <div className="screen-area-item">
                  <span className="area-badge">RODAPÉ</span>
                  <strong>Controle de Tempo e Paradoxos</strong>
                  <span>Barra deslizante de anos com botões de Replay (Play/Pause) e o console de telemetria expansível na parte inferior.</span>
                </div>
              </div>
            </div>

            <div className="guide-steps-vertical">
              <div className="instruction-card">
                <div className="inst-header">
                  <span className="inst-step-num">PASSO 1</span>
                  <h4>Como se Mover e Interagir no Gráfico Central</h4>
                </div>
                <ul className="inst-action-list">
                  <li><strong>Arrastar nós individuais:</strong> Clique em cima de qualquer círculo de evento e arraste o mouse para mover o evento para onde quiser na tela.</li>
                  <li><strong>Mover a tela inteira (Pan):</strong> Clique em qualquer parte vazia do fundo escuro e arraste o mouse para navegar ao longo da linha do tempo.</li>
                  <li><strong>Aumentar e Diminuir Zoom:</strong> Use a roda do mouse (scroll) para aproximar ou afastar a visão dos eventos.</li>
                  <li><strong>Ativar o Mapa de Calor (Gravidade Causal):</strong> Clique no botão <em>"Calor Ativo / Gravidade Causal"</em> no canto superior esquerdo do canvas para acender os halos de luz dos eventos com maior número de conexões.</li>
                </ul>
              </div>

              <div className="instruction-card">
                <div className="inst-header">
                  <span className="inst-step-num">PASSO 2</span>
                  <h4>Como Selecionar e Alternar Linhas do Tempo (Dimensões)</h4>
                </div>
                <ul className="inst-action-list">
                  <li>No menu lateral esquerdo, você verá caixas com as dimensões ativas (como <code>Ω-01</code> e <code>Ω-02</code>).</li>
                  <li><strong>Clique em qualquer caixa</strong> para mudar imediatamente a visualização do gráfico para os eventos daquela dimensão.</li>
                  <li><strong>Criar Nova Dimensão:</strong> Clique no botão <code>+ Nova</code> no topo do menu lateral para criar uma linha temporal paralela personalizada com o nome e cor que desejar.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AÇÕES E INTERVENÇÕES PRÁTICAS */}
        {activeTab === 'actions' && (
          <div className="guide-instruction-layout">
            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">AÇÃO 1</span>
                <h4>Como Inspecionar e Mudar a História de um Evento</h4>
              </div>
              <p className="inst-desc">Ao alterar ou apagar um evento do passado, o simulador recalcula automaticamente o que aconteceria no futuro:</p>
              <div className="step-by-step-box">
                <div className="step-sub-item">
                  <span className="sub-num">1</span>
                  <div>
                    <strong>Clique em cima de um círculo no gráfico</strong>
                    <p>Por exemplo, clique no nó <em>"Relatividade Geral (1915)"</em> ou <em>"Fissão Nuclear (1938)"</em>. Um painel detalhado se abrirá no lado direito da tela.</p>
                  </div>
                </div>
                <div className="step-sub-item">
                  <span className="sub-num">2</span>
                  <div>
                    <strong>Explore as opções no Painel Direito:</strong>
                    <p>Você verá a descrição histórica, ano, importância e fórmulas matemáticas do evento.</p>
                  </div>
                </div>
                <div className="step-sub-item">
                  <span className="sub-num">3</span>
                  <div>
                    <strong>Execute uma Ação:</strong>
                    <ul>
                      <li><strong>Simular com IA:</strong> Calcula o impacto e o Efeito Borboleta caso esse evento seja alterado.</li>
                      <li><strong>Alterar Estado:</strong> Muda o status do nó para modificado ou alternativo.</li>
                      <li><strong>Apagar Evento:</strong> Apaga o acontecimento da história e abre a janela de pré-visualização de impacto para confirmar.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">AÇÃO 2</span>
                <h4>Como Adicionar um Novo Acontecimento (+ Nó)</h4>
              </div>
              <div className="step-by-step-box">
                <div className="step-sub-item">
                  <span className="sub-num">1</span>
                  <div>
                    <strong>Clique no botão "+ Nó" na barra superior.</strong>
                    <p>Uma janela pop-up será exibida com o formulário de cadastro de evento.</p>
                  </div>
                </div>
                <div className="step-sub-item">
                  <span className="sub-num">2</span>
                  <div>
                    <strong>Preencha os dados:</strong>
                    <p>Digite o <em>Título</em>, o <em>Ano</em> (ex: 1969), a <em>Categoria</em> (Científico, Social, Tecnológico) e selecione quais eventos anteriores foram a causa desse novo acontecimento.</p>
                  </div>
                </div>
                <div className="step-sub-item">
                  <span className="sub-num">3</span>
                  <div>
                    <strong>Clique em "Adicionar ao Espaço-Tempo":</strong>
                    <p>O nó aparecerá imediatamente conectado no gráfico e posicionado no ano correto.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">AÇÃO 3</span>
                <h4>Como Fazer uma Viagem no Tempo (Intervenção)</h4>
              </div>
              <div className="step-by-step-box">
                <div className="step-sub-item">
                  <span className="sub-num">1</span>
                  <div>
                    <strong>Primeiro, crie um observador no botão "+ Obs" (se ainda não tiver um):</strong>
                    <p>Dê um nome para a sonda ou viajante (ex: <em>"Sonda Alpha"</em>) e defina o ano de origem.</p>
                  </div>
                </div>
                <div className="step-sub-item">
                  <span className="sub-num">2</span>
                  <div>
                    <strong>Clique no botão ciano "Intervenção" no topo da tela:</strong>
                    <p>A janela de Salto Temporal se abrirá.</p>
                  </div>
                </div>
                <div className="step-sub-item">
                  <span className="sub-num">3</span>
                  <div>
                    <strong>Escolha o viajante e o ano de destino:</strong>
                    <p>Selecione para qual ano no passado ou futuro você quer enviar a sonda e clique em <em>"Executar Salto Temporal"</em>. O simulador atualizará o referencial e testará se a viagem cria algum paradoxo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FERRAMENTAS DA BARRA SUPERIOR */}
        {activeTab === 'tools' && (
          <div className="guide-instruction-layout">
            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">FERRAMENTA 1</span>
                <h4>Comparador de Dimensões em Split-View</h4>
              </div>
              <p className="inst-desc">Permite comparar duas linhas do tempo lado a lado na mesma tela:</p>
              <ul className="inst-action-list">
                <li><strong>Onde clicar:</strong> Clique no botão <em>"Comparador"</em> na barra superior.</li>
                <li><strong>Como usar:</strong> Selecione a <em>Dimensão A</em> no menu esquerdo e a <em>Dimensão B</em> no menu direito. O sistema calcula a Taxa de Divergência (%) comparando as diferenças.</li>
                <li><strong>Fundir Dimensões:</strong> Clique no botão verde <em>"Fundir em Dimensão Reconciliada"</em> no rodapé do modal para juntar os acontecimentos de ambas em uma nova dimensão chamada <code>Ω-FUSION</code>.</li>
              </ul>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">FERRAMENTA 2</span>
                <h4>Simulação de Monte Carlo</h4>
              </div>
              <p className="inst-desc">Testa milhares de cenários probabilísticos para avaliar se o universo é estável:</p>
              <ul className="inst-action-list">
                <li><strong>Onde clicar:</strong> Clique no botão <em>"Monte Carlo"</em> na barra superior.</li>
                <li><strong>Como usar:</strong> Escolha a quantidade de iterações (500 a 5.000 iterações) e clique em <em>"Iniciar Simulação Estocástica"</em>.</li>
                <li><strong>Resultado:</strong> Você verá gráficos de densidade probabilística e a porcentagem de risco de colapso temporal.</li>
              </ul>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">FERRAMENTA 3</span>
                <h4>Oráculo de IA e Co-piloto Físico</h4>
              </div>
              <p className="inst-desc">Um assistente inteligente integrado para tirar dúvidas e analisar acontecimentos:</p>
              <ul className="inst-action-list">
                <li><strong>Onde clicar:</strong> Clique no botão <em>"Oráculo IA"</em> na barra superior.</li>
                <li><strong>Como usar:</strong> Uma gaveta lateral se abrirá. Clique na aba <em>"Co-piloto Físico"</em> para conversar em linguagem natural com respostas digitadas em tempo real.</li>
                <li><strong>Perguntas Rápidas:</strong> Clique nos botões de sugestão rápida (ex: <em>"Cones de Luz"</em>, <em>"Riscos de Novikov"</em>) para obter análises instantâneas sobre o seu universo.</li>
              </ul>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">FERRAMENTA 4</span>
                <h4>Visualizador 3D de Cones de Luz e Modo Apresentação</h4>
              </div>
              <ul className="inst-action-list">
                <li><strong>Cones 3D:</strong> Clique no botão <em>"Cones 3D"</em> para abrir a renderização espacial tridimensional. Clique e arraste com o mouse para girar a câmera em 360 graus.</li>
                <li><strong>Slides / Apresentação:</strong> Clique no botão <em>"Slides"</em> para entrar no modo apresentação em tela cheia, ideal para visualizar a linha do tempo evento por evento.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: LINHA DO TEMPO, REPLAY E EXPORTAÇÃO */}
        {activeTab === 'timeline_export' && (
          <div className="guide-instruction-layout">
            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">CONTROLE 1</span>
                <h4>Como Controlar a Linha do Tempo (Time Scrubber & Replay)</h4>
              </div>
              <p className="inst-desc">Controle o avanço cronológico da história ano a ano:</p>
              <ul className="inst-action-list">
                <li><strong>Barra Deslizante (Slider):</strong> No rodapé da tela, arraste o cursor da barra de anos para trás ou para frente para ver os nós surgirem na ordem exata em que aconteceram.</li>
                <li><strong>Botão Play/Pause:</strong> Clique no botão <em>Play</em> para ver a história se desenrolar automaticamente em animação contínua.</li>
                <li><strong>Velocidade:</strong> Clique nos botões <em>1x</em>, <em>2x</em> ou <em>5x</em> para acelerar o replay.</li>
              </ul>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">CONTROLE 2</span>
                <h4>Como Desfazer e Refazer Alterações (Undo / Redo)</h4>
              </div>
              <p className="inst-desc">Fez uma alteração indesejada? Você pode voltar no tempo facilmente:</p>
              <ul className="inst-action-list">
                <li><strong>Botões no Topo:</strong> Use os botões com ícones de seta curva <code>↺ (Desfazer)</code> e <code>↻ (Refazer)</code> na barra de utilitários superior.</li>
                <li><strong>Atalhos de Teclado:</strong> Pressione <code>Ctrl + Z</code> para desfazer a última ação ou <code>Ctrl + Y</code> (ou <code>Ctrl + Shift + Z</code>) para refazer.</li>
                <li><strong>Botão Reset:</strong> Clique em <em>"Reset"</em> para restaurar o modelo inicial padrão a qualquer momento.</li>
              </ul>
            </div>

            <div className="instruction-card">
              <div className="inst-header">
                <span className="inst-step-num">CONTROLE 3</span>
                <h4>Como Compartilhar seu Universo e Exportar Dados</h4>
              </div>
              <div className="step-by-step-box">
                <div className="step-sub-item">
                  <span className="sub-num">1</span>
                  <div>
                    <strong>Compartilhamento por Link Direto:</strong>
                    <p>Clique no botão <em>"Link"</em> na barra superior. O sistema copia automaticamente uma URL com todo o seu universo codificado. Envie o link para qualquer pessoa para que ela abra exatamente o seu universo no navegador dela.</p>
                  </div>
                </div>
                <div className="step-sub-item">
                  <span className="sub-num">2</span>
                  <div>
                    <strong>Menu de Exportação:</strong>
                    <p>Clique no menu seletor <em>"Exportar"</em> no canto superior direito e escolha o formato:</p>
                    <ul>
                      <li><strong>Imagem Poster 4K (PNG):</strong> Baixa uma foto em altíssima resolução do gráfico da linha do tempo.</li>
                      <li><strong>JSON:</strong> Baixa o arquivo completo com todos os dados e dimensões.</li>
                      <li><strong>CSV:</strong> Exporta a lista de eventos em formato de tabela para Excel.</li>
                      <li><strong>LaTeX (.tex) & BibTeX:</strong> Gera o código acadêmico formatado para artigos e citações científicas.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Call to Action */}
        <section className="guide-footer-cta">
          <span className="cta-badge">PRÁTICA NO LABORATÓRIO</span>
          <h2>Tudo pronto para usar o simulador?</h2>
          <p>Coloque em prática agora mesmo: crie acontecimentos, teste intervenções no passado e veja a linha do tempo se transformar.</p>
          <div className="guide-cta-buttons">
            <button type="button" className="btn-guide-back-secondary" onClick={onBack}>
              Retornar ao Início
            </button>
            <button type="button" className="btn-guide-start-primary" onClick={onStartSimulator}>
              <span>Entrar no Simulador Agora</span>
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
