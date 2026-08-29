import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Universe, TemporalEvent } from '../../types/temporal';

interface Props {
  universe: Universe;
  onClose: () => void;
}

export default function Minkowski3DModal({ universe, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'minkowski' | 'calabi_yau'>('minkowski');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06060e);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 30, 80);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00d4ff, 2, 200);
    pointLight.position.set(0, 40, 40);
    scene.add(pointLight);

    // Main Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const allEvents = universe.dimensions.flatMap(d => d.events).sort((a, b) => a.year - b.year);

    if (viewMode === 'minkowski') {
      // 1. Coordinate Axes & Grid Planes
      const gridHelper = new THREE.GridHelper(80, 20, 0x00d4ff, 0x1e293b);
      gridHelper.position.y = -20;
      mainGroup.add(gridHelper);

      // Central Time Axis (Z = ct)
      const axisGeometry = new THREE.CylinderGeometry(0.2, 0.2, 70, 16);
      const axisMaterial = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const timeAxis = new THREE.Mesh(axisGeometry, axisMaterial);
      timeAxis.position.y = 10;
      mainGroup.add(timeAxis);

      // Place Events along Spacetime
      const nodeMeshes: Array<{ mesh: THREE.Mesh; event: TemporalEvent }> = [];

      allEvents.forEach((ev, i) => {
        const normY = ((ev.year - 1915) / (2024 - 1915)) * 50 - 15;
        const angle = (i / allEvents.length) * Math.PI * 2;
        const radius = 12 + (i % 3) * 5;
        const posX = Math.cos(angle) * radius;
        const posZ = Math.sin(angle) * radius;

        // Event Sphere Node
        const sphereGeo = new THREE.SphereGeometry(1.6, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: ev.dimensionId === 'dim-omega-02' ? 0xa855f7 : 0x00d4ff,
          emissive: ev.dimensionId === 'dim-omega-02' ? 0x6b21a8 : 0x0284c7,
          roughness: 0.2,
          metalness: 0.8,
        });
        const nodeMesh = new THREE.Mesh(sphereGeo, sphereMat);
        nodeMesh.position.set(posX, normY, posZ);
        mainGroup.add(nodeMesh);
        nodeMeshes.push({ mesh: nodeMesh, event: ev });

        // Light Cone Geometry (Future & Past)
        const coneHeight = 10;
        const coneRadius = 6;
        const coneGeo = new THREE.ConeGeometry(coneRadius, coneHeight, 32, 1, true);

        // Future Cone
        const futureConeMat = new THREE.MeshBasicMaterial({
          color: 0x00d4ff,
          transparent: true,
          opacity: 0.12,
          side: THREE.DoubleSide,
          wireframe: true,
        });
        const futureCone = new THREE.Mesh(coneGeo, futureConeMat);
        futureCone.position.set(posX, normY + coneHeight / 2, posZ);
        mainGroup.add(futureCone);

        // Past Cone
        const pastConeMat = new THREE.MeshBasicMaterial({
          color: 0xfbbf24,
          transparent: true,
          opacity: 0.08,
          side: THREE.DoubleSide,
          wireframe: true,
        });
        const pastCone = new THREE.Mesh(coneGeo, pastConeMat);
        pastCone.rotation.x = Math.PI;
        pastCone.position.set(posX, normY - coneHeight / 2, posZ);
        mainGroup.add(pastCone);
      });

      // Connect Events with Geodesic Curves
      for (let i = 0; i < nodeMeshes.length - 1; i++) {
        const from = nodeMeshes[i].mesh.position;
        const to = nodeMeshes[i + 1].mesh.position;

        const curve = new THREE.QuadraticBezierCurve3(
          from,
          new THREE.Vector3((from.x + to.x) / 2 + 5, (from.y + to.y) / 2, (from.z + to.z) / 2 + 5),
          to
        );

        const points = curve.getPoints(30);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.6 });
        const line = new THREE.Line(lineGeo, lineMat);
        mainGroup.add(line);
      }
    } else {
      // 2. Calabi-Yau 3D Complex Manifold Simulation (Torus Knot & Parametric Waves)
      const knotGeo = new THREE.TorusKnotGeometry(18, 5.5, 128, 32, 3, 5);
      const knotMat = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        emissive: 0x3b0764,
        roughness: 0.1,
        metalness: 0.9,
        wireframe: true,
      });
      const calabiMesh = new THREE.Mesh(knotGeo, knotMat);
      mainGroup.add(calabiMesh);

      // Inner Core
      const coreGeo = new THREE.IcosahedronGeometry(8, 3);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0369a1,
        wireframe: false,
        roughness: 0.3,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      mainGroup.add(coreMesh);
    }

    // Interactive mouse rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    function onMouseDown(e: MouseEvent) {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    }

    function onMouseMove(e: MouseEvent) {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      mainGroup.rotation.y += deltaX * 0.008;
      mainGroup.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    }

    function onMouseUp() {
      isDragging = false;
    }

    function onWheel(e: WheelEvent) {
      camera.position.z = Math.max(25, Math.min(150, camera.position.z + e.deltaY * 0.05));
    }

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel);

    // Animation Loop
    let animId = 0;
    function animate() {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        mainGroup.rotation.y += 0.002;
      }
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);
      renderer.dispose();
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, [universe, viewMode]);

  return (
    <div className="minkowski-modal-backdrop">
      <div className="minkowski-modal-container">
        <div className="minkowski-header">
          <div>
            <span className="minkowski-badge">VISUALIZAÇÃO ESPAÇO-TEMPORAL 3D</span>
            <h2>{viewMode === 'minkowski' ? 'Diagrama de Minkowski 3D (Cones de Luz)' : 'Variedade de Calabi-Yau 3D (Teoria M)'}</h2>
          </div>

          <div className="minkowski-controls">
            <button
              type="button"
              className={`mink-tab-btn ${viewMode === 'minkowski' ? 'active' : ''}`}
              onClick={() => setViewMode('minkowski')}
            >
              Cones de Luz (Minkowski)
            </button>
            <button
              type="button"
              className={`mink-tab-btn ${viewMode === 'calabi_yau' ? 'active' : ''}`}
              onClick={() => setViewMode('calabi_yau')}
            >
              Calabi-Yau (Supercordas)
            </button>
            <button type="button" className="sim-btn-close" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="minkowski-canvas-wrapper" ref={containerRef}>
          <div className="minkowski-instructions">
            <span>Clique e arraste para rotacionar o espaço-tempo em 3D | Roda do mouse para Zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
}
