import { useEffect, useRef } from 'react';
import './connecting.css';

interface Node {
  x: number; y: number; vx: number; vy: number; size: number;
  phase: number; hue: number; core: boolean;
}
interface Star { x: number; y: number; s: number; p: number; a: number }
interface Point { x: number; y: number; n: Node }

// Port of the supplied n1-nebula-connecting-ideas-light-centered.html artwork.
function animateNetwork(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;
  const context = ctx;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 1, height = 1, start = performance.now(), previous = start, raf = 0;
  let nodes: Node[] = [], stars: Star[] = [];
  const rand = (a: number, b: number) => a + (b - a) * Math.random();

  function seed() {
    nodes = []; stars = [];
    const count = Math.max(75, Math.min(155, Math.round(width * height / 11500)));
    for (let i = 0; i < count; i++) {
      const angle = rand(0, Math.PI * 2), radius = Math.sqrt(Math.random()) * .72;
      nodes.push({ x: .5 + Math.cos(angle) * radius * .72, y: .47 + Math.sin(angle) * radius * .5,
        vx: rand(-.00009, .00009), vy: rand(-.00007, .00007), size: rand(.85, 2.6),
        phase: rand(0, 7), hue: [196, 212, 235, 254, 273][i % 5], core: i % 13 === 0 });
    }
    for (let i = 0; i < Math.min(340, Math.round(width * height / 3100)); i++) {
      stars.push({ x: Math.random(), y: Math.random(), s: rand(.28, 1.35), p: rand(0, 6), a: rand(.12, .58) });
    }
  }

  function bloom(x: number, y: number, radius: number, hue: number, alpha: number) {
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `hsla(${hue},85%,64%,${alpha})`);
    gradient.addColorStop(.22, `hsla(${hue},80%,73%,${alpha * .48})`);
    gradient.addColorStop(.62, `hsla(${hue},82%,80%,${alpha * .14})`);
    gradient.addColorStop(1, `hsla(${hue},100%,50%,0)`);
    context.fillStyle = gradient;
    context.fillRect(x - radius, y - radius, 2 * radius, 2 * radius);
  }

  function draw(time: number) {
    const dt = Math.max(0, Math.min(35, time - previous || 16)); previous = time;
    // The first RAF timestamp can precede an effect started in the same frame.
    const t = Math.max(0, time - start) * .001 * 1.85, still = reduced.matches;
    const formation = still ? 1 : Math.min(1, Math.max(0, (time - start) / 1050));
    context.fillStyle = 'rgb(249,250,251)'; context.fillRect(0, 0, width, height);
    for (const star of stars) {
      const alpha = star.a * (.7 + .3 * Math.sin(t * .85 + star.p));
      context.fillStyle = `rgba(100,112,154,${alpha * .48})`;
      context.fillRect(star.x * width, star.y * height, star.s, star.s);
    }
    const spread = still ? 1 : .2 + .8 * (1 - Math.pow(1 - formation, 3));
    const points: Point[] = nodes.map(node => {
      if (!still) {
        node.x += node.vx * dt * 1.85 * .7; node.y += node.vy * dt * 1.85 * .7;
        if (node.x < .07 || node.x > .93) node.vx *= -1;
        if (node.y < .07 || node.y > .88) node.vy *= -1;
      }
      return { x: width / 2 + (node.x - .5) * width * spread, y: height * .46 + (node.y - .46) * height * spread, n: node };
    });
    const maxDistance = Math.min(width, height) * .23;
    const links: [Point, Point, number][] = [];
    for (let i = 0; i < points.length; i++) {
      const a = points[i]; let count = 0;
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j], dx = b.x - a.x, dy = b.y - a.y, distanceSquared = dx * dx + dy * dy;
        if (distanceSquared > maxDistance * maxDistance || distanceSquared < 120) continue;
        if (++count > 7) break;
        const fade = (1 - Math.sqrt(distanceSquared) / maxDistance) * .52 * formation;
        links.push([a, b, fade]);
        context.strokeStyle = `rgba(71,91,168,${fade * .88})`; context.lineWidth = .55;
        context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
      }
    }
    if (!still && links.length) {
      for (let k = 0; k < Math.min(35, links.length); k++) {
        const [a, b, fade] = links[(k * 23 + Math.floor(t * 4)) % links.length];
        const u = (t * 1.35 + k * .173) % 1, px = a.x + (b.x - a.x) * u, py = a.y + (b.y - a.y) * u;
        context.strokeStyle = `rgba(52,115,196,${fade * 1.45})`; context.lineWidth = 1.45;
        context.beginPath(); context.moveTo(a.x + (b.x - a.x) * Math.max(0, u - .11), a.y + (b.y - a.y) * Math.max(0, u - .11));
        context.lineTo(px, py); context.stroke(); context.fillStyle = `rgba(42,105,199,${fade * 2.5})`;
        context.beginPath(); context.arc(px, py, 1.4, 0, Math.PI * 2); context.fill();
      }
    }
    for (const point of points) {
      const node = point.n, glow = .5 + .5 * Math.sin(t * 1.5 + node.phase);
      context.fillStyle = `hsla(${node.hue},82%,42%,${(.46 + glow * .44) * formation})`;
      context.beginPath(); context.arc(point.x, point.y, node.size * (node.core ? 1.35 : 1), 0, Math.PI * 2); context.fill();
      if (node.core) bloom(point.x, point.y, 25 + glow * 15, node.hue, .12 * formation);
    }
    if (!still && formation < 1) bloom(width * .5, height * .46, Math.min(width, height) * (.13 + formation * .28), 202, (1 - formation) * .11);
    // Reduced motion renders once; hidden tabs do not consume animation frames.
    if (!still && !document.hidden) raf = requestAnimationFrame(draw);
  }

  function restart() {
    cancelAnimationFrame(raf); start = performance.now(); previous = start;
    if (!document.hidden) draw(start);
  }
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    width = Math.max(1, canvas.clientWidth); height = Math.max(1, canvas.clientHeight);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0); seed(); restart();
  }
  window.addEventListener('resize', resize, { passive: true });
  reduced.addEventListener('change', restart);
  document.addEventListener('visibilitychange', restart);
  resize();
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    reduced.removeEventListener('change', restart);
    document.removeEventListener('visibilitychange', restart);
  };
}

