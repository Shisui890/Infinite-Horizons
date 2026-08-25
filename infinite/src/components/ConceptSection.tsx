export default function ConceptSection() {
  return (
    <section id="concept-section" className="section concept-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">CONCEITO</span>
          <h2 className="section-title">Uma bancada para realidades impossíveis.</h2>
          <p className="section-subtitle">
            Um espaço para investigar relações de causa e efeito, com visualização
            imediata do que muda quando uma hipótese é alterada.
          </p>
        </div>

        <div className="concept-grid">
          <div className="concept-card concept-card-main">
            <div className="concept-card-icon">CAMPO</div>
            <h3>Mais que um diagrama</h3>
            <p>
              Não é apenas um diagrama. Cada evento tem relações, peso e consequências.
              O sistema transforma sua hipótese em um <strong>experimento temporal simulável</strong>.
            </p>
            <div className="concept-card-glow" />
          </div>

          <div className="concept-card">
            <div className="concept-card-icon">FLUXO</div>
            <h3>Causalidade viva</h3>
            <p>
              Conecte causas e consequências. Ao mudar um ponto, veja a propagação
              percorrer toda a cadeia em tempo real.
            </p>
          </div>

          <div className="concept-card">
            <div className="concept-card-icon">EIXOS</div>
            <h3>Múltiplas dimensões</h3>
            <p>
              Compare linhas alternativas, crie ramificações e acompanhe o que permanece
              igual ou diverge entre realidades.
            </p>
          </div>

          <div className="concept-card">
            <div className="concept-card-icon">RISCO</div>
            <h3>Paradoxos emergentes</h3>
            <p>
              O sistema sinaliza loops, contradições e eventos em risco antes que a
              instabilidade se espalhe pela linha.
            </p>
          </div>
        </div>

        {/* Visual causal chain demo */}
        <div className="concept-chain">
          <div className="concept-chain-title">Uma alteração, quatro consequências</div>
          <div className="concept-chain-flow">
            <div className="chain-node chain-node-stable">
              <span className="chain-node-label">Evento A</span>
              <span className="chain-node-status">ESTÁVEL</span>
            </div>
            <div className="chain-arrow">
              <svg width="40" height="20" viewBox="0 0 40 20">
                <line x1="0" y1="10" x2="32" y2="10" stroke="rgba(0,212,255,0.4)" strokeWidth="2" />
                <polygon points="32,5 40,10 32,15" fill="rgba(0,212,255,0.6)" />
              </svg>
              <span className="chain-arrow-label">CAUSES</span>
            </div>
            <div className="chain-node chain-node-altered">
              <span className="chain-node-label">Evento B</span>
              <span className="chain-node-status">ALTERADO</span>
            </div>
            <div className="chain-arrow">
              <svg width="40" height="20" viewBox="0 0 40 20">
                <line x1="0" y1="10" x2="32" y2="10" stroke="rgba(251,191,36,0.4)" strokeWidth="2" />
                <polygon points="32,5 40,10 32,15" fill="rgba(251,191,36,0.6)" />
              </svg>
              <span className="chain-arrow-label">ENABLES</span>
            </div>
            <div className="chain-node chain-node-unstable">
              <span className="chain-node-label">Evento C</span>
              <span className="chain-node-status">INSTÁVEL</span>
            </div>
            <div className="chain-arrow">
              <svg width="40" height="20" viewBox="0 0 40 20">
                <line x1="0" y1="10" x2="32" y2="10" stroke="rgba(239,68,68,0.4)" strokeWidth="2" />
                <polygon points="32,5 40,10 32,15" fill="rgba(239,68,68,0.6)" />
              </svg>
              <span className="chain-arrow-label">CONTRADICTS</span>
            </div>
            <div className="chain-node chain-node-paradox">
              <span className="chain-node-label">Evento D</span>
              <span className="chain-node-status">PARADOXO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
