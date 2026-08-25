export default function ConceptSection() {
  return (
    <section id="concept-section" className="section concept-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">CONCEITO</span>
          <h2 className="section-title">O que é o Painel do Paradoxo Temporal?</h2>
          <p className="section-subtitle">
            Uma aplicação web interativa que transforma diagramas temporais 
            em sistemas computacionais simuláveis.
          </p>
        </div>

        <div className="concept-grid">
          <div className="concept-card concept-card-main">
            <div className="concept-card-icon">🌌</div>
            <h3>Mais que um diagrama</h3>
            <p>
              Ferramentas comuns permitem desenhar acontecimentos, mas não possuem 
              um mecanismo de causalidade que reaja automaticamente às alterações. 
              O Painel transforma o diagrama em um <strong>sistema computacional simulável</strong>.
            </p>
            <div className="concept-card-glow" />
          </div>

          <div className="concept-card">
            <div className="concept-card-icon">🔗</div>
            <h3>Causalidade viva</h3>
            <p>
              Eventos conectados por relações causais. Alterar um evento propaga 
              consequências por toda a cadeia temporal.
            </p>
          </div>

          <div className="concept-card">
            <div className="concept-card-icon">🕳️</div>
            <h3>Múltiplas dimensões</h3>
            <p>
              Cada dimensão possui sua própria estrutura temporal. 
              Viajantes podem cruzar dimensões, compartilhando ou divergindo eventos.
            </p>
          </div>

          <div className="concept-card">
            <div className="concept-card-icon">⚠️</div>
            <h3>Paradoxos emergentes</h3>
            <p>
              O sistema detecta automaticamente paradoxos: do Avô, Bootstrap, 
              Predestinação, loops causais e contradições temporais.
            </p>
          </div>
        </div>

        {/* Visual causal chain demo */}
        <div className="concept-chain">
          <div className="concept-chain-title">Cadeia Causal — Exemplo</div>
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
