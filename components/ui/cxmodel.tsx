/**
 * CXLogo3D.tsx
 * ---------------------------------------------------------------
 * Interactive 3D render of the CX logo, built directly from the
 * source SVG's path data (exact geometry + exact hex colors).
 * 
 * - Upgraded: Ultra-slow, premium cinematic auto-rotation.
 * - Upgraded: Camera pulled back significantly for max safe-zone.
 * - Upgraded: Flawless Anime.js loop rendering on refresh.
 * ---------------------------------------------------------------
 */

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { animate, remove } from 'animejs'; 

export interface CXLogo3DHandle {
  replay: () => void;
}

export interface CXLogo3DProps {
  className?: string;
  style?: React.CSSProperties;
}

// ---------------------------------------------------------------
// Geometry constants (Extreme Smoothness)
// ---------------------------------------------------------------
const DEPTH = 46;
const BEVEL_T = 4;
const BEVEL_S = 3;
const FRONT_Z = DEPTH + BEVEL_T;

const EXTRUDE_SETTINGS = {
  depth: DEPTH,
  bevelEnabled: true,
  bevelThickness: BEVEL_T,
  bevelSize: BEVEL_S,
  bevelSegments: 12, 
  curveSegments: 128, 
};

// ---------------------------------------------------------------
// Three.js Color Management Helpers
// ---------------------------------------------------------------
function applyRendererColorManagement(renderer: THREE.WebGLRenderer) {
  const r = renderer as any;
  if ('outputColorSpace' in r) r.outputColorSpace = (THREE as any).SRGBColorSpace;
  else if ('outputEncoding' in r) r.outputEncoding = (THREE as any).sRGBEncoding;
}
function applyTextureColorManagement(tex: THREE.Texture) {
  const t = tex as any;
  if ('colorSpace' in t) t.colorSpace = (THREE as any).SRGBColorSpace;
  else t.encoding = (THREE as any).sRGBEncoding;
}

function centerAndFlip(geo: THREE.BufferGeometry) {
  geo.translate(-300, -300, 0);
  geo.scale(1, -1, 1);
  geo.computeVertexNormals();
  return geo;
}

function clamp01(t: number) {
  return Math.max(0, Math.min(1, t));
}

function gradientTexture(hexA: string, hexB: string) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 4;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 256, 0);
  g.addColorStop(0, hexA);
  g.addColorStop(1, hexB);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 4);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  applyTextureColorManagement(tex);
  return tex;
}

function applyGradientUV(geometry: THREE.BufferGeometry, x1: number, y1: number, x2: number, y2: number) {
  const pos = geometry.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i);
    const py = pos.getY(i);
    let t = ((px - x1) * dx + (py - y1) * dy) / len2;
    t = clamp01(t);
    uv[i * 2] = t;
    uv[i * 2 + 1] = 0.5;
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

interface PieceAnim {
  mesh: THREE.Mesh;
  restPos: THREE.Vector3;
  restRot: THREE.Euler;
  restScale: THREE.Vector3;
  startPos: THREE.Vector3;
  startRot: THREE.Euler;
  delay: number;
}

