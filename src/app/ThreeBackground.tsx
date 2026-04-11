'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── PROCEDURAL AK-47 — CRYSTAL / BLUEPRINT AESTHETIC ───────────────────────
// Translucent MeshPhysicalMaterial + wireframe edge overlay
// Scroll drives tight 360° Y rotation with minimal inertia

function buildGunGroup(): THREE.Group {
  const gun = new THREE.Group();

  // ── CRYSTAL MATERIAL — glass-like with cyan/amber emissive tint ──
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0x00d4ff,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.12,
    transmission: 0.9,
    thickness: 0.5,
    emissive: 0x00d4ff,
    emissiveIntensity: 0.15,
    side: THREE.DoubleSide,
  });

  const accentCrystalMat = new THREE.MeshPhysicalMaterial({
    color: 0xf5a623,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.18,
    transmission: 0.85,
    thickness: 0.5,
    emissive: 0xf5a623,
    emissiveIntensity: 0.25,
    side: THREE.DoubleSide,
  });

  // ── WIREFRAME MATERIALS — blueprint grid overlay ──
  const wireCyan = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });

  const wireAmber = new THREE.MeshBasicMaterial({
    color: 0xf5a623,
    wireframe: true,
    transparent: true,
    opacity: 0.4,
  });

  const wirePurple = new THREE.MeshBasicMaterial({
    color: 0x7c6efa,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });

  // Helper: add mesh + wireframe overlay
  function addPart(
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    wireMat: THREE.Material,
    pos: [number, number, number],
    rot?: [number, number, number]
  ) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    if (rot) mesh.rotation.set(...rot);
    gun.add(mesh);

    const wire = new THREE.Mesh(geo, wireMat);
    wire.position.set(...pos);
    if (rot) wire.rotation.set(...rot);
    gun.add(wire);
  }

  // ── BARREL ──
  addPart(
    new THREE.CylinderGeometry(0.06, 0.07, 3.2, 16),
    crystalMat, wireCyan,
    [2.2, 0.15, 0], [0, 0, Math.PI / 2]
  );

  // Barrel inner bore
  addPart(
    new THREE.CylinderGeometry(0.04, 0.04, 3.3, 12),
    crystalMat, wirePurple,
    [2.25, 0.15, 0], [0, 0, Math.PI / 2]
  );

  // Muzzle brake
  addPart(
    new THREE.CylinderGeometry(0.09, 0.08, 0.35, 8),
    crystalMat, wireCyan,
    [3.85, 0.15, 0], [0, 0, Math.PI / 2]
  );

  // Muzzle brake slots
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI * 2 * i) / 4;
    addPart(
      new THREE.BoxGeometry(0.25, 0.02, 0.04),
      crystalMat, wireAmber,
      [3.85, 0.15 + Math.cos(angle) * 0.07, Math.sin(angle) * 0.07]
    );
  }

  // Front sight post
  addPart(
    new THREE.BoxGeometry(0.02, 0.15, 0.02),
    crystalMat, wireAmber,
    [3.5, 0.32, 0]
  );

  // Front sight base
  addPart(
    new THREE.BoxGeometry(0.08, 0.04, 0.06),
    crystalMat, wireCyan,
    [3.5, 0.22, 0]
  );

  // ── GAS TUBE ──
  addPart(
    new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8),
    crystalMat, wireCyan,
    [1.6, 0.3, 0], [0, 0, Math.PI / 2]
  );

  // ── HANDGUARD ──
  addPart(
    new THREE.BoxGeometry(1.5, 0.1, 0.12),
    crystalMat, wireCyan,
    [1.35, 0.05, 0]
  );
  addPart(
    new THREE.BoxGeometry(1.5, 0.1, 0.14),
    crystalMat, wireCyan,
    [1.35, -0.05, 0]
  );

  // Handguard metal bands
  addPart(
    new THREE.BoxGeometry(0.04, 0.22, 0.18),
    accentCrystalMat, wireAmber,
    [0.65, 0, 0]
  );
  addPart(
    new THREE.BoxGeometry(0.04, 0.22, 0.18),
    accentCrystalMat, wireAmber,
    [2.05, 0, 0]
  );

  // ── RECEIVER / BODY ──
  addPart(
    new THREE.BoxGeometry(1.2, 0.22, 0.14),
    crystalMat, wireCyan,
    [0.1, 0.12, 0]
  );

  // Receiver top cover
  addPart(
    new THREE.BoxGeometry(1.0, 0.04, 0.12),
    crystalMat, wirePurple,
    [0.0, 0.25, 0]
  );

  // Rear sight
  addPart(
    new THREE.BoxGeometry(0.06, 0.1, 0.08),
    crystalMat, wireCyan,
    [-0.2, 0.33, 0]
  );

  // Rear sight leaf (amber accent)
  addPart(
    new THREE.BoxGeometry(0.02, 0.08, 0.06),
    accentCrystalMat, wireAmber,
    [-0.2, 0.36, 0]
  );

  // Charging handle
  addPart(
    new THREE.BoxGeometry(0.08, 0.06, 0.03),
    crystalMat, wireCyan,
    [0.3, 0.28, 0.08]
  );

  // ── MAGAZINE (curved) ──
  const magGroup = new THREE.Group();

  const magGeo = new THREE.BoxGeometry(0.12, 0.65, 0.1);
  const mag = new THREE.Mesh(magGeo, crystalMat);
  mag.position.set(0, -0.3, 0);
  mag.rotation.z = -0.15;
  magGroup.add(mag);
  const magWire = new THREE.Mesh(magGeo, wireCyan);
  magWire.position.copy(mag.position);
  magWire.rotation.copy(mag.rotation);
  magGroup.add(magWire);

  const magBottomGeo = new THREE.BoxGeometry(0.12, 0.3, 0.1);
  const magBottom = new THREE.Mesh(magBottomGeo, crystalMat);
  magBottom.position.set(-0.07, -0.65, 0);
  magBottom.rotation.z = -0.25;
  magGroup.add(magBottom);
  const magBottomWire = new THREE.Mesh(magBottomGeo, wireCyan);
  magBottomWire.position.copy(magBottom.position);
  magBottomWire.rotation.copy(magBottom.rotation);
  magGroup.add(magBottomWire);

  // Magazine accent stripe
  const magStripeGeo = new THREE.BoxGeometry(0.005, 0.55, 0.06);
  const magStripe = new THREE.Mesh(magStripeGeo, accentCrystalMat);
  magStripe.position.set(0.06, -0.3, 0);
  magStripe.rotation.z = -0.15;
  magGroup.add(magStripe);
  const magStripeWire = new THREE.Mesh(magStripeGeo, wireAmber);
  magStripeWire.position.copy(magStripe.position);
  magStripeWire.rotation.copy(magStripe.rotation);
  magGroup.add(magStripeWire);

  magGroup.position.set(0.15, 0, 0);
  gun.add(magGroup);

  // Magazine release
  addPart(
    new THREE.BoxGeometry(0.06, 0.04, 0.04),
    crystalMat, wireCyan,
    [0.28, -0.02, 0]
  );

  // ── TRIGGER GUARD ──
  addPart(
    new THREE.BoxGeometry(0.02, 0.12, 0.04),
    crystalMat, wireCyan,
    [0.0, -0.07, 0]
  );
  addPart(
    new THREE.BoxGeometry(0.22, 0.02, 0.04),
    crystalMat, wireCyan,
    [-0.1, -0.13, 0]
  );
  addPart(
    new THREE.BoxGeometry(0.02, 0.12, 0.04),
    crystalMat, wireCyan,
    [-0.21, -0.07, 0]
  );

  // Trigger (amber accent)
  addPart(
    new THREE.BoxGeometry(0.02, 0.08, 0.02),
    accentCrystalMat, wireAmber,
    [-0.1, -0.06, 0], [0, 0, 0.2]
  );

  // ── PISTOL GRIP ──
  addPart(
    new THREE.BoxGeometry(0.1, 0.5, 0.1),
    crystalMat, wireCyan,
    [-0.28, -0.3, 0], [0, 0, -0.25]
  );

  // Grip bottom cap
  addPart(
    new THREE.BoxGeometry(0.12, 0.04, 0.12),
    accentCrystalMat, wireAmber,
    [-0.4, -0.52, 0], [0, 0, -0.25]
  );

  // ── STOCK ──
  addPart(
    new THREE.BoxGeometry(1.5, 0.12, 0.1),
    crystalMat, wireCyan,
    [-1.2, 0.02, 0], [0, 0, 0.05]
  );

  // Stock butt plate
  addPart(
    new THREE.BoxGeometry(0.06, 0.18, 0.12),
    accentCrystalMat, wireAmber,
    [-1.95, -0.02, 0]
  );

  // Stock screws (amber accent)
  const screwGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.02, 6);
  addPart(screwGeo, accentCrystalMat, wireAmber,
    [-1.0, 0.04, 0.06], [Math.PI / 2, 0, 0]
  );
  addPart(screwGeo.clone(), accentCrystalMat, wireAmber,
    [-1.5, 0.02, 0.06], [Math.PI / 2, 0, 0]
  );

  // ── SELECTOR SWITCH ──
  addPart(
    new THREE.BoxGeometry(0.15, 0.03, 0.02),
    accentCrystalMat, wireAmber,
    [-0.1, 0.18, 0.08], [0, 0, -0.3]
  );

  // ── DUST COVER ──
  addPart(
    new THREE.BoxGeometry(0.4, 0.08, 0.02),
    crystalMat, wirePurple,
    [0.2, 0.08, 0.08]
  );

  return gun;
}

