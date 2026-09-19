import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ConsoleMode, JoyconTheme } from "../types";

interface Switch2MeshProps {
  mode: ConsoleMode;
  theme: JoyconTheme;
  wireframe: boolean;
  docked: boolean;
  onJoyconClick?: (side: "left" | "right") => void;
  interactiveAngle?: { x: number; y: number };
}

export const Switch2Mesh: React.FC<Switch2MeshProps> = ({
  mode,
  theme,
  wireframe,
  docked,
  onJoyconClick,
  interactiveAngle,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Mesh component refs for animations
  const consoleGroupRef = useRef<THREE.Group | null>(null);
  const leftJoyconRef = useRef<THREE.Group | null>(null);
  const rightJoyconRef = useRef<THREE.Group | null>(null);
  const dockGroupRef = useRef<THREE.Group | null>(null);
  const kickstandRef = useRef<THREE.Mesh | null>(null);
  const screenMeshRef = useRef<THREE.Mesh | null>(null);
  const dockLedRef = useRef<THREE.PointLight | null>(null);

  // Colors based on theme (Sleek Matte Black Joy-Cons with Red & Blue thumbsticks)
  const getThemeColors = () => {
    return { 
      left: 0x16171b, 
      right: 0x16171b, 
      body: 0x18191e, 
      accent: 0x2c2d33,
      leftStick: 0xff3b30,
      rightStick: 0x00c7ff
    };
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 14.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(8, 10, 12);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00c7ff, 1.5);
    rimLight.position.set(-10, -8, -6);
    scene.add(rimLight);

    const topLight = new THREE.DirectionalLight(0xff3b30, 0.8);
    topLight.position.set(10, 8, -5);
    scene.add(topLight);

    // Master Console Group
    const consoleGroup = new THREE.Group();
    consoleGroupRef.current = consoleGroup;
    scene.add(consoleGroup);

    const colors = getThemeColors();

    // 1. Tablet Body (Switch 2 Console)
    const tabletWidth = 9.4;
    const tabletHeight = 5.2;
    const tabletDepth = 0.65;

    const bodyGeo = new THREE.BoxGeometry(tabletWidth, tabletHeight, tabletDepth);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: colors.body,
      roughness: 0.35,
      metalness: 0.25,
      wireframe: wireframe,
    });
    const tabletMesh = new THREE.Mesh(bodyGeo, bodyMat);
    consoleGroup.add(tabletMesh);

    // Screen Bezel & Glass
    const screenGeo = new THREE.PlaneGeometry(8.2, 4.6);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x050508,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
      wireframe: wireframe,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = tabletDepth / 2 + 0.01;
    screenMeshRef.current = screenMesh;
    consoleGroup.add(screenMesh);

    // Speaker Grilles on Tablet
    [-3.8, 3.8].forEach((xPos) => {
      const grillGeo = new THREE.BoxGeometry(0.35, 0.08, 0.05);
      const grillMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0c });
      const grill = new THREE.Mesh(grillGeo, grillMat);
      grill.position.set(xPos, -2.1, tabletDepth / 2 + 0.02);
      consoleGroup.add(grill);
    });

    // Top Vents & Ports
    const ventGeo = new THREE.BoxGeometry(2.4, 0.1, tabletDepth - 0.15);
    const ventMat = new THREE.MeshStandardMaterial({ color: 0x111215, roughness: 0.7 });
    const vent = new THREE.Mesh(ventGeo, ventMat);
    vent.position.set(0.5, tabletHeight / 2 - 0.02, 0);
    consoleGroup.add(vent);

    // Game Card Slot & USB-C Top Port
    const cardSlotGeo = new THREE.BoxGeometry(0.9, 0.08, 0.3);
    const cardSlotMat = new THREE.MeshStandardMaterial({ color: 0x25262c });
    const cardSlot = new THREE.Mesh(cardSlotGeo, cardSlotMat);
    cardSlot.position.set(-2.2, tabletHeight / 2 - 0.02, 0);
    consoleGroup.add(cardSlot);

    // Power & Volume buttons
    const pwrBtnGeo = new THREE.BoxGeometry(0.35, 0.06, 0.12);
    const pwrBtn = new THREE.Mesh(pwrBtnGeo, cardSlotMat);
    pwrBtn.position.set(-3.2, tabletHeight / 2 + 0.02, 0);
    consoleGroup.add(pwrBtn);

    const volBtnGeo = new THREE.BoxGeometry(0.65, 0.06, 0.12);
    const volBtn = new THREE.Mesh(volBtnGeo, cardSlotMat);
    volBtn.position.set(-2.5, tabletHeight / 2 + 0.02, 0);
    consoleGroup.add(volBtn);

    // Kickstand on back of tablet
    const kickstandGeo = new THREE.BoxGeometry(tabletWidth - 0.6, 2.2, 0.08);
    const kickstandMat = new THREE.MeshStandardMaterial({
      color: 0x282a32,
      metalness: 0.6,
      roughness: 0.25,
      wireframe: wireframe,
    });
    const kickstand = new THREE.Mesh(kickstandGeo, kickstandMat);
    kickstand.position.set(0, -1.2, -tabletDepth / 2 - 0.04);
    kickstandRef.current = kickstand;
    consoleGroup.add(kickstand);

    // 2. Left Joy-Con Group
    const leftJoycon = new THREE.Group();
    leftJoyconRef.current = leftJoycon;
    const joyconW = 1.9;
    const joyconH = 5.2;
    const joyconD = 0.85;

    const leftGeo = new THREE.BoxGeometry(joyconW, joyconH, joyconD);
    const leftMat = new THREE.MeshStandardMaterial({
      color: colors.left,
      roughness: 0.4,
      metalness: 0.15,
      wireframe: wireframe,
    });
    const leftMesh = new THREE.Mesh(leftGeo, leftMat);
    leftJoycon.add(leftMesh);

    // Left Joy-Con Stick
    const stickBaseGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.25, 24);
    const stickCapGeo = new THREE.CylinderGeometry(0.52, 0.46, 0.12, 24);
    const stickMat = new THREE.MeshStandardMaterial({ color: 0x15161a, roughness: 0.6 });
    // Left Joy-Con Stick with Neon Red Ring
    const leftStickRingGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.08, 24);
    const leftStickRingMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });
    const leftStickRing = new THREE.Mesh(leftStickRingGeo, leftStickRingMat);
    leftStickRing.rotation.x = Math.PI / 2;
    leftStickRing.position.set(0, 1.2, joyconD / 2 + 0.04);
    leftJoycon.add(leftStickRing);

    const leftStickBase = new THREE.Mesh(stickBaseGeo, stickMat);
    leftStickBase.rotation.x = Math.PI / 2;
    leftStickBase.position.set(0, 1.2, joyconD / 2 + 0.1);
    leftJoycon.add(leftStickBase);

    const leftStickCap = new THREE.Mesh(stickCapGeo, stickMat);
    leftStickCap.rotation.x = Math.PI / 2;
    leftStickCap.position.set(0, 1.2, joyconD / 2 + 0.22);
    leftJoycon.add(leftStickCap);

    // Left D-Pad / Directional buttons
    const dpadPos = [
      { x: 0, y: -0.6 },
      { x: -0.38, y: -0.98 },
      { x: 0.38, y: -0.98 },
      { x: 0, y: -1.36 },
    ];
    dpadPos.forEach((p) => {
      const btnGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16);
      const btnMat = new THREE.MeshStandardMaterial({ color: 0x18191f, roughness: 0.3 });
      const btn = new THREE.Mesh(btnGeo, btnMat);
      btn.rotation.x = Math.PI / 2;
      btn.position.set(p.x, p.y, joyconD / 2 + 0.05);
      leftJoycon.add(btn);
    });

    // Minus Button & Capture Button
    const minusGeo = new THREE.BoxGeometry(0.24, 0.06, 0.08);
    const minusBtn = new THREE.Mesh(minusGeo, stickMat);
    minusBtn.position.set(0.4, 2.1, joyconD / 2 + 0.04);
    leftJoycon.add(minusBtn);

    const capGeo = new THREE.BoxGeometry(0.22, 0.22, 0.06);
    const capBtn = new THREE.Mesh(capGeo, stickMat);
    capBtn.position.set(0.35, -1.9, joyconD / 2 + 0.04);
    leftJoycon.add(capBtn);

    // L & ZL Triggers
    const zlGeo = new THREE.BoxGeometry(1.2, 0.25, 0.5);
    const zlMat = new THREE.MeshStandardMaterial({ color: 0x111215, roughness: 0.5 });
    const zlTrigger = new THREE.Mesh(zlGeo, zlMat);
    zlTrigger.position.set(-0.15, joyconH / 2 + 0.1, -0.15);
    leftJoycon.add(zlTrigger);

    leftJoycon.position.set(-(tabletWidth / 2 + joyconW / 2 + 0.05), 0, 0.05);
    scene.add(leftJoycon);

    // 3. Right Joy-Con Group
    const rightJoycon = new THREE.Group();
    rightJoyconRef.current = rightJoycon;
    const rightMat = new THREE.MeshStandardMaterial({
      color: colors.right,
      roughness: 0.4,
      metalness: 0.15,
      wireframe: wireframe,
    });
    const rightMesh = new THREE.Mesh(leftGeo, rightMat);
    rightJoycon.add(rightMesh);

    // Right Action Buttons (A, B, X, Y)
    const abxyPos = [
      { x: 0, y: 1.55, col: 0x22242a }, // X
      { x: -0.38, y: 1.18, col: 0x22242a }, // Y
      { x: 0.38, y: 1.18, col: 0x22242a }, // A
      { x: 0, y: 0.8, col: 0x22242a }, // B
    ];
    abxyPos.forEach((p) => {
      const btnGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16);
      const btnMat = new THREE.MeshStandardMaterial({ color: p.col, roughness: 0.3 });
      const btn = new THREE.Mesh(btnGeo, btnMat);
      btn.rotation.x = Math.PI / 2;
      btn.position.set(p.x, p.y, joyconD / 2 + 0.05);
      rightJoycon.add(btn);
    });

    // Right Joy-Con Stick with Neon Blue Ring
    const rightStickRingGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.08, 24);
    const rightStickRingMat = new THREE.MeshBasicMaterial({ color: 0x00c7ff });
    const rightStickRing = new THREE.Mesh(rightStickRingGeo, rightStickRingMat);
    rightStickRing.rotation.x = Math.PI / 2;
    rightStickRing.position.set(0, -0.6, joyconD / 2 + 0.04);
    rightJoycon.add(rightStickRing);

    const rightStickBase = new THREE.Mesh(stickBaseGeo, stickMat);
    rightStickBase.rotation.x = Math.PI / 2;
    rightStickBase.position.set(0, -0.6, joyconD / 2 + 0.1);
    rightJoycon.add(rightStickBase);

    const rightStickCap = new THREE.Mesh(stickCapGeo, stickMat);
    rightStickCap.rotation.x = Math.PI / 2;
    rightStickCap.position.set(0, -0.6, joyconD / 2 + 0.22);
    rightJoycon.add(rightStickCap);

    // Plus Button & Home Button
    const plusGeo = new THREE.BoxGeometry(0.24, 0.24, 0.08);
    const plusBtn = new THREE.Mesh(plusGeo, stickMat);
    plusBtn.position.set(-0.4, 2.1, joyconD / 2 + 0.04);
    rightJoycon.add(plusBtn);

    const homeRingGeo = new THREE.RingGeometry(0.12, 0.18, 24);
    const homeRingMat = new THREE.MeshBasicMaterial({ color: 0x00c7ff, side: THREE.DoubleSide });
    const homeRing = new THREE.Mesh(homeRingGeo, homeRingMat);
    homeRing.position.set(-0.35, -1.9, joyconD / 2 + 0.04);
    rightJoycon.add(homeRing);

    // R & ZR Triggers
    const zrTrigger = new THREE.Mesh(zlGeo, zlMat);
    zrTrigger.position.set(0.15, joyconH / 2 + 0.1, -0.15);
    rightJoycon.add(zrTrigger);

    rightJoycon.position.set(tabletWidth / 2 + joyconW / 2 + 0.05, 0, 0.05);
    scene.add(rightJoycon);

    // 4. Switch 2 Dock (for Docked Mode)
    const dockGroup = new THREE.Group();
    dockGroupRef.current = dockGroup;
    dockGroup.position.set(0, -3.2, 0);
    dockGroup.visible = docked;

    const dockBodyGeo = new THREE.BoxGeometry(10.2, 3.8, 2.4);
    const dockBodyMat = new THREE.MeshStandardMaterial({
      color: 0x141519,
      roughness: 0.3,
      metalness: 0.4,
      wireframe: wireframe,
    });
    const dockMesh = new THREE.Mesh(dockBodyGeo, dockBodyMat);
    dockGroup.add(dockMesh);

    // Dock Status LED
    const ledGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const dockLed = new THREE.Mesh(ledGeo, ledMat);
    dockLed.position.set(-4.5, -1.2, 1.22);
    dockGroup.add(dockLed);

    const dockPointLight = new THREE.PointLight(0x10b981, 2.5, 3.5);
    dockPointLight.position.set(-4.5, -1.2, 1.4);
    dockLedRef.current = dockPointLight;
    dockGroup.add(dockPointLight);

    // Dock Front Glossy Nintendo Logo Plate
    const dockLogoGeo = new THREE.PlaneGeometry(1.4, 1.4);
    const dockLogoMat = new THREE.MeshStandardMaterial({
      color: 0x22242b,
      metalness: 0.8,
      roughness: 0.1,
    });
    const dockLogo = new THREE.Mesh(dockLogoGeo, dockLogoMat);
    dockLogo.position.set(0, 0, 1.22);
    dockGroup.add(dockLogo);

    scene.add(dockGroup);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle breathing or idle hover
      if (consoleGroupRef.current) {
        if (mode === "handheld") {
          consoleGroupRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
          // Smooth rotation from interactive input
          if (interactiveAngle) {
            consoleGroupRef.current.rotation.y = THREE.MathUtils.lerp(
              consoleGroupRef.current.rotation.y,
              interactiveAngle.y * 0.4,
              0.08
            );
            consoleGroupRef.current.rotation.x = THREE.MathUtils.lerp(
              consoleGroupRef.current.rotation.x,
              interactiveAngle.x * 0.3,
              0.08
            );
          }
        } else if (mode === "tabletop") {
          // Tilt back slightly on kickstand
          consoleGroupRef.current.position.y = -0.4;
          consoleGroupRef.current.rotation.x = -0.18;
          consoleGroupRef.current.rotation.y = interactiveAngle ? interactiveAngle.y * 0.2 : 0;
        } else if (mode === "docked") {
          // Settled in dock
          consoleGroupRef.current.position.y = -0.8;
          consoleGroupRef.current.rotation.set(0, 0, 0);
        }
      }

      // Handle Joy-Con Detach Positions
      if (leftJoyconRef.current && rightJoyconRef.current) {
        if (mode === "tabletop") {
          // Detached Joy-Cons float forward & turned inward
          const targetLX = -6.8 + Math.sin(elapsedTime * 2) * 0.05;
          const targetRX = 6.8 - Math.sin(elapsedTime * 2) * 0.05;
          leftJoyconRef.current.position.x = THREE.MathUtils.lerp(leftJoyconRef.current.position.x, targetLX, 0.1);
          rightJoyconRef.current.position.x = THREE.MathUtils.lerp(rightJoyconRef.current.position.x, targetRX, 0.1);

          leftJoyconRef.current.position.z = THREE.MathUtils.lerp(leftJoyconRef.current.position.z, 2.2, 0.1);
          rightJoyconRef.current.position.z = THREE.MathUtils.lerp(rightJoyconRef.current.position.z, 2.2, 0.1);

          leftJoyconRef.current.rotation.y = THREE.MathUtils.lerp(leftJoyconRef.current.rotation.y, 0.32, 0.1);
          rightJoyconRef.current.rotation.y = THREE.MathUtils.lerp(rightJoyconRef.current.rotation.y, -0.32, 0.1);
        } else {
          // Snapped attached position
          const attachedLX = -(tabletWidth / 2 + joyconW / 2 + 0.05);
          const attachedRX = tabletWidth / 2 + joyconW / 2 + 0.05;
          leftJoyconRef.current.position.x = THREE.MathUtils.lerp(leftJoyconRef.current.position.x, attachedLX, 0.15);
          rightJoyconRef.current.position.x = THREE.MathUtils.lerp(rightJoyconRef.current.position.x, attachedRX, 0.15);

          leftJoyconRef.current.position.z = THREE.MathUtils.lerp(leftJoyconRef.current.position.z, 0.05, 0.15);
          rightJoyconRef.current.position.z = THREE.MathUtils.lerp(rightJoyconRef.current.position.z, 0.05, 0.15);

          leftJoyconRef.current.rotation.y = THREE.MathUtils.lerp(leftJoyconRef.current.rotation.y, 0, 0.15);
          rightJoyconRef.current.rotation.y = THREE.MathUtils.lerp(rightJoyconRef.current.rotation.y, 0, 0.15);
        }
      }

      // Kickstand animation
      if (kickstandRef.current) {
        const targetRot = mode === "tabletop" ? 0.65 : 0;
        kickstandRef.current.rotation.x = THREE.MathUtils.lerp(kickstandRef.current.rotation.x, targetRot, 0.1);
      }

      // Dock visibility and pulse
      if (dockGroupRef.current) {
        dockGroupRef.current.visible = mode === "docked";
        if (dockLedRef.current) {
          dockLedRef.current.intensity = 2.0 + Math.sin(elapsedTime * 4) * 0.6;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme, wireframe]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-700 ease-out"
      style={{ zIndex: 1 }}
    />
  );
};
