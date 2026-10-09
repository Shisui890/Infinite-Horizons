import React, { useState, useRef, useEffect } from 'react';
import { SCIENTIFIC_GLOSSARY, type GlossaryEntry } from '../../data/scientificGlossary';
import { useLaymanMode } from '../../context/LaymanModeContext';
import MathFormula from '../MathFormula';

interface Props {
  termId?: string;
  children: React.ReactNode;
  fallbackTerm?: string;
}

export default function GlossaryTerm({ termId, children, fallbackTerm }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const [isOpen, setIsOpen] = useState(false);
  const [cardMode, setCardMode] = useState<'layman' | 'academic'>(isLaymanMode ? 'layman' : 'academic');
  const containerRef = useRef<HTMLSpanElement | null>(null);

  // Sincroniza cardMode com o modo global quando ele mudar
  useEffect(() => {
    setCardMode(isLaymanMode ? 'layman' : 'academic');
  }, [isLaymanMode]);

  // Busca a entrada no glossário pelo termId ou pelo texto
  const entryKey = (termId || (typeof children === 'string' ? children : fallbackTerm || ''))
    .toLowerCase()
    .trim()
    .replace(/[^\w]/g, '_');

  const entry: GlossaryEntry | undefined =
    SCIENTIFIC_GLOSSARY[entryKey] ||
    Object.values(SCIENTIFIC_GLOSSARY).find(e =>
      e.aliases.some(a => a.toLowerCase() === entryKey.toLowerCase() || entryKey.includes(a.toLowerCase()))
    );

  // Fecha o card ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!entry) {
    return <>{children}</>;
  }

  return (
    <span
      ref={containerRef}
      className="glossary-term-wrap"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(prev => !prev)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen(prev => !prev);
        }
      }}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
    >
      <span className="glossary-term-anchor">{children}</span>

      {isOpen && (
        <span
          className="glossary-popover-card"
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-label={entry.term}
        >
          {/* Top Bar with Category & Mode Switcher */}
          <span className="glossary-card-top">
            <span className="glossary-badge-group">
              <span className="glossary-cat-pill">{entry.category}</span>
              <strong className="glossary-term-title">{entry.term}</strong>
            </span>

            <span className="glossary-mode-switch-btns">
              <button
                type="button"
                className={`btn-glossary-mode ${cardMode === 'layman' ? 'active' : ''}`}
                onClick={() => setCardMode('layman')}
                title="Ver explicação em linguagem simples com analogia do cotidiano"
              >
                Didático
              </button>
              <button
                type="button"
                className={`btn-glossary-mode ${cardMode === 'academic' ? 'active' : ''}`}
                onClick={() => setCardMode('academic')}
                title="Ver definição matemática rigorosa para estudantes universitários"
              >
                Acadêmico
              </button>
            </span>
          </span>

          {/* Mode: Layman */}
          {cardMode === 'layman' && (
            <span className="glossary-card-body layman-view">
              <span className="glossary-desc-simple">
                {entry.layman.shortDefinition}
              </span>

              <span className="glossary-analogy-box">
                <span className="analogy-header">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <strong>Analogia do Dia a Dia:</strong>
                </span>
                <span className="analogy-text">{entry.layman.everydayAnalogy}</span>
              </span>
            </span>
          )}

          {/* Mode: Academic / Study Mode */}
          {cardMode === 'academic' && (
            <span className="glossary-card-body academic-view">
              <span className="glossary-academic-def">
                {entry.academic.formalDefinition}
              </span>

              {entry.academic.mathematicalFormula && (
                <span className="glossary-formula-box">
                  <MathFormula math={entry.academic.mathematicalFormula} block />
                </span>
              )}

              {entry.academic.tensorNotation && (
                <span className="glossary-tensor-spec">
                  <MathFormula math={entry.academic.tensorNotation} block={false} />
                </span>
              )}

              {entry.academic.unitsOrDimension && (
                <span className="glossary-dimension-row">
                  <span className="dim-label">Unidade / Fibrado:</span>
                  <span className="dim-val">{entry.academic.unitsOrDimension}</span>
                </span>
              )}

              <span className="glossary-paper-cite">
                <span className="paper-cite-lbl">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                    <path d="M6 6h10M6 10h10" />
                  </svg>
                  FONTE ACADÊMICA CANÔNICA (PEER-REVIEW):
                </span>
                <span className="paper-cite-text">
                  <strong>{entry.academic.canonicalPaper.author} ({entry.academic.canonicalPaper.year})</strong>. 
                  <em> "{entry.academic.canonicalPaper.title}"</em>. {entry.academic.canonicalPaper.journal}.
                  <span className="cite-doi">{entry.academic.canonicalPaper.doiOrCitation}</span>
                </span>
              </span>
            </span>
          )}
        </span>
      )}
    </span>
  );
}
