import { useState } from 'react';
import { useLaymanMode } from '../../context/LaymanModeContext';
import { formatHistoricalYear } from '../../utils/formatters';

interface Props {
  onClose: () => void;
  eventYear?: number;
  eventTitle?: string;
}

interface NewspaperArticle {
  masthead: string;
  location: string;
  editionDate: string;
  priceTag: string;
  headlineReal: string;
  subheadlineReal: string;
  leadArticleReal: string;
  columnistQuoteReal: string;
  headlineCounterfactual: string;
  subheadlineCounterfactual: string;
  leadArticleCounterfactual: string;
  columnistQuoteCounterfactual: string;
  woodcutCaption: string;
  archivalStamp: string;
  academicHistoriographyNote: string;
  primaryArchiveSource: string;
}

const NEWSPAPERS: Record<number, NewspaperArticle> = {
  1865: {
    masthead: 'THE LONDON DAILY CHRONOGRAPH',
    location: 'Londres, Reino Unido',
    editionDate: 'Sexta-feira, 27 de Outubro de 1865',
    priceTag: 'Preço: 2 Pence',
    headlineReal: 'A LUZ É ELETRICIDADE! PROF. MAXWELL APRESENTA EQUAÇÕES QUE UNIFICAM O UNIVERSO',
    subheadlineReal: 'A Real Sociedade de Londres recebe o tratado formal sobre o campo eletromagnético dinâmico.',
    leadArticleReal: 'Em uma assembleia extraordinária nos salões da Royal Society, o eminente filósofo natural escocês James Clerk Maxwell apresentou hoje as deduções que alteram para sempre nossa compreensão do cosmos. Através de um sistema harmonioso de equações diferenciais, o professor demonstrou que as ondulações magnéticas e elétricas viajam exatamente à mesma velocidade que a luz, revelando que a própria luminosidade que ilumina o mundo é uma perturbação eletromagnética.',
    columnistQuoteReal: '"Estamos diante da maior síntese científica desde os Principia de Sir Isaac Newton." — Michael Faraday, Royal Institution.',
    headlineCounterfactual: 'ROYAL SOCIETY REJEITA ONDAS DE MAXWELL; CIENTISTAS MANTÊM FORÇAS DE AÇÃO À DISTÂNCIA',
    subheadlineCounterfactual: 'Tratado sobre campos invisíveis é considerado abstração matemática sem base prática nos laboratórios.',
    leadArticleCounterfactual: 'Os comitês conservadores da Real Sociedade rejeitaram hoje as proposições teóricas apresentadas pelo Prof. Maxwell. A bancada dos físicos britânicos argumentou que supor que a eletricidade se propaga como ondas no espaço vazio contradiz as regras mecânicas de Newton. A indústria telegráfica continuará operando exclusivamente sob as leis de fluidos de Weber, sem qualquer menção a ondas no éter.',
    columnistQuoteCounterfactual: '"A insistência em campos invisíveis desvia a física prática das máquinas a vapor para especulações vazias." — Painel Consultivo Britânico.',
    woodcutCaption: 'Gravura da Royal Society: Demonstração das linhas de força e bobinas de indução.',
    archivalStamp: 'ARQUIVO NACIONAL BRITÂNICO // DOCUMENTO AUDITADO 1865-EM',
    academicHistoriographyNote: 'A aceitação das equações de Maxwell enfrentou forte resistência da escola mecanicista de Cambridge até que Heinrich Hertz gerou ondas de rádio em centelhador experimental em 1887.',
    primaryArchiveSource: 'Maxwell, J. C. (1865). A Dynamical Theory of the Electromagnetic Field. Phil. Trans. R. Soc. Lond. 155: 459–512.',
  },
  1905: {
    masthead: 'GAZETTE SCIENTIFIQUE DE PARIS & ANNALEN',
    location: 'Berna / Paris / Berlim',
    editionDate: 'Quinta-feira, 28 de Setembro de 1905',
    priceTag: 'Preço: 15 Cêntimos',
    headlineReal: 'O TEMPO NÃO É ABSOLUTO: JOVEM FÍSICO DE BERNA ABALA OS PILARES DE NEWTON',
    subheadlineReal: 'Albert Einstein publica o princípio da relatividade e prova que a velocidade da luz é um limite intransponível.',
    leadArticleReal: 'A prestigiosa revista científica Annalen der Physik acaba de publicar o manuscrito "Sobre a Eletrodinâmica dos Corpos em Movimento", de autoria do jovem examinador de patentes Albert Einstein. O artigo propõe uma revolução radical: o tempo corre em ritmos diferentes para observadores em movimento e nada no cosmos pode superar os 300.000 quilômetros por segundo da luz no vácuo.',
    columnistQuoteReal: '"Se as deduções de Einstein forem confirmadas em telescópios, nossa intuição sobre o tempo deixará de existir." — Max Planck, Berlim.',
    headlineCounterfactual: 'DEPARTAMENTO DE PATENTES RECUSA TESES DE EINSTEIN; FÍSICOS REAFIRMAM O ÉTER ETERNO',
    subheadlineCounterfactual: 'Experimento de Michelson-Morley permanece sem explicação; academia insiste no arrasto mecânico da luz.',
    leadArticleCounterfactual: 'O manuscrito submetido pelo anônimo examinador técnico Albert Einstein foi arquivado sem publicação pelos editores da Europa Central. A comunidade dos físicos declarou que propor a dilatação do tempo fere a lógica comum dos relógios e da mecânica. O mundo científico permanecerá investigando a viscosidade do éter luminífero estacionário para justificar a velocidade da luz.',
    columnistQuoteCounterfactual: '"Nenhum cientista sério abdicará do tempo absoluto de Newton por devaneios sobre trens em alta velocidade." — Revista de Física Clássica de Viena.',
    woodcutCaption: 'Retrato do laboratório de interferometria óptica em Berlim.',
    archivalStamp: 'REGISTRO DE PATENTES E ARQUIVOS HISTÓRICOS DE BERNA // 1905-SR',
    academicHistoriographyNote: 'O ano de 1905 ("Annus Mirabilis") transformou a relatividade e o efeito fotoelétrico. Uma rejeição contrafactual atrasaria a equação E=mc² e os cálculos gravitacionais em décadas.',
    primaryArchiveSource: 'Einstein, A. (1905). Zur Elektrodynamik bewegter Körper. Annalen der Physik, 17: 891–921.',
  },
  1915: {
    masthead: 'THE NEW YORK TEMPORAL TRIBUNE',
    location: 'Nova York / Berlim',
    editionDate: 'Quinta-feira, 25 de Novembro de 1915',
    priceTag: 'Preço: 3 Cents',
    headlineReal: 'A GRAVIDADE É UMA CURVATURA NO ESPAÇO: EINSTEIN COMPLETA A RELATIVIDADE GERAL',
    subheadlineReal: 'A Academia Prussiana assiste à apresentação da equação que explica a órbita anômala de Mercúrio.',
    leadArticleReal: 'Em meio ao estrondo da Grande Guerra na Europa, uma vitória monumental do intelecto humano foi anunciada ontem em Berlim. Albert Einstein apresentou as equações de campo exatas da gravidade. A gravitação deixa de ser uma força invisível puxando os planetas e passa a ser compreendida como a curvatura que estrelas pesadas causam na própria geometria quadridimensional do espaço e do tempo.',
    columnistQuoteReal: '"O espaço não é um vazio neutro; ele se deforma, respira e orienta o destino de cada astro celeste." — David Hilbert, Göttingen.',
    headlineCounterfactual: 'EQUAÇÕES DE CAMPO DE EINSTEIN SÃO DECLARADAS MATEMATICAMENTE INTRATÁVEIS',
    subheadlineCounterfactual: 'Guerra interrompe colóquios; físicos retornam ao modelo gravitacional euclidiano clássico.',
    leadArticleCounterfactual: 'As tentativas teóricas de formular a gravidade através de tensores geométricos foram dadas como inconclusivas na Academia Prussiana de Ciências. Com a escassez de recursos provocada pelo conflito armado europeu, a física teórica abandonou a geometria de Riemann. A gravitação permanecerá modelada pelo inverso do quadrado da distância de Newton até segunda ordem.',
    columnistQuoteCounterfactual: '"A curvatura de superfícies abstratas é um artifício estéril para o cálculo de artilharia e engenharia de guerra." — Boletim Militar de Berlim.',
    woodcutCaption: 'Diagrama astronômico da deflexão da luz estelar ao redor do disco solar.',
    archivalStamp: 'ACADEMIA PRUSSIANA DE CIÊNCIAS // PROTOCOLO 1915-GR',
    academicHistoriographyNote: 'A confirmação empírica em 1919 pela expedição de Sobral e Príncipe liderada por Eddington consagrou a curvatura gravitacional e consolidou a relatividade no cenário mundial.',
    primaryArchiveSource: 'Einstein, A. (1915). Die Feldgleichungen der Gravitation. Sitzungsberichte der Preussischen Akad. d. Wiss.: 844–847.',
  },
};

