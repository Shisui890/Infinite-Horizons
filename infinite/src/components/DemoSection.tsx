import { useEffect, useRef } from 'react';
import { useLaymanMode } from '../context/LaymanModeContext';

interface Props {
  onStartSimulator?: () => void;
}

interface DemoNode {
  id: string;
  label: string;
  laymanLabel: string;
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
  { id: 'e1', label: 'Relatividade Geral', laymanLabel: 'Espaço Curvo (Einstein)', year: 1915, x: 70, y: 150, status: 'stable' },
  { id: 'e2', label: 'Radiação Cósmica (CMB)', laymanLabel: 'Eco do Big Bang', year: 1965, x: 190, y: 100, status: 'stable' },
  { id: 'e3', label: 'Teoria das Supercordas', laymanLabel: 'Cordas Musicais (11D)', year: 1984, x: 310, y: 160, status: 'stable' },
  { id: 'e4', label: 'Expansão Acelerada', laymanLabel: 'Energia Misteriosa', year: 1998, x: 430, y: 95, status: 'altered' },
  { id: 'e5', label: 'Ondas Gravitacionais', laymanLabel: 'Som do Espaço-Tempo', year: 2015, x: 550, y: 150, status: 'stable' },
];

const DEMO_EDGES: DemoEdge[] = [
  { from: 'e1', to: 'e2', type: 'causes' },
  { from: 'e1', to: 'e3', type: 'enables' },
  { from: 'e2', to: 'e4', type: 'causes' },
  { from: 'e4', to: 'e5', type: 'enables' },
  { from: 'e3', to: 'e5', type: 'causes' },
];

const STATUS_COLORS: Record<string, { main: string; glow: string; ring: string }> = {
  stable: { main: '#00d4ff', glow: 'rgba(0, 212, 255, 0.25)', ring: 'rgba(0, 212, 255, 0.4)' },
  altered: { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.25)', ring: 'rgba(251, 191, 36, 0.4)' },
  paradox: { main: '#a855f7', glow: 'rgba(168, 85, 247, 0.25)', ring: 'rgba(168, 85, 247, 0.4)' },
  collapsed: { main: '#6b7280', glow: 'rgba(107, 114, 128, 0.25)', ring: 'rgba(107, 114, 128, 0.4)' },
};

