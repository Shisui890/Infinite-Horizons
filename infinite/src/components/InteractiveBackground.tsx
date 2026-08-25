import { useRef, useEffect, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  hue: number;
  opacity: number;
  phase: number;
  speed: number;
}

interface WaveRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

const STAR_COUNT = 350;
const PARTICLE_COUNT = 80;
const NEBULA_COUNT = 5;
const CONNECTION_DISTANCE = 120;
const MOUSE_INFLUENCE_RADIUS = 200;

function createStar(w: number, h: number): Star {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random() * 3 + 0.5,
    size: Math.random() * 2 + 0.3,
    brightness: Math.random() * 0.6 + 0.4,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    twinklePhase: Math.random() * Math.PI * 2,
  };
}

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2.5 + 1,
    opacity: Math.random() * 0.5 + 0.2,
    hue: Math.random() > 0.5 ? 190 + Math.random() * 30 : 270 + Math.random() * 30,
    life: 0,
    maxLife: Math.random() * 600 + 400,
  };
}

function createNebula(w: number, h: number): Nebula {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    radius: Math.random() * 300 + 150,
    hue: Math.random() > 0.5 ? 200 : 275,
    opacity: Math.random() * 0.04 + 0.02,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.003 + 0.001,
  };
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const starsRef = useRef<Star[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const nebulasRef = useRef<Nebula[]>([]);
  const ripplesRef = useRef<WaveRipple[]>([]);
  const frameRef = useRef(0);
  const animRef = useRef(0);
  const dprRef = useRef(1);

  const init = useCallback((w: number, h: number) => {
    starsRef.current = Array.from({ length: STAR_COUNT }, () => createStar(w, h));
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => createParticle(w, h));
    nebulasRef.current = Array.from({ length: NEBULA_COUNT }, () => createNebula(w, h));
    ripplesRef.current = [];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width = w * dprRef.current;
      canvas!.height = h * dprRef.current;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
      init(w, h);
    }

    resize();
    window.addEventListener('resize', resize);

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function handleClick(e: MouseEvent) {
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 250 + Math.random() * 100,
        opacity: 0.35,
      });
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    function drawNebulas(ctx: CanvasRenderingContext2D, frame: number) {
      for (const n of nebulasRef.current) {
        const pulse = Math.sin(frame * n.speed + n.phase) * 0.3 + 1;
        const r = n.radius * pulse;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r);
        grad.addColorStop(0, `hsla(${n.hue}, 80%, 50%, ${n.opacity * 1.5})`);
        grad.addColorStop(0.4, `hsla(${n.hue}, 70%, 40%, ${n.opacity * 0.8})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(n.x - r, n.y - r, r * 2, r * 2);
      }
    }

    function drawStars(ctx: CanvasRenderingContext2D, frame: number, mx: number, my: number) {
      for (const s of starsRef.current) {
        const twinkle = Math.sin(frame * s.twinkleSpeed + s.twinklePhase) * 0.3 + 0.7;
        const alpha = s.brightness * twinkle;

        // Parallax effect based on mouse position
        const w = window.innerWidth;
        const h = window.innerHeight;
        const px = (mx - w / 2) * 0.01 * s.z;
        const py = (my - h / 2) * 0.01 * s.z;
        const sx = s.x + px;
        const sy = s.y + py;

        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 235, 255, ${alpha})`;
        ctx.fill();

        // Glow for larger stars
        if (s.size > 1.2) {
          ctx.beginPath();
          ctx.arc(sx, sy, s.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 220, 255, ${alpha * 0.08})`;
          ctx.fill();
        }
      }
    }

    function drawParticles(ctx: CanvasRenderingContext2D, mx: number, my: number) {
      const particles = particlesRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse interaction — gentle repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_INFLUENCE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_INFLUENCE_RADIUS) * 0.8;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Wrap around
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Respawn if dead
        if (p.life > p.maxLife) {
          Object.assign(p, createParticle(w, h));
        }

        // Fade in/out lifecycle
        const lifeFraction = p.life / p.maxLife;
        let fadeAlpha = 1;
        if (lifeFraction < 0.1) fadeAlpha = lifeFraction / 0.1;
        else if (lifeFraction > 0.85) fadeAlpha = (1 - lifeFraction) / 0.15;

        const alpha = p.opacity * fadeAlpha;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha * 0.08})`;
        ctx.fill();
      }

      // Connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const ddx = a.x - b.x;
          const ddy = a.y - b.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);

          if (d < CONNECTION_DISTANCE) {
            const alpha = (1 - d / CONNECTION_DISTANCE) * 0.12;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
            ctx.stroke();
          }
        }
      }
    }

    function drawRipples(ctx: CanvasRenderingContext2D) {
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 3;
        r.opacity *= 0.975;

        if (r.radius > r.maxRadius || r.opacity < 0.01) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 212, 255, ${r.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner ring
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, ${r.opacity * 0.5})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    function animate() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const frame = frameRef.current++;

      // Clear
      ctx!.fillStyle = '#06060e';
      ctx!.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      drawNebulas(ctx!, frame);
      drawStars(ctx!, frame, mx, my);
      drawParticles(ctx!, mx, my);
      drawRipples(ctx!);

      // Subtle vignette
      const vigGrad = ctx!.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.9);
      vigGrad.addColorStop(0, 'transparent');
      vigGrad.addColorStop(1, 'rgba(6, 6, 14, 0.6)');
      ctx!.fillStyle = vigGrad;
      ctx!.fillRect(0, 0, w, h);

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      id="interactive-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
