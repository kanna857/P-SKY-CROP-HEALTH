import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Stethoscope, Sparkles, RefreshCw, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LeafScanner3DProps {
  height?: number;
  onScanComplete?: () => void;
}

export function LeafScanner3D({ height = 240, onScanComplete }: LeafScanner3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 320;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 55);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Leaf Group
    const leafGroup = new THREE.Group();
    scene.add(leafGroup);

    // 1. 3D Leaf Mesh (Parametric Leaf Shape with Vein Geometry)
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, -18);
    leafShape.bezierCurveTo(12, -8, 16, 8, 0, 20);
    leafShape.bezierCurveTo(-16, 8, -12, -8, 0, -18);

    const extrudeSettings = {
      depth: 1.2,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.6,
      bevelThickness: 0.6,
    };

    const leafGeo = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.4,
      metalness: 0.1,
      emissive: 0x052e16,
    });
    const leafMesh = new THREE.Mesh(leafGeo, leafMat);
    leafGroup.add(leafMesh);

    // Leaf Veins Line
    const veinPoints = [
      new THREE.Vector3(0, -17, 1.4),
      new THREE.Vector3(0, 0, 1.4),
      new THREE.Vector3(0, 18, 1.4),
    ];
    const veinGeo = new THREE.BufferGeometry().setFromPoints(veinPoints);
    const veinMat = new THREE.LineBasicMaterial({ color: 0x4ade80, linewidth: 2 });
    const veinLine = new THREE.Line(veinGeo, veinMat);
    leafGroup.add(veinLine);

    // 2. Infected Disease Hotspots (Glowing Orange/Red Spores)
    const hotspotGeo = new THREE.SphereGeometry(1.5, 12, 12);
    const hotspotMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    
    const spot1 = new THREE.Mesh(hotspotGeo, hotspotMat);
    spot1.position.set(5, 4, 1.5);
    leafGroup.add(spot1);

    const spot2 = new THREE.Mesh(hotspotGeo, hotspotMat);
    spot2.position.set(-4, -6, 1.5);
    leafGroup.add(spot2);

    // 3. Holographic 3D Laser Scanning Ring
    const ringGeo = new THREE.TorusGeometry(18, 0.4, 16, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.85,
    });
    const scanRing = new THREE.Mesh(ringGeo, ringMat);
    scanRing.rotation.x = Math.PI / 2;
    scene.add(scanRing);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x34d399, 2);
    dirLight.position.set(20, 30, 40);
    scene.add(dirLight);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Continuous 3D Leaf Rotation
      leafGroup.rotation.y = Math.sin(time * 0.8) * 0.45;
      leafGroup.rotation.x = Math.cos(time * 0.6) * 0.2;

      // Scanning Ring Motion
      scanRing.position.y = Math.sin(time * 2.5) * 16;
      scanRing.rotation.z = time * 1.5;

      // Hotspot pulse
      const pulseScale = 1 + Math.sin(time * 6) * 0.3;
      spot1.scale.set(pulseScale, pulseScale, pulseScale);
      spot2.scale.set(pulseScale, pulseScale, pulseScale);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [height]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#09111c]/70 to-[#060c14]/90 border border-emerald-500/30 shadow-xl backdrop-blur-xl p-3 flex flex-col items-center">
      <div className="w-full flex items-center justify-between px-1 pb-1 z-10">
        <span className="text-[11px] font-bold text-emerald-400 font-mono flex items-center gap-1.5">
          <Crosshair className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          3D Holographic Leaf Inspection
        </span>
        <Badge variant="outline" className="text-[10px] text-orange-400 border-orange-500/30 bg-orange-500/10">
          2 Lesion Hotspots
        </Badge>
      </div>

      <div ref={containerRef} style={{ width: '100%', height: `${height}px` }} className="cursor-grab active:cursor-grabbing" />

      <div className="w-full flex items-center justify-between text-[10px] text-gray-300 px-2 pt-1 border-t border-white/10 z-10">
        <span className="text-emerald-400 font-mono">MobileNetV3 3D HUD</span>
        <span className="text-gray-400">Drag to rotate 360°</span>
      </div>
    </div>
  );
}
