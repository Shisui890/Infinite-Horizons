interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const shortcutSections = [
    {
      title: 'CONTROLE DA LINHA DO TEMPO',
      shortcuts: [
        { key: 'Espaço', desc: 'Reproduzir ou pausar o avanço contínuo do tempo' },
        { key: '←  /  →', desc: 'Avançar ou retroceder a coordenada temporal em 5 anos' },
        { key: 'Shift + ← / →', desc: 'Avançar ou retroceder com precisão fina de 1 ano' },
        { key: 'H', desc: 'Alternar mapa de calor de densidade causal' },
      ],
    },
    {
      title: 'PAINÉIS & FERRAMENTAS CIENTÍFICAS',
      shortcuts: [
        { key: 'O', desc: 'Abrir ou fechar o Crono-Oráculo de IA e Física Teórica' },
        { key: 'C', desc: 'Abrir o Comparador e Fusão de Variedades Dimensionais' },
        { key: 'M', desc: 'Executar simulação probabilística de Monte Carlo' },
        { key: 'L', desc: 'Alternar entre Modo Didático (Leigo) e Rigoroso (Acadêmico)' },
      ],
    },
    {
      title: 'NAVEGAÇÃO DO SIMULADOR',
      shortcuts: [
        { key: 'Esc', desc: 'Fechar qualquer modal ativo, inspetor ou gaveta' },
        { key: '?', desc: 'Abrir ou fechar este guia de atalhos de teclado' },
      ],
    },
  ];

  return (
    <div className="sim-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="sim-modal-content shortcuts-modal" onClick={e => e.stopPropagation()}>
        <div className="sim-modal-header">
          <div className="mc-header-info">
            <span className="mc-badge">SISTEMA DE CONTROLE RÁPIDO</span>
            <div className="mc-title-row">
              <h2 className="mc-title">Atalhos de Teclado do Laboratório</h2>
              <span className="shortcuts-count-pill">9 ATALHOS ATIVOS</span>
            </div>
          </div>
          <button type="button" className="sim-btn-close" onClick={onClose} aria-label="Fechar Guia">
            ✕
          </button>
        </div>

        <div className="shortcuts-modal-body">
          <p className="shortcuts-intro-desc">
            Navegue pelo continuum espaço-temporal e acione instrumentos avançados com agilidade sem tirar as mãos do teclado.
          </p>

          <div className="shortcuts-grid">
            {shortcutSections.map(section => (
              <div key={section.title} className="shortcuts-section-card">
                <span className="shortcuts-sec-title">{section.title}</span>
                <div className="shortcuts-list">
                  {section.shortcuts.map(sc => (
                    <div key={sc.key} className="shortcut-row">
                      <kbd className="shortcut-keycap">{sc.key}</kbd>
                      <span className="shortcut-desc">{sc.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="shortcuts-modal-footer">
          <span className="shortcuts-tip">
            DICA: Você pode pressionar <kbd className="mini-kbd">?</kbd> a qualquer momento para abrir este painel.
          </span>
          <button type="button" className="btn-modal-primary" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