export default function DemoSection({ onStartSimulator }: Props) {
  const { isLaymanMode } = useLaymanMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 640;
    const H = 340;
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

        const color = 'rgba(0, 212, 255, 0.4)';

        ctx!.beginPath();
        ctx!.moveTo(from.x, from.y);

        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2 - 25;
        ctx!.quadraticCurveTo(mx, my, to.x, to.y);

        ctx!.strokeStyle = color;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        // Animated particle
        const t = ((frame * 0.007) % 1);
        const px = from.x + (to.x - from.x) * t;
        const rawPy = from.y + (to.y - from.y) * t;
        const curvePy = rawPy - Math.sin(t * Math.PI) * 25;

        ctx!.beginPath();
        ctx!.arc(px, curvePy, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(0, 212, 255, 0.9)';
        ctx!.fill();
      }

      // Draw nodes
      for (const node of DEMO_NODES) {
        const col = STATUS_COLORS[node.status];
        const pulse = Math.sin(frame * 0.04 + DEMO_NODES.indexOf(node)) * 0.12 + 1;

        const glowGrad = ctx!.createRadialGradient(node.x, node.y, 0, node.x, node.y, 28 * pulse);
        glowGrad.addColorStop(0, col.glow);
        glowGrad.addColorStop(1, 'transparent');
        ctx!.fillStyle = glowGrad;
        ctx!.fillRect(node.x - 35, node.y - 35, 70, 70);

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, 9 * pulse, 0, Math.PI * 2);
        ctx!.fillStyle = col.main;
        ctx!.globalAlpha = 0.95;
        ctx!.fill();
        ctx!.globalAlpha = 1;

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, 13 * pulse, 0, Math.PI * 2);
        ctx!.strokeStyle = col.ring;
        ctx!.lineWidth = 1;
        ctx!.stroke();

        ctx!.font = '600 10px Inter, sans-serif';
        ctx!.fillStyle = 'rgba(232, 234, 246, 0.95)';
        ctx!.textAlign = 'center';
        ctx!.fillText(isLaymanMode ? node.laymanLabel : node.label, node.x, node.y + 26);

        ctx!.font = '9px Orbitron, sans-serif';
        ctx!.fillStyle = col.main;
        ctx!.fillText(String(node.year), node.x, node.y + 39);
      }

      // Top Status Bar: Clean Layout with No Text Overlap
      ctx!.font = '10px Orbitron, sans-serif';
      ctx!.fillStyle = 'rgba(232, 234, 246, 0.7)';
      ctx!.textAlign = 'left';
      ctx!.fillText(isLaymanMode ? 'SAÚDE DA LINHA TEMPORAL' : 'COERÊNCIA DO MODELO CAUSAL', 20, 26);

      ctx!.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx!.fillRect(20, 33, 150, 6);

      ctx!.fillStyle = '#00d4ff';
      ctx!.fillRect(20, 33, 147, 6);

      ctx!.font = '10px Orbitron, sans-serif';
      ctx!.fillStyle = '#00d4ff';
      ctx!.fillText('98%', 178, 40);

      // Right Status Indicator
      ctx!.font = '10px Orbitron, sans-serif';
      ctx!.fillStyle = 'rgba(0, 212, 255, 0.9)';
      ctx!.textAlign = 'right';
      ctx!.fillText(isLaymanMode ? 'ESTADO: SEM PARADOXOS NO TEMPO' : 'ESTADO: AUTOCONSISTÊNCIA PRESERVADA', W - 20, 26);

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, [isLaymanMode]);

  return (
    <section id="demo-section" className="section demo-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">
            {isLaymanMode ? 'LINHA DO TEMPO VIVA' : 'SIMULAÇÃO DE GRAFO CAUSAL'}
          </span>
          <h2 className="section-title">
            {isLaymanMode
              ? 'Como Grandes Ideias Mudam o Destino da Humanidade'
              : 'Estrutura de Dependência Causal e Validação Científica'}
          </h2>
          <p className="section-subtitle">
            {isLaymanMode
              ? 'Veja como as descobertas sobre o espaço, o tempo e os buracos negros estão conectadas como os fios de um grande filme de ficção.'
              : 'Visualização topológica de marcos fundamentais da física moderna. Cada nó representa uma teoria ou observação documentada, interligada por relações de dedução e comprovação empírica.'}
          </p>
        </div>

        <div className="demo-canvas-wrapper">
          <canvas ref={canvasRef} className="demo-canvas" />
          <div className="demo-overlay-badges">
            <span className="demo-badge demo-badge-stable">
              {isLaymanMode ? 'PROVADO NO MUNDO REAL' : 'COMPROVADO EXPERIMENTALMENTE'}
            </span>
            <span className="demo-badge demo-badge-altered">
              {isLaymanMode ? 'EM INVESTIGAÇÃO' : 'MODELO TEÓRICO EM ANÁLISE'}
            </span>
            <span className="demo-badge demo-badge-paradox">
              {isLaymanMode ? '11 DIMENSÕES SECRETAS' : 'HIPÓTESE DE UNIFICAÇÃO'}
            </span>
          </div>
        </div>

        <div className="demo-cta">
          <button type="button" className="btn-cta" onClick={onStartSimulator}>
            <span className="btn-cta-text">{isLaymanMode ? 'ENTRAR NO SIMULADOR' : 'EXPLORAR NO SIMULADOR'}</span>
            <span className="btn-cta-glow" />
          </button>
        </div>
      </div>
    </section>
  );
}