// ─── THREE.JS BACKGROUND COMPONENT ──────────────────────────────────────────
export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    gun: THREE.Group;
    targetRotY: number;
    currentRotY: number;
    targetTiltX: number;
    currentTiltX: number;
    time: number;
    animFrameId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ── SCENE ──
    const scene = new THREE.Scene();
    // No fog — let the crystal edges read cleanly

    // ── CAMERA ──
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.3, 5);
    camera.lookAt(0, 0, 0);

    // ── RENDERER ──
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // ── LIGHTS ──
    // Ambient — slightly brighter for crystal readability
    const ambient = new THREE.AmbientLight(0x12141d, 1.0);
    scene.add(ambient);

    // Key light — warm amber (#F5A623)
    const keyLight = new THREE.DirectionalLight(0xf5a623, 1.5);
    keyLight.position.set(5, 4, 3);
    scene.add(keyLight);

    // Fill light — cool cyan (#00D4FF)
    const fillLight = new THREE.DirectionalLight(0x00d4ff, 1.0);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    // Rim light — purple (#7C6EFA)
    const rimLight = new THREE.PointLight(0x7c6efa, 1.0, 20);
    rimLight.position.set(-2, -3, 4);
    scene.add(rimLight);

    // Under-glow cyan
    const underGlow = new THREE.PointLight(0x00d4ff, 0.6, 15);
    underGlow.position.set(0, -2, 2);
    scene.add(underGlow);

    // ── GUN MODEL ──
    const gun = buildGunGroup();
    gun.scale.setScalar(0.7);
    gun.position.set(0, 0, 0);
    scene.add(gun);

    // ── STATE ──
    const state = {
      renderer,
      scene,
      camera,
      gun,
      targetRotY: 0,
      currentRotY: 0,
      targetTiltX: 0,
      currentTiltX: 0,
      time: 0,
      animFrameId: 0,
    };
    sceneRef.current = state;

    // ── SCROLL HANDLER ──
    const onScroll = () => {
      const scrollFraction =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      // Full 360° mapped directly to scroll position
      state.targetRotY = scrollFraction * Math.PI * 2;
      // Subtle tilt
      state.targetTiltX = Math.sin(scrollFraction * Math.PI) * 0.1;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── RESIZE ──
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── ANIMATION LOOP ──
    const animate = () => {
      state.animFrameId = requestAnimationFrame(animate);
      state.time += 0.016;

      // Tight lerp — snaps quickly, no heavy inertia  (0.12 ≈ 8 frames)
      state.currentRotY += (state.targetRotY - state.currentRotY) * 0.12;
      state.currentTiltX += (state.targetTiltX - state.currentTiltX) * 0.12;

      // Apply rotation + very small ambient drift (reads as "alive" not "spinning")
      gun.rotation.y = state.currentRotY + Math.sin(state.time * 0.2) * 0.025;
      gun.rotation.x = state.currentTiltX + Math.sin(state.time * 0.15) * 0.015;
      gun.rotation.z = Math.sin(state.time * 0.1) * 0.008;

      // Very gentle float
      gun.position.y = Math.sin(state.time * 0.2) * 0.03;

      // Pulse rim light subtly
      rimLight.intensity = 0.8 + Math.sin(state.time * 0.4) * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    // Initial scroll position
    onScroll();

    // ── CLEANUP ──
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(state.animFrameId);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.7,
      }}
      aria-hidden="true"
    />
  );
}