const CXLogo3D = forwardRef<CXLogo3DHandle, CXLogo3DProps>(function CXLogo3D(
  { className, style },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const replayRef = useRef<() => void>(() => {});

  useImperativeHandle(ref, () => ({
    replay: () => replayRef.current(),
  }));

  useEffect(() => {
    const container = containerRef.current;
    const canvasContainer = canvasContainerRef.current;
    if (!container || !canvasContainer) return;

    let width = container.clientWidth || 1;
    let height = container.clientHeight || 1;

    // -----------------------------------------------------------
    // Scene / camera / renderer
    // -----------------------------------------------------------
    const scene = new THREE.Scene();

    // Pulled camera WAY back to 1350. Massive safe zone to prevent edge clipping!
    const camera = new THREE.PerspectiveCamera(38, width / height, 1, 6000);
    camera.position.set(0, 0, 1350); 

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    applyRendererColorManagement(renderer);
    
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1; 
    
    canvasContainer.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.cursor = 'grab';

    // -----------------------------------------------------------
    // Premium 4-Point Studio Lighting
    // -----------------------------------------------------------
    scene.add(new THREE.AmbientLight(0xffffff, 1.4));

    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(-200, 300, 600);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xe6f0ff, 1.2);
    fill.position.set(400, -200, 400);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffeacc, 2.8);
    rim.position.set(200, 500, -400);
    scene.add(rim);

    const spec = new THREE.PointLight(0xffffff, 1.5);
    spec.position.set(100, 150, 450);
    scene.add(spec);

    // -----------------------------------------------------------
    // Logo geometry & Premium Materials
    // -----------------------------------------------------------
    const logo = new THREE.Group();
    scene.add(logo);

    const cShape = new THREE.Shape();
    cShape.moveTo(264, 110);
    cShape.absarc(264, 300, 190, -Math.PI / 2, Math.PI / 2, true);
    cShape.lineTo(264, 388);
    cShape.absarc(264, 300, 88, Math.PI / 2, -Math.PI / 2, false);
    cShape.lineTo(264, 110);
    cShape.closePath();

    const cGeo = centerAndFlip(new THREE.ExtrudeGeometry(cShape, EXTRUDE_SETTINGS));
    const cMat = new THREE.MeshPhysicalMaterial({
      color: 0x1c1917,
      metalness: 0.8,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05, 
      side: THREE.DoubleSide,
    });
    const cMesh = new THREE.Mesh(cGeo, cMat);

    const xMatProps = {
      metalness: 0.2, 
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05, 
      side: THREE.DoubleSide,
    };

    const xTopShape = new THREE.Shape();
    xTopShape.moveTo(344, 110);
    xTopShape.lineTo(424, 110);
    xTopShape.lineTo(570, 282);
    xTopShape.lineTo(490, 282);
    xTopShape.closePath();
    const xTopGeo = new THREE.ExtrudeGeometry(xTopShape, EXTRUDE_SETTINGS);
    applyGradientUV(xTopGeo, 370, 110, 475, 248);
    centerAndFlip(xTopGeo);

    const capTopShape = new THREE.Shape();
    capTopShape.absarc(348, 110, 42, 0, Math.PI * 2, false);
    const capTopGeo = new THREE.ExtrudeGeometry(capTopShape, EXTRUDE_SETTINGS);
    applyGradientUV(capTopGeo, 370, 110, 475, 248);
    centerAndFlip(capTopGeo);

    const xTopMat = new THREE.MeshPhysicalMaterial({
      map: gradientTexture('#D4620A', '#8C3B08'),
      ...xMatProps
    });
    const xTopArmMesh = new THREE.Mesh(xTopGeo, xTopMat);
    const capTopMesh = new THREE.Mesh(capTopGeo, xTopMat);

    const xBotShape = new THREE.Shape();
    xBotShape.moveTo(344, 490);
    xBotShape.lineTo(424, 490);
    xBotShape.lineTo(570, 318);
    xBotShape.lineTo(490, 318);
    xBotShape.closePath();
    const xBotGeo = new THREE.ExtrudeGeometry(xBotShape, EXTRUDE_SETTINGS);
    applyGradientUV(xBotGeo, 370, 490, 475, 352);
    centerAndFlip(xBotGeo);

    const capBotShape = new THREE.Shape();
    capBotShape.absarc(348, 490, 42, 0, Math.PI * 2, false);
    const capBotGeo = new THREE.ExtrudeGeometry(capBotShape, EXTRUDE_SETTINGS);
    applyGradientUV(capBotGeo, 370, 490, 475, 352);
    centerAndFlip(capBotGeo);

    const xBotMat = new THREE.MeshPhysicalMaterial({
      map: gradientTexture('#E8823A', '#D4620A'),
      ...xMatProps
    });
    const xBotArmMesh = new THREE.Mesh(xBotGeo, xBotMat);
    const capBotMesh = new THREE.Mesh(capBotGeo, xBotMat);

    const dotMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4620a,
      ...xMatProps
    });

    const orbitGeo = new THREE.SphereGeometry(16, 48, 48);
    orbitGeo.translate(264 - 300, 0, FRONT_Z + 6);
    const orbitMesh = new THREE.Mesh(orbitGeo, dotMat);

    const sparkX = 566 - 300;
    const sparkZ = FRONT_Z + 5;
    const sparkOuterGeo = new THREE.SphereGeometry(13, 48, 48);
    sparkOuterGeo.translate(sparkX, 0, sparkZ);
    const sparkOuterMesh = new THREE.Mesh(sparkOuterGeo, dotMat);

    const sparkInnerGeo = new THREE.SphereGeometry(6, 32, 32);
    sparkInnerGeo.translate(sparkX, 0, sparkZ + 7);
    const sparkInnerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sparkInnerMesh = new THREE.Mesh(sparkInnerGeo, sparkInnerMat);

    [cMesh, xTopArmMesh, capTopMesh, xBotArmMesh, capBotMesh, orbitMesh, sparkOuterMesh, sparkInnerMesh].forEach(
      (m) => logo.add(m)
    );

    // -----------------------------------------------------------
    // Smart Complex Assembly
    // -----------------------------------------------------------
    const pieces: PieceAnim[] = [
      cMesh, xTopArmMesh, capTopMesh, xBotArmMesh, capBotMesh, orbitMesh, sparkOuterMesh, sparkInnerMesh
    ].map((mesh, i) => ({
      mesh,
      restPos: mesh.position.clone(),
      restRot: mesh.rotation.clone(),
      restScale: mesh.scale.clone(),
      startPos: new THREE.Vector3(),
      startRot: new THREE.Euler(),
      delay: i * 120,
    }));

    function playAssembly() {
      // 1. Model Assembly Animation
      pieces.forEach((p) => {
        remove(p.mesh.position);
        remove(p.mesh.rotation);
        remove(p.mesh.scale);

        const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        const dist = 800 + Math.random() * 500; 
        p.startPos.copy(p.restPos).add(dir.multiplyScalar(dist));
        
        p.startRot.set(
          p.restRot.x + (Math.random() - 0.5) * Math.PI * 8,
          p.restRot.y + (Math.random() - 0.5) * Math.PI * 8,
          p.restRot.z + (Math.random() - 0.5) * Math.PI * 8
        );

        p.mesh.position.copy(p.startPos);
        p.mesh.rotation.copy(p.startRot);
        p.mesh.scale.set(0.001, 0.001, 0.001);

        animate(p.mesh.position, {
          x: p.restPos.x,
          y: p.restPos.y,
          z: p.restPos.z,
          duration: 2500,
          ease: 'outElastic(1.2, 0.4)',
          delay: p.delay
        });

        animate(p.mesh.rotation, {
          x: p.restRot.x,
          y: p.restRot.y,
          z: p.restRot.z,
          duration: 2200,
          ease: 'outExpo', 
          delay: p.delay
        });

        animate(p.mesh.scale, {
          x: p.restScale.x,
          y: p.restScale.y,
          z: p.restScale.z,
          duration: 2000,
          ease: 'outBack', 
          delay: p.delay
        });
      });
    }

    replayRef.current = playAssembly;
    playAssembly(); 

    // -----------------------------------------------------------
    // Interaction & Cinematic Auto-Rotation
    // -----------------------------------------------------------
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    
    let targetRotY = -0.25; 
    let targetRotX = 0.15;
    let curRotY = targetRotY;
    let curRotX = targetRotX;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      renderer.domElement.style.cursor = 'grabbing';
    };
    const onPointerUp = () => {
      dragging = false;
      renderer.domElement.style.cursor = 'grab';
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      targetRotY += dx * 0.008;
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX + dy * 0.008));
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);

    // -----------------------------------------------------------
    // Responsive sizing
    // -----------------------------------------------------------
    const resizeObserver = new ResizeObserver(() => {
      if (!canvasContainer) return;
      width = canvasContainer.clientWidth || 1;
      height = canvasContainer.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(canvasContainer);

    // -----------------------------------------------------------
    // Render loop (Ultra-Smooth Slow Spin)
    // -----------------------------------------------------------
    let rafId = 0;
    function renderLoop() {
      rafId = requestAnimationFrame(renderLoop);

      // Slower, highly premium cinematic rotation speed
      if (!dragging) {
        targetRotY += 0.0015; 
      }

      curRotY += (targetRotY - curRotY) * 0.06;
      curRotX += (targetRotX - curRotX) * 0.06;
      logo.rotation.y = curRotY;
      logo.rotation.x = curRotX;

      renderer.render(scene, camera);
    }
    renderLoop();

    // -----------------------------------------------------------
    // Cleanup
    // -----------------------------------------------------------
    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);

      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) mat.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === canvasContainer) {
        canvasContainer.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', background: 'transparent', ...style }}
    >
      {/* 3D Canvas Layer */}
      <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
});

export default CXLogo3D;