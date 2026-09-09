import React, { useMemo } from 'react';
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

// Regex matching math, bold-italic, bold, italic, code, del, links
const INLINE_REGEX =
  /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^$\n]+?\$|\\\([\s\S]*?\\\)|\*\*\*[^*\n]+?\*\*\*|___[^_\n]+?___|\*\*[^*\n]+?\*\*|__[^_\n]+?__|`[^`\n]+?`|~~[^~\n]+?~~|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\)|\*[^*\n]+?\*|(?<!\w)_[^_\n]+?_(?!\w))/g;

export type InlineToken =
  | { type: 'text'; content: string }
  | { type: 'inline-math'; content: string }
  | { type: 'block-math'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'italic'; content: string }
  | { type: 'bold-italic'; content: string }
  | { type: 'code'; content: string }
  | { type: 'del'; content: string }
  | { type: 'link'; text: string; url: string };

function parseInlineTokens(text: string): InlineToken[] {
  if (!text) return [];
  const tokens: InlineToken[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  INLINE_REGEX.lastIndex = 0;

  while ((match = INLINE_REGEX.exec(text)) !== null) {
    if (match.index > lastIdx) {
      tokens.push({ type: 'text', content: text.slice(lastIdx, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith('$$') && raw.endsWith('$$')) {
      tokens.push({ type: 'block-math', content: raw.slice(2, -2).trim() });
    } else if (raw.startsWith('\\[') && raw.endsWith('\\]')) {
      tokens.push({ type: 'block-math', content: raw.slice(2, -2).trim() });
    } else if (raw.startsWith('$') && raw.endsWith('$')) {
      tokens.push({ type: 'inline-math', content: raw.slice(1, -1).trim() });
    } else if (raw.startsWith('\\(') && raw.endsWith('\\)')) {
      tokens.push({ type: 'inline-math', content: raw.slice(2, -2).trim() });
    } else if (
      (raw.startsWith('***') && raw.endsWith('***')) ||
      (raw.startsWith('___') && raw.endsWith('___'))
    ) {
      tokens.push({ type: 'bold-italic', content: raw.slice(3, -3) });
    } else if (
      (raw.startsWith('**') && raw.endsWith('**')) ||
      (raw.startsWith('__') && raw.endsWith('__'))
    ) {
      tokens.push({ type: 'bold', content: raw.slice(2, -2) });
    } else if (
      (raw.startsWith('*') && raw.endsWith('*')) ||
      (raw.startsWith('_') && raw.endsWith('_'))
    ) {
      tokens.push({ type: 'italic', content: raw.slice(1, -1) });
    } else if (raw.startsWith('`') && raw.endsWith('`')) {
      tokens.push({ type: 'code', content: raw.slice(1, -1) });
    } else if (raw.startsWith('~~') && raw.endsWith('~~')) {
      tokens.push({ type: 'del', content: raw.slice(2, -2) });
    } else if (raw.startsWith('[') && raw.includes('](')) {
      const linkMatch = raw.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        tokens.push({ type: 'link', text: linkMatch[1], url: linkMatch[2] });
      } else {
        tokens.push({ type: 'text', content: raw });
      }
    } else {
      tokens.push({ type: 'text', content: raw });
    }
    lastIdx = match.index + raw.length;
  }

  if (lastIdx < text.length) {
    tokens.push({ type: 'text', content: text.slice(lastIdx) });
  }

  return tokens;
}

/**
 * Render inline markdown tokens (bold, italic, KaTeX, inline code, links)
 */
export function InlineMathText({ text, className = '' }: { text: string; className?: string }) {
  const tokens = useMemo(() => parseInlineTokens(text), [text]);

  const renderToken = (tok: InlineToken, i: number): React.ReactNode => {
    switch (tok.type) {
      case 'block-math':
        return <MathFormula key={i} math={tok.content} block />;
      case 'inline-math':
        return <MathFormula key={i} math={tok.content} block={false} />;
      case 'bold': {
        const isTag = tok.content.startsWith('[') && tok.content.endsWith(']');
        return (
          <strong key={i} className={`md-bold ${isTag ? 'md-highlight-tag' : ''}`}>
            {tok.content}
          </strong>
        );
      }
      case 'italic':
        return (
          <em key={i} className="md-italic">
            {tok.content}
          </em>
        );
      case 'bold-italic':
        return (
          <strong key={i} className="md-bold">
            <em className="md-italic">{tok.content}</em>
          </strong>
        );
      case 'code':
        return (
          <code key={i} className="md-inline-code">
            {tok.content}
          </code>
        );
      case 'del':
        return (
          <del key={i} className="md-del">
            {tok.content}
          </del>
        );
      case 'link':
        return (
          <a key={i} className="md-link" href={tok.url} target="_blank" rel="noopener noreferrer">
            {tok.text}
          </a>
        );
      case 'text':
      default: {
        if (tok.content.includes('\n')) {
          const lines = tok.content.split('\n');
          return (
            <React.Fragment key={i}>
              {lines.map((l, lIdx) => (
                <React.Fragment key={lIdx}>
                  {lIdx > 0 && <br />}
                  {l}
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        }
        return <span key={i}>{tok.content}</span>;
      }
    }
  };

  return (
    <span className={`inline-math-text ${className}`}>
      {tokens.map((tok, i) => renderToken(tok, i))}
    </span>
  );
}

export type MarkdownBlock =
  | { type: 'heading'; level: number; content: string }
  | { type: 'code-block'; lang: string; code: string }
  | { type: 'block-math'; content: string }
  | { type: 'blockquote'; content: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'paragraph'; content: string };

function parseMarkdownBlocks(rawText: string): MarkdownBlock[] {
  if (!rawText) return [];
  const text = rawText.replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  const blocks: MarkdownBlock[] = [];

  let currentPara: string[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let inCodeBlock = false;
  let codeLang = '';
  let codeLines: string[] = [];
  let inBlockMath = false;
  let blockMathLines: string[] = [];
  let currentQuote: string[] = [];

  const flushParagraph = () => {
    if (currentPara.length > 0) {
      blocks.push({ type: 'paragraph', content: currentPara.join('\n') });
      currentPara = [];
    }
  };

  const flushList = () => {
    if (currentList && currentList.items.length > 0) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  const flushQuote = () => {
    if (currentQuote.length > 0) {
      blocks.push({ type: 'blockquote', content: currentQuote.join('\n') });
      currentQuote = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code block toggle
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        blocks.push({ type: 'code-block', lang: codeLang, code: codeLines.join('\n') });
        inCodeBlock = false;
        codeLines = [];
        codeLang = '';
        continue;
      } else {
        flushParagraph();
        flushList();
        flushQuote();
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim();
        codeLines = [];
        continue;
      }
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Multiline Block math toggle ($$ on own line)
    if (trimmed === '$$') {
      if (inBlockMath) {
        blocks.push({ type: 'block-math', content: blockMathLines.join('\n').trim() });
        inBlockMath = false;
        blockMathLines = [];
        continue;
      } else {
        flushParagraph();
        flushList();
        flushQuote();
        inBlockMath = true;
        blockMathLines = [];
        continue;
      }
    }

    if (inBlockMath) {
      blockMathLines.push(line);
      continue;
    }

    // Single line block math $$...$$
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 2) {
      flushParagraph();
      flushList();
      flushQuote();
      blocks.push({ type: 'block-math', content: trimmed.slice(2, -2).trim() });
      continue;
    }

    // Blank line
    if (!trimmed) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    // Headings: #, ##, ###, ####, etc.
    const headingMatch = line.match(/^(#{1,6})\s+([\s\S]+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushQuote();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        content: headingMatch[2].trim(),
      });
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      flushParagraph();
      flushList();
      currentQuote.push(trimmed.replace(/^>\s?/, ''));
      continue;
    } else if (currentQuote.length > 0) {
      flushQuote();
    }

    // Unordered list: - item, * item, • item
    const ulMatch = trimmed.match(/^[-*•]\s+([\s\S]+)$/);
    if (ulMatch) {
      flushParagraph();
      flushQuote();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(ulMatch[1]);
      continue;
    }

    // Ordered list: 1. item
    const olMatch = trimmed.match(/^\d+\.\s+([\s\S]+)$/);
    if (olMatch) {
      flushParagraph();
      flushQuote();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(olMatch[1]);
      continue;
    }

    // Otherwise, normal paragraph line
    if (currentList) {
      flushList();
    }
    currentPara.push(line);
  }

  // Flush remaining
  if (inCodeBlock) {
    blocks.push({ type: 'code-block', lang: codeLang, code: codeLines.join('\n') });
  }
  if (inBlockMath) {
    blocks.push({ type: 'block-math', content: blockMathLines.join('\n').trim() });
  }
  flushParagraph();
  flushList();
  flushQuote();

  return blocks;
}

/**
 * Full Markdown + KaTeX Renderer for multiline text
 */
export function MarkdownText({ text, className = '' }: { text: string; className?: string }) {
  const blocks = useMemo(() => parseMarkdownBlocks(text), [text]);

  return (
    <div className={`markdown-math-content ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading': {
            if (block.level === 1) {
              return (
                <h3 key={idx} className="md-h md-h1">
                  <InlineMathText text={block.content} />
                </h3>
              );
            }
            if (block.level === 2) {
              return (
                <h4 key={idx} className="md-h md-h2">
                  <InlineMathText text={block.content} />
                </h4>
              );
            }
            if (block.level === 3) {
              return (
                <h5 key={idx} className="md-h md-h3">
                  <InlineMathText text={block.content} />
                </h5>
              );
            }
            return (
              <h6 key={idx} className="md-h md-h4">
                <InlineMathText text={block.content} />
              </h6>
            );
          }
          case 'code-block':
            return (
              <pre key={idx} className="md-code-block">
                <code className={block.lang ? `language-${block.lang}` : ''}>{block.code}</code>
              </pre>
            );
          case 'block-math':
            return <MathFormula key={idx} math={block.content} block />;
          case 'blockquote':
            return (
              <blockquote key={idx} className="md-blockquote">
                <InlineMathText text={block.content} />
              </blockquote>
            );
          case 'ul':
            return (
              <ul key={idx} className="md-ul">
                {block.items.map((item, iIdx) => (
                  <li key={iIdx}>
                    <InlineMathText text={item} />
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={idx} className="md-ol">
                {block.items.map((item, iIdx) => (
                  <li key={iIdx}>
                    <InlineMathText text={item} />
                  </li>
                ))}
              </ol>
            );
          case 'paragraph':
          default:
            return (
              <p key={idx} className="md-p">
                <InlineMathText text={block.content} />
              </p>
            );
        }
      })}
    </div>
  );
}

/**
 * MathText provides backward-compatible rendering for all existing usages:
 * If it detects multiline block structures (headings, lists, code blocks, or multiple paragraphs),
 * it renders a full MarkdownText. Otherwise, it renders an InlineMathText.
 */
export function MathText({
  text,
  className = '',
  inline = false,
}: {
  text: string;
  className?: string;
  inline?: boolean;
}) {
  const isMultilineBlock = useMemo(() => {
    if (inline) return false;
    if (!text) return false;
    return (
      text.includes('\n\n') ||
      /^#{1,6}\s/m.test(text) ||
      /^[-*•]\s/m.test(text) ||
      /^\d+\.\s/m.test(text) ||
      text.includes('```') ||
      /^>\s/m.test(text)
    );
  }, [text, inline]);

  if (isMultilineBlock) {
    return <MarkdownText text={text} className={className} />;
  }

  return <InlineMathText text={text} className={className} />;
}