export default function VintageNewspaperModal({ onClose, eventYear = 1905 }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const [selectedYear, setSelectedYear] = useState<number>(
    NEWSPAPERS[eventYear] ? eventYear : 1905
  );
  const [viewEdition, setViewEdition] = useState<'real' | 'counterfactual'>('real');

  const article: NewspaperArticle = NEWSPAPERS[selectedYear] || NEWSPAPERS[1905];

  return (
    <div className="newspaper-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="newspaper-modal-card" onClick={e => e.stopPropagation()}>
        {/* Top Control Bar */}
        <div className="newspaper-control-bar">
          <div className="newspaper-edition-toggle">
            <button
              type="button"
              className={`btn-paper-edition ${viewEdition === 'real' ? 'active-real' : ''}`}
              onClick={() => setViewEdition('real')}
            >
              {isLaymanMode ? 'Edição Real (O Que Aconteceu)' : 'Registro Histórico Documental (Real)'}
            </button>
            <button
              type="button"
              className={`btn-paper-edition ${viewEdition === 'counterfactual' ? 'active-counter' : ''}`}
              onClick={() => setViewEdition('counterfactual')}
            >
              {isLaymanMode ? 'Edição Contrafactual (E Se Falhasse?)' : 'Cenário Contrafactual Alternativo'}
            </button>
          </div>

          <div className="newspaper-year-selector">
            <span className="paper-sel-lbl">ANO DO JORNAL:</span>
            {[1865, 1905, 1915].map(yr => (
              <button
                key={yr}
                type="button"
                className={`btn-paper-year ${selectedYear === yr ? 'active' : ''}`}
                onClick={() => setSelectedYear(yr)}
              >
                {formatHistoricalYear(yr)}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-paper-close"
            onClick={onClose}
            aria-label="Fechar jornal de época"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Vintage Newsprint Sheet */}
        <div className={`vintage-newsprint-sheet ${viewEdition === 'counterfactual' ? 'counterfactual-ink' : ''}`}>
          {/* Archival Rubber Stamp */}
          <div className="newsprint-archival-stamp">
            <span>{article.archivalStamp}</span>
          </div>

          {/* Masthead Header */}
          <header className="newsprint-masthead">
            <div className="masthead-meta-top">
              <span>{article.location}</span>
              <span>{article.editionDate}</span>
              <span>{article.priceTag}</span>
            </div>
            <h1 className="masthead-title">{article.masthead}</h1>
            <div className="masthead-ornament-line">
              <span className="ornament-diamond" />
            </div>
          </header>

          {/* Main Headline */}
          <div className="newsprint-headline-section">
            <h2 className="headline-main">
              {viewEdition === 'real' ? article.headlineReal : article.headlineCounterfactual}
            </h2>
            <h4 className="headline-sub">
              {viewEdition === 'real' ? article.subheadlineReal : article.subheadlineCounterfactual}
            </h4>
          </div>

          {/* Multi-Column Articles & Engraving Body */}
          <div className="newsprint-columns-grid">
            {/* Column 1: Lead Story */}
            <div className="newsprint-col">
              <p className="newsprint-lead-paragraph">
                <span className="newsprint-dropcap">
                  {(viewEdition === 'real' ? article.leadArticleReal : article.leadArticleCounterfactual)[0]}
                </span>
                {(viewEdition === 'real' ? article.leadArticleReal : article.leadArticleCounterfactual).slice(1)}
              </p>
            </div>

            {/* Column 2: Woodcut Engraving & Contemporary Quotes */}
            <div className="newsprint-col col-sidebar">
              <div className="newsprint-woodcut-box">
                <div className="woodcut-frame">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#292524" strokeWidth="1.2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <span className="woodcut-caption">{article.woodcutCaption}</span>
              </div>

              <blockquote className="newsprint-quote-box">
                <p>
                  {viewEdition === 'real' ? article.columnistQuoteReal : article.columnistQuoteCounterfactual}
                </p>
              </blockquote>
            </div>
          </div>

          {/* Academic Historiographical Seal & Citation Footnote */}
          <footer className="newsprint-academic-footer">
            <div className="footer-academic-badge">
              <strong>ANOTAÇÃO DO HISTORIADOR // METODOLOGIA DE CIÊNCIA:</strong>
              <p>{article.academicHistoriographyNote}</p>
            </div>
            <div className="footer-citation-line">
              <span>DOCUMENTO DE ARQUIVO:</span>
              <em> {article.primaryArchiveSource}</em>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
