import { useLaymanMode } from '../context/LaymanModeContext';

export default function ConceptSection() {
  const { isLaymanMode } = useLaymanMode();

  return (
    <section id="concept-section" className="section concept-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">
            {isLaymanMode ? 'ENTENDENDO OS CONCEITOS' : 'FUNDAMENTAÇÃO CIENTÍFICA'}
          </span>
          <h2 className="section-title">
            {isLaymanMode
              ? 'Como o Espaço, o Tempo e a Matéria Realmente Funcionam'
              : 'A Física do Espaço-Tempo e a Causalidade Multidimensional'}
          </h2>
          <p className="section-subtitle">
            {isLaymanMode
              ? 'Entenda os princípios mais profundos da ciência moderna: como a massa deforma o espaço, por que o tempo desacelera e o que acontece nos limites do cosmos.'
              : 'O Infinite Horizons une relatividade geral, teoria das supercordas, mecânica quântica e termodinâmica em um motor de simulação rigoroso para investigar o que acontece quando alteramos as variáveis do cosmos.'}
          </p>
        </div>

        <div className="concept-grid">
          <div className="concept-card concept-card-main">
            <div className="concept-card-icon">{isLaymanMode ? 'ESTRUTURA DA MATÉRIA' : 'SUPERCORDAS'}</div>
            <h3>{isLaymanMode ? 'As Cordas que Compõem a Matéria' : 'Teoria das Supercordas & Teoria M'}</h3>
            <p>
              {isLaymanMode ? (
                <>
                  No nível mais profundo da natureza, os átomos não são esferas sólidas: são <strong>filamentos microscópicos de energia que vibram</strong>. Assim como cordas de violino produzem notas musicais diferentes conforme vibram, essas cordas cósmicas geram luz, elétrons ou a força da gravidade.
                </>
              ) : (
                <>
                  Partículas fundamentais são <strong>filamentos vibracionais unidimensionais</strong> na escala de Planck (~10⁻³⁵ m). As dimensões espaciais extras compactificadas em <strong>variedades de Calabi-Yau</strong> geram as leis de universos paralelos no String Landscape.
                </>
              )}
            </p>
            <div className="concept-card-glow" />
          </div>

          <div className="concept-card">
            <div className="concept-card-icon">{isLaymanMode ? 'CURVATURA DO ESPAÇO' : 'RELATIVIDADE'}</div>
            <h3>{isLaymanMode ? 'A Gravidade é a Deformação do Espaço' : 'Relatividade Geral & Cones de Luz'}</h3>
            <p>
              {isLaymanMode ? (
                <>
                  O espaço não é um vazio imóvel: é um <strong>tecido dinâmico que se deforma</strong> na presença de corpos pesados. O Sol afunda o espaço ao seu redor, e a Terra gira ao redor dele seguindo esse declive natural. Perto desse afundamento, <strong>o próprio tempo passa mais devagar</strong>.
                </>
              ) : (
                <>
                  A gravidade é a <strong>curvatura dinâmica do espaço-tempo</strong> quadridimensional. Nenhum efeito causal pode ultrapassar a velocidade da luz <em>c</em>, delimitando os cones de luz passado e futuro de cada evento.
                </>
              )}
            </p>
          </div>

          <div className="concept-card">
            <div className="concept-card-icon">{isLaymanMode ? 'MUNDO QUÂNTICO' : 'QUÂNTICA'}</div>
            <h3>{isLaymanMode ? 'O Multiverso e as Probabilidades' : 'Multiverso Quântico de Everett'}</h3>
            <p>
              {isLaymanMode ? (
                <>
                  Na física quântica das partículas subatômicas, um elétron pode estar em vários lugares ao mesmo tempo até ser medido. Segundo a teoria dos muitos mundos, <strong>cada possibilidade real se desdobra em um ramo separado da realidade</strong>, coexistindo em paralelo.
                </>
              ) : (
                <>
                  A <strong>decoerência quântica</strong> bifurca a função de onda universal a cada evento de medição, gerando ramificações dimensionais físicas reais onde todas as probabilidades alternativas coexistem.
                </>
              )}
            </p>
          </div>

          <div className="concept-card">
            <div className="concept-card-icon">{isLaymanMode ? 'CAUSALIDADE' : 'AUTOCONSISTÊNCIA'}</div>
            <h3>{isLaymanMode ? 'A Lei Contra Contradições no Tempo' : 'Autoconsistência de Novikov'}</h3>
            <p>
              {isLaymanMode ? (
                <>
                  As leis da física são matematicamente consistentes: se um caminho no tempo permitisse voltar ao passado, <strong>apenas acontecimentos que não geram contradições lógicas podem ocorrer</strong>. O universo impede que uma causa destrua o seu próprio motivo de existir.
                </>
              ) : (
                <>
                  A <strong>2ª Lei da Termodinâmica</strong> e o princípio de Novikov garantem que o continuum proíbe paradoxos que gerem probabilidade zero, forçando a reestabilização ou a cisão em novas dimensões.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Visual causal chain demo */}
        <div className="concept-chain">
          <div className="concept-chain-title">
            {isLaymanMode
              ? 'Como Funciona a Cadeia de Causa e Efeito no Tempo'
              : 'Dinâmica Causal no Espaço-Tempo: Da Geodésica ao Paradoxo'}
          </div>
          <div className="concept-chain-flow">
            <div className="chain-node chain-node-stable">
              <span className="chain-node-label">{isLaymanMode ? 'Linha do Tempo Original' : 'Equações de Einstein (1915)'}</span>
              <span className="chain-node-status">{isLaymanMode ? 'PRESENTE ESTÁVEL' : 'ÂNCORA METROLÓGICA'}</span>
            </div>
            <div className="chain-arrow">
              <svg width="40" height="20" viewBox="0 0 40 20">
                <line x1="0" y1="10" x2="32" y2="10" stroke="rgba(0,212,255,0.4)" strokeWidth="2" />
                <polygon points="32,5 40,10 32,15" fill="rgba(0,212,255,0.6)" />
              </svg>
              <span className="chain-arrow-label">{isLaymanMode ? 'ATALHO NO ESPAÇO' : 'GEODÉSICA CAUSAL'}</span>
            </div>
            <div className="chain-node chain-node-altered">
              <span className="chain-node-label">{isLaymanMode ? 'Intervenção no Passado' : 'Pontes ER = EPR (1935)'}</span>
              <span className="chain-node-status">{isLaymanMode ? 'MUDANÇA DE ESTADO' : 'EMARANHAMENTO'}</span>
            </div>
            <div className="chain-arrow">
              <svg width="40" height="20" viewBox="0 0 40 20">
                <line x1="0" y1="10" x2="32" y2="10" stroke="rgba(251,191,36,0.4)" strokeWidth="2" />
                <polygon points="32,5 40,10 32,15" fill="rgba(251,191,36,0.6)" />
              </svg>
              <span className="chain-arrow-label">{isLaymanMode ? 'CONSEQUÊNCIA EM CADEIA' : 'TEORIA M (11D)'}</span>
            </div>
            <div className="chain-node chain-node-unstable">
              <span className="chain-node-label">{isLaymanMode ? 'Tensão Temporal' : 'Perturbação Causal'}</span>
              <span className="chain-node-status">{isLaymanMode ? 'CONTRADIÇÃO POTENCIAL' : 'FLUTUAÇÃO QUÂNTICA'}</span>
            </div>
            <div className="chain-arrow">
              <svg width="40" height="20" viewBox="0 0 40 20">
                <line x1="0" y1="10" x2="32" y2="10" stroke="rgba(239,68,68,0.4)" strokeWidth="2" />
                <polygon points="32,5 40,10 32,15" fill="rgba(239,68,68,0.6)" />
              </svg>
              <span className="chain-arrow-label">{isLaymanMode ? 'AUTO-EQUILÍBRIO' : 'CENSURA HAWKING'}</span>
            </div>
            <div className="chain-node chain-node-paradox">
              <span className="chain-node-label">{isLaymanMode ? 'Novo Futuro Consistente' : 'Colapso de Novikov'}</span>
              <span className="chain-node-status">{isLaymanMode ? 'REALIDADE REAJUSTADA' : 'CURVA TEMPO FECHADA'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
