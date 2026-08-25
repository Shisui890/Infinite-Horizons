import { useEffect, useRef } from 'react';

interface Props {
  onStartSimulator?: () => void;
}

interface DemoNode {
  id: string;
  label: string;
  year: number;
  x: number;
  y: number;
  status: 'stable' | 'altered' | 'paradox' | 'collapsed';
}

interface DemoEdge {
  from: string;
  to: string;
  type: string;
}

const DEMO_NODES: DemoNode[] = [
  { id: 'e1', label: 'Nascimento de Alex', year: 2000, x: 80, y: 150, status: 'stable' },
  { id: 'e2', label: 'Descoberta Científica', year: 2020, x: 230, y: 100, status: 'stable' },
  { id: 'e3', label: 'Máquina Temporal', year: 2050, x: 380, y: 150, status: 'altered' },
  { id: 'e4', label: 'Primeira Viagem', year: 2060, x: 530, y: 100, status: 'paradox' },
  { id: 'e5', label: 'Intervenção', year: 1990, x: 160, y: 260, status: 'collapsed' },
];

const DEMO_EDGES: DemoEdge[] = [
  { from: 'e1', to: 'e2', type: 'causes' },
  { from: 'e2', to: 'e3', type: 'enables' },
  { from: 'e3', to: 'e4', type: 'causes' },
  { from: 'e4', to: 'e5', type: 'contradicts' },
  { from: 'e5', to: 'e1', type: 'prevents' },
];

const STATUS_COLORS: Record<string, string> = {
  stable: '#00d4ff',
  altered: '#fbbf24',
  paradox: '#ef4444',
  collapsed: '#6b7280',
};

export default function DemoSection({ onStartSimulator }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 640;
    const H = 380;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    function getNode(id: string) {
      return DEMO_NODES.find(n => n.id === id)!;
    }

    function draw() {
      const frame = frameRef.current++;

      ctx!.clearRect(0, 0, W, H);

      // Draw edges
      for (const edge of DEMO_EDGES) {
        const from = getNode(edge.from);
        const to = getNode(edge.to);

        const isParadox = edge.type === 'contradicts' || edge.type === 'prevents';
        const color = isParadox ? 'rgba(239, 68, 68, 0.5)' : 'rgba(0, 212, 255, 0.3)';

        ctx!.beginPath();
        ctx!.moveTo(from.x, from.y);

        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2 - 30;
        ctx!.quadraticCurveTo(mx, my, to.x, to.y);

        ctx!.strokeStyle = color;
        ctx!.lineWidth = isParadox ? 2 : 1.5;

        if (isParadox) {
          ctx!.setLineDash([6, 4]);
        } else {
          ctx!.setLineDash([]);
        }

        ctx!.stroke();
        ctx!.setLineDash([]);

        // Animated particle
        const t = ((frame * 0.008) % 1);
        const px = from.x + (to.x - from.x) * t;
        const rawPy = from.y + (to.y - from.y) * t;
        const curvePy = rawPy - Math.sin(t * Math.PI) * 30;

        ctx!.beginPath();
        ctx!.arc(px, curvePy, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = isParadox ? 'rgba(239, 68, 68, 0.8)' : 'rgba(0, 212, 255, 0.8)';
        ctx!.fill();
      }

      // Draw nodes
      for (const node of DEMO_NODES) {
        const col = STATUS_COLORS[node.status];
        const pulse = Math.sin(frame * 0.04 + DEMO_NODES.indexOf(node)) * 0.15 + 1;

        const glowGrad = ctx!.createRadialGradient(node.x, node.y, 0, node.x, node.y, 30 * pulse);
        glowGrad.addColorStop(0, col.replace(')', ', 0.2)').replace('rgb', 'rgba'));
        glowGrad.addColorStop(1, 'transparent');
        ctx!.fillStyle = glowGrad;
        ctx!.fillRect(node.x - 35, node.y - 35, 70, 70);

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, 10 * pulse, 0, Math.PI * 2);
        ctx!.fillStyle = col;
        ctx!.globalAlpha = 0.9;
        ctx!.fill();
        ctx!.globalAlpha = 1;

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, 14 * pulse, 0, Math.PI * 2);
        ctx!.strokeStyle = col.replace(')', ', 0.3)').replace('rgb', 'rgba');
        ctx!.lineWidth = 1;
        ctx!.stroke();

        ctx!.font = '10px Inter, sans-serif';
        ctx!.fillStyle = 'rgba(232, 234, 246, 0.8)';
        ctx!.textAlign = 'center';
        ctx!.fillText(node.label, node.x, node.y + 28);

        ctx!.font = '9px Orbitron, sans-serif';
        ctx!.fillStyle = col;
        ctx!.fillText(String(node.year), node.x, node.y + 42);
      }

      // Integrity indicator
      const integrity = 38 + Math.sin(frame * 0.02) * 5;
      ctx!.font = '11px Orbitron, sans-serif';
      ctx!.fillStyle = 'rgba(232, 234, 246, 0.5)';
      ctx!.textAlign = 'left';
      ctx!.fillText('INTEGRIDADE TEMPORAL', 20, 30);

      ctx!.fillStyle = 'rgba(255,255,255,0.05)';
      ctx!.fillRect(20, 38, 200, 8);

      const barColor = integrity < 40 ? '#ef4444' : integrity < 60 ? '#fbbf24' : '#00d4ff';
      ctx!.fillStyle = barColor;
      ctx!.fillRect(20, 38, integrity * 2, 8);

      ctx!.font = '10px Orbitron, sans-serif';
      ctx!.fillStyle = barColor;
      ctx!.fillText(`${Math.round(integrity)}%`, 225, 47);

      // Paradox badge
      const badgePulse = Math.sin(frame * 0.06) * 0.3 + 0.7;
      ctx!.font = '10px Orbitron, sans-serif';
      ctx!.fillStyle = `rgba(239, 68, 68, ${badgePulse})`;
      ctx!.textAlign = 'right';
      ctx!.fillText('RISCO: PARADOXO DO AVÔ', W - 20, 30);

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <section id="demo-section" className="section demo-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">DEMONSTRAÇÃO</span>
          <h2 className="section-title">Veja uma mudança atravessar o tempo.</h2>
          <p className="section-subtitle">
            Uma intervenção simples cria uma reação em cadeia. O mapa mostra o caminho,
            mede a integridade e revela o momento em que a realidade começa a divergir.
          </p>
        </div>

        <div className="demo-canvas-wrapper">
          <canvas ref={canvasRef} className="demo-canvas" />
          <div className="demo-overlay-badges">
            <span className="demo-badge demo-badge-stable">ESTÁVEL</span>
            <span className="demo-badge demo-badge-altered">ALTERADO</span>
            <span className="demo-badge demo-badge-paradox">PARADOXO</span>
            <span className="demo-badge demo-badge-collapsed">COLAPSADO</span>
          </div>
        </div>

        <div className="demo-cta">
          <button type="button" className="btn-cta" onClick={onStartSimulator}>
            <span className="btn-cta-text">TESTAR UMA HIPÓTESE</span>
            <span className="btn-cta-glow" />
          </button>
        </div>
      </div>
    </section>
  );
}
