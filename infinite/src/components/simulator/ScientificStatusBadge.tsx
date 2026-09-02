import type { ScientificStatus } from '../../types/temporal';
import { useLaymanMode } from '../../context/LaymanModeContext';

interface Props {
  status?: ScientificStatus;
  evidenceKind?: string;
  sourceUrl?: string;
  doi?: string;
  academicCitation?: string;
}

export default function ScientificStatusBadge({
  status = 'proven',
  evidenceKind,
  sourceUrl,
  doi,
  academicCitation,
}: Props) {
  const { isLaymanMode } = useLaymanMode();
  const isProven = status === 'proven' || evidenceKind === 'documented_fact';
  const isTheoretical = status === 'theoretical_untested' || evidenceKind === 'scientific_theory';

  const badgeConfig = isProven
    ? {
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.35)',
        title: isLaymanMode ? 'COMPROVADO PELA CIÊNCIA' : 'COMPROVADO EXPERIMENTALMENTE',
        subtitle: isLaymanMode ? 'Descoberta testada e comprovada no mundo real' : 'Física / Astronomia Observacional Confirmada',
      }
    : isTheoretical
    ? {
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.12)',
        border: 'rgba(245, 158, 11, 0.35)',
        title: isLaymanMode ? 'TEORIA MATEMÁTICA REAL' : 'TEORIA REAL (FÍSICA TEÓRICA)',
        subtitle: isLaymanMode ? 'Cálculo real de físicos famosos aguardando testes' : 'Modelo Matemático Formal (Sem Prova Empírica)',
      }
    : {
        color: '#38bdf8',
        bg: 'rgba(56, 189, 248, 0.12)',
        border: 'rgba(56, 189, 248, 0.35)',
        title: isLaymanMode ? 'SIMULAÇÃO DO COMPUTADOR' : 'MÉTODO NUMÉRICO / GRAFOS',
        subtitle: isLaymanMode ? 'Calculado matematicamente pelo simulador' : 'Cálculo Computacional & Algorítmico',
      };

  const finalUrl = sourceUrl || (doi ? `https://doi.org/${doi}` : null);

  return (
    <div
      className="scientific-status-pill"
      style={{
        backgroundColor: badgeConfig.bg,
        borderColor: badgeConfig.border,
        color: badgeConfig.color,
      }}
      title={`${badgeConfig.title} — ${badgeConfig.subtitle}`}
    >
      <span
        className="status-dot"
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: badgeConfig.color,
          boxShadow: `0 0 8px ${badgeConfig.color}`,
          display: 'inline-block',
          marginRight: '6px',
        }}
      />
      <span className="pill-title">{badgeConfig.title}</span>
      {finalUrl && (
        <a
          href={finalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pill-source-link"
          title={`Fonte: ${academicCitation || finalUrl}`}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      )}
    </div>
  );
}
