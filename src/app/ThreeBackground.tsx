'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── PROCEDURAL AK-47 GUN MODEL ──────────────────────────────────────────────
// Built entirely from BoxGeometry + CylinderGeometry primitives
// Lit with amber + cyan accent colors matching the portfolio palette

function buildGunGroup(): THREE.Group {
  const gun = new THREE.Group();

  // Materials matching portfolio palette
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    roughness: 0.35,
    metalness: 0.85,
    emissive: 0x0a0a15,
    emissiveIntensity: 0.15,
  });

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x2c2c3a,
    roughness: 0.2,
    metalness: 0.95,
    emissive: 0x050510,
    emissiveIntensity: 0.1,
  });

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x5a3a1a,
    roughness: 0.7,
    metalness: 0.1,
    emissive: 0x1a0e05,
    emissiveIntensity: 0.05,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xf5a623,
    roughness: 0.3,
    metalness: 0.7,
    emissive: 0xf5a623,
    emissiveIntensity: 0.3,
  });

  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x111118,
    roughness: 0.4,
    metalness: 0.9,
  });

  // ── BARREL ──
  const barrelGeo = new THREE.CylinderGeometry(0.06, 0.07, 3.2, 16);
  const barrel = new THREE.Mesh(barrelGeo, metalMat);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(2.2, 0.15, 0);
  gun.add(barrel);

  // Barrel inner bore
  const boreGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.3, 12);
  const bore = new THREE.Mesh(boreGeo, darkMat);
  bore.rotation.z = Math.PI / 2;
  bore.position.set(2.25, 0.15, 0);
  gun.add(bore);

  // Muzzle brake
  const muzzleGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.35, 8);
  const muzzle = new THREE.Mesh(muzzleGeo, metalMat);
  muzzle.rotation.z = Math.PI / 2;
  muzzle.position.set(3.85, 0.15, 0);
  gun.add(muzzle);

  // Muzzle brake slots
  for (let i = 0; i < 4; i++) {
    const slotGeo = new THREE.BoxGeometry(0.25, 0.02, 0.04);
    const slot = new THREE.Mesh(slotGeo, darkMat);
    const angle = (Math.PI * 2 * i) / 4;
    slot.position.set(3.85, 0.15 + Math.cos(angle) * 0.07, Math.sin(angle) * 0.07);
    gun.add(slot);
  }

  // Front sight post
  const fSightGeo = new THREE.BoxGeometry(0.02, 0.15, 0.02);
  const fSight = new THREE.Mesh(fSightGeo, metalMat);
  fSight.position.set(3.5, 0.32, 0);
  gun.add(fSight);

  // Front sight base
  const fSightBaseGeo = new THREE.BoxGeometry(0.08, 0.04, 0.06);
  const fSightBase = new THREE.Mesh(fSightBaseGeo, metalMat);
  fSightBase.position.set(3.5, 0.22, 0);
  gun.add(fSightBase);

  // ── GAS TUBE ──
  const gasTubeGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8);
  const gasTube = new THREE.Mesh(gasTubeGeo, metalMat);
  gasTube.rotation.z = Math.PI / 2;
  gasTube.position.set(1.6, 0.3, 0);
  gun.add(gasTube);

  // ── HANDGUARD (wood) ──
  const hgUpperGeo = new THREE.BoxGeometry(1.5, 0.1, 0.12);
  const hgUpper = new THREE.Mesh(hgUpperGeo, woodMat);
  hgUpper.position.set(1.35, 0.05, 0);
  gun.add(hgUpper);

  const hgLowerGeo = new THREE.BoxGeometry(1.5, 0.1, 0.14);
  const hgLower = new THREE.Mesh(hgLowerGeo, woodMat);
  hgLower.position.set(1.35, -0.05, 0);
  gun.add(hgLower);

  // Handguard metal band
  const bandGeo = new THREE.BoxGeometry(0.04, 0.22, 0.18);
  const band1 = new THREE.Mesh(bandGeo, metalMat);
  band1.position.set(0.65, 0, 0);
  gun.add(band1);

  const band2 = new THREE.Mesh(bandGeo.clone(), metalMat);
  band2.position.set(2.05, 0, 0);
  gun.add(band2);

  // ── RECEIVER / BODY ──
  const receiverGeo = new THREE.BoxGeometry(1.2, 0.22, 0.14);
  const receiver = new THREE.Mesh(receiverGeo, bodyMat);
  receiver.position.set(0.1, 0.12, 0);
  gun.add(receiver);

  // Receiver top cover
  const topCoverGeo = new THREE.BoxGeometry(1.0, 0.04, 0.12);
  const topCover = new THREE.Mesh(topCoverGeo, metalMat);
  topCover.position.set(0.0, 0.25, 0);
  gun.add(topCover);

  // Rear sight
  const rSightGeo = new THREE.BoxGeometry(0.06, 0.1, 0.08);
  const rSight = new THREE.Mesh(rSightGeo, metalMat);
  rSight.position.set(-0.2, 0.33, 0);
  gun.add(rSight);

  // Rear sight leaf
  const rSightLeafGeo = new THREE.BoxGeometry(0.02, 0.08, 0.06);
  const rSightLeaf = new THREE.Mesh(rSightLeafGeo, accentMat);
  rSightLeaf.position.set(-0.2, 0.36, 0);
  gun.add(rSightLeaf);

  // Charging handle
  const chGeo = new THREE.BoxGeometry(0.08, 0.06, 0.03);
  const ch = new THREE.Mesh(chGeo, metalMat);
  ch.position.set(0.3, 0.28, 0.08);
  gun.add(ch);

  // ── MAGAZINE (curved) ──
  const magGroup = new THREE.Group();
  // Main magazine body
  const magGeo = new THREE.BoxGeometry(0.12, 0.65, 0.1);
  const mag = new THREE.Mesh(magGeo, metalMat);
  mag.position.set(0, -0.3, 0);
  mag.rotation.z = -0.15;
  magGroup.add(mag);
  
  // Magazine curve bottom
  const magBottomGeo = new THREE.BoxGeometry(0.12, 0.3, 0.1);
  const magBottom = new THREE.Mesh(magBottomGeo, metalMat);
  magBottom.position.set(-0.07, -0.65, 0);
  magBottom.rotation.z = -0.25;
  magGroup.add(magBottom);

  // Magazine accent stripe
  const magStripeGeo = new THREE.BoxGeometry(0.005, 0.55, 0.06);
  const magStripe = new THREE.Mesh(magStripeGeo, accentMat);
  magStripe.position.set(0.06, -0.3, 0);
  magStripe.rotation.z = -0.15;
  magGroup.add(magStripe);

  magGroup.position.set(0.15, 0, 0);
  gun.add(magGroup);

  // Magazine release
  const magRelGeo = new THREE.BoxGeometry(0.06, 0.04, 0.04);
  const magRel = new THREE.Mesh(magRelGeo, metalMat);
  magRel.position.set(0.28, -0.02, 0);
  gun.add(magRel);

  // ── TRIGGER GUARD ──
  const tgFrontGeo = new THREE.BoxGeometry(0.02, 0.12, 0.04);
  const tgFront = new THREE.Mesh(tgFrontGeo, metalMat);
  tgFront.position.set(0.0, -0.07, 0);
  gun.add(tgFront);

  const tgBottomGeo = new THREE.BoxGeometry(0.22, 0.02, 0.04);
  const tgBottom = new THREE.Mesh(tgBottomGeo, metalMat);
  tgBottom.position.set(-0.1, -0.13, 0);
  gun.add(tgBottom);

  const tgBackGeo = new THREE.BoxGeometry(0.02, 0.12, 0.04);
  const tgBack = new THREE.Mesh(tgBackGeo, metalMat);
  tgBack.position.set(-0.21, -0.07, 0);
  gun.add(tgBack);

  // Trigger
  const trigGeo = new THREE.BoxGeometry(0.02, 0.08, 0.02);
  const trig = new THREE.Mesh(trigGeo, accentMat);
  trig.position.set(-0.1, -0.06, 0);
  trig.rotation.z = 0.2;
  gun.add(trig);

  // ── PISTOL GRIP (wood) ──
  const gripGeo = new THREE.BoxGeometry(0.1, 0.5, 0.1);
  const grip = new THREE.Mesh(gripGeo, woodMat);
  grip.position.set(-0.28, -0.3, 0);
  grip.rotation.z = -0.25;
  gun.add(grip);

  // Grip bottom cap
  const gripCapGeo = new THREE.BoxGeometry(0.12, 0.04, 0.12);
  const gripCap = new THREE.Mesh(gripCapGeo, metalMat);
  gripCap.position.set(-0.4, -0.52, 0);
  gripCap.rotation.z = -0.25;
  gun.add(gripCap);

  // ── STOCK (wood) ──
  const stockGeo = new THREE.BoxGeometry(1.5, 0.12, 0.1);
  const stock = new THREE.Mesh(stockGeo, woodMat);
  stock.position.set(-1.2, 0.02, 0);
  stock.rotation.z = 0.05;
  gun.add(stock);

  // Stock butt plate (thicker end)
  const buttGeo = new THREE.BoxGeometry(0.06, 0.18, 0.12);
  const butt = new THREE.Mesh(buttGeo, metalMat);
  butt.position.set(-1.95, -0.02, 0);
  gun.add(butt);

  // Stock screw accents
  const screwGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.02, 6);
  const screw1 = new THREE.Mesh(screwGeo, accentMat);
  screw1.rotation.x = Math.PI / 2;
  screw1.position.set(-1.0, 0.04, 0.06);
  gun.add(screw1);

  const screw2 = new THREE.Mesh(screwGeo.clone(), accentMat);
  screw2.rotation.x = Math.PI / 2;
  screw2.position.set(-1.5, 0.02, 0.06);
  gun.add(screw2);

  // ── SELECTOR SWITCH ──
  const selectorGeo = new THREE.BoxGeometry(0.15, 0.03, 0.02);
  const selector = new THREE.Mesh(selectorGeo, accentMat);
  selector.position.set(-0.1, 0.18, 0.08);
  selector.rotation.z = -0.3;
  gun.add(selector);

  // ── DUST COVER ──
  const dustCoverGeo = new THREE.BoxGeometry(0.4, 0.08, 0.02);
  const dustCover = new THREE.Mesh(dustCoverGeo, bodyMat);
  dustCover.position.set(0.2, 0.08, 0.08);
  gun.add(dustCover);

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
    scene.fog = new THREE.FogExp2(0x12141d, 0.08);

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
    renderer.toneMappingExposure = 0.8;
    containerRef.current.appendChild(renderer.domElement);

    // ── LIGHTS ──
    // Ambient
    const ambient = new THREE.AmbientLight(0x12141d, 0.5);
    scene.add(ambient);

    // Key light — warm amber (matches --amber: #F5A623)
    const keyLight = new THREE.DirectionalLight(0xf5a623, 1.2);
    keyLight.position.set(5, 4, 3);
    scene.add(keyLight);

    // Fill light — cool cyan (#00D4FF)
    const fillLight = new THREE.DirectionalLight(0x00d4ff, 0.6);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    // Rim light — subtle purple (#7C6EFA)
    const rimLight = new THREE.PointLight(0x7c6efa, 0.8, 20);
    rimLight.position.set(-2, -3, 4);
    scene.add(rimLight);

    // Under-glow amber
    const underGlow = new THREE.PointLight(0xf5a623, 0.4, 15);
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
      // Full 360° rotation across the page
      state.targetRotY = scrollFraction * Math.PI * 2;
      // Subtle tilt based on scroll
      state.targetTiltX = Math.sin(scrollFraction * Math.PI) * 0.15;
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

      // Smooth lerp towards target rotation
      state.currentRotY += (state.targetRotY - state.currentRotY) * 0.04;
      state.currentTiltX += (state.targetTiltX - state.currentTiltX) * 0.04;

      // Apply rotation + ambient drift
      gun.rotation.y = state.currentRotY + Math.sin(state.time * 0.3) * 0.08;
      gun.rotation.x =
        state.currentTiltX + Math.sin(state.time * 0.2) * 0.03;
      gun.rotation.z = Math.sin(state.time * 0.15) * 0.02;

      // Gentle floating
      gun.position.y = Math.sin(state.time * 0.25) * 0.08;
      gun.position.x = Math.sin(state.time * 0.18) * 0.05;

      // Pulse rim light
      rimLight.intensity = 0.6 + Math.sin(state.time * 0.5) * 0.3;

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

      // Dispose geometries and materials
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
        opacity: 0.35,
      }}
      aria-hidden="true"
    />
  );
}
