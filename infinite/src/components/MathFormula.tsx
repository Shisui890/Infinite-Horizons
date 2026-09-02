import { useMemo } from 'react';
import katex from 'katex';

interface Props {
  math: string;
  block?: boolean;
  className?: string;
}

export default function MathFormula({ math, block = false, className = '' }: Props) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      return math;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        className={`math-formula math-block ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`math-formula math-inline ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * MathText renders text with inline ($...$) or block ($$...$$) LaTeX formulas
 * automatically converted into elegant KaTeX typography, just like ChatGPT/GPT.
 */
export function MathText({ text, className = '' }: { text: string; className?: string }) {
  const parts = useMemo(() => {
    if (!text || (!text.includes('$') && !text.includes('\\(') && !text.includes('\\['))) {
      return [{ type: 'text', content: text }];
    }

    const result: Array<{ type: 'text' | 'inline-math' | 'block-math'; content: string }> = [];
    // Match $$...$$, $...$, \[...\], \(...\)
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }

      const raw = match[0];
      if (raw.startsWith('$$') && raw.endsWith('$$')) {
        result.push({ type: 'block-math', content: raw.slice(2, -2).trim() });
      } else if (raw.startsWith('\\[') && raw.endsWith('\\]')) {
        result.push({ type: 'block-math', content: raw.slice(2, -2).trim() });
      } else if (raw.startsWith('\\(') && raw.endsWith('\\)')) {
        result.push({ type: 'inline-math', content: raw.slice(2, -2).trim() });
      } else if (raw.startsWith('$') && raw.endsWith('$')) {
        result.push({ type: 'inline-math', content: raw.slice(1, -1).trim() });
      }

      lastIndex = match.index + raw.length;
    }

    if (lastIndex < text.length) {
      result.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return result;
  }, [text]);

  return (
    <span className={`math-text-wrapper ${className}`}>
      {parts.map((part, idx) => {
        if (part.type === 'block-math') {
          return <MathFormula key={idx} math={part.content} block />;
        }
        if (part.type === 'inline-math') {
          return <MathFormula key={idx} math={part.content} block={false} />;
        }
        return <span key={idx}>{part.content}</span>;
      })}
    </span>
  );
}
