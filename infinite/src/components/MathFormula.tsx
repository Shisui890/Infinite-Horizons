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

  return (
    <span
      className={`math-formula ${block ? 'math-block' : 'math-inline'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
