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