export function ConnectingPage() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Connecting ideas · Aqua University';
    const stop = canvas.current ? animateNetwork(canvas.current) : undefined;
    // Static prototype timing: no authentication or workspace service is contacted.
    const timer = window.setTimeout(() => window.location.replace('#/onechat'), 5000);
    return () => { stop?.(); window.clearTimeout(timer); document.title = previousTitle; };
  }, []);

  return <main className="connecting-page">
    <div className="connecting-sidebar" aria-hidden="true">
      <div className="connecting-skeleton-brand" />
      <div className="connecting-skeleton-nav">
        {[0, 1, 2, 3].map(item => <div className="connecting-skeleton-nav-row" key={item}>
          <span className="connecting-skeleton-icon" /><span className="connecting-skeleton-line" />
        </div>)}
      </div>
      <div className="connecting-skeleton-history">
        <span className="connecting-skeleton-line" />
        {[0, 1, 2, 3, 4, 5].map(item => <span className="connecting-skeleton-line" key={item} />)}
      </div>
      <div className="connecting-skeleton-account"><span className="connecting-skeleton-avatar" /><span className="connecting-skeleton-line" /></div>
    </div>
    <div className="connecting-workspace">
      <div className="connecting-skeleton-content" aria-hidden="true">
        <div className="connecting-skeleton-toolbar"><span className="connecting-skeleton-line" /><span className="connecting-skeleton-avatar" /></div>
        <div className="connecting-skeleton-chat"><div className="connecting-skeleton-greeting" /><div className="connecting-skeleton-composer"><span className="connecting-skeleton-icon" /><span className="connecting-skeleton-line" /><span className="connecting-skeleton-avatar" /></div></div>
        <div className="connecting-skeleton-cards">{[0, 1, 2].map(item => <div className="connecting-skeleton-card" key={item}><span className="connecting-skeleton-avatar" /><span className="connecting-skeleton-line" /><span className="connecting-skeleton-line" /></div>)}</div>
      </div>
      <canvas ref={canvas} aria-hidden="true" />
      <div className="connecting-copy" role="status" aria-live="polite">
        <h1>Getting your workspace ready ...</h1>
      </div>
    </div>
  </main>;
}
