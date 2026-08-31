import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sun, CloudRain, Wind, Sparkles, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PlantNode {
  mesh: THREE.Mesh;
  initialX: number;
  initialZ: number;
  health: 'healthy' | 'moderate' | 'stressed';
  ndvi: number;
}

export function LivingFarm3D({ height = 300 }: { height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [weatherMode, setWeatherMode] = useState<'sun' | 'rain' | 'wind'>('sun');
  const [selectedPlantInfo, setSelectedPlantInfo] = useState<{ health: string; ndvi: number; row: number } | null>({
    health: 'Optimal Vigor',
    ndvi: 0.82,
    row: 3,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 400;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 55, 95);
    camera.lookAt(0, -5, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // 1. Soil Terrain Base with Furrows
    const soilGeo = new THREE.PlaneGeometry(120, 90, 24, 18);
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x121e18,
      roughness: 0.85,
      metalness: 0.1,
    });
    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.rotation.x = -Math.PI / 2;
    soilMesh.position.y = -10;
    soilMesh.receiveShadow = true;
    scene.add(soilMesh);

    // Soil Grid Lines
    const gridHelper = new THREE.GridHelper(120, 12, 0x10b981, 0x1f382a);
    gridHelper.position.y = -9.8;
    scene.add(gridHelper);

    // 2. 3D Crop Stalks (Wheat / Corn Rows)
    const plants: PlantNode[] = [];
    const rows = 6;
    const cols = 9;

    const stalkGeo = new THREE.CylinderGeometry(0.3, 0.7, 7, 6);
    const leafGeo = new THREE.ConeGeometry(1.8, 4, 4);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2) * 11 + (Math.random() - 0.5) * 1.5;
        const z = (r - rows / 2) * 12 + (Math.random() - 0.5) * 1.5;

        // Health distribution: mostly healthy, 2 moderate, 1 stressed
        let health: 'healthy' | 'moderate' | 'stressed' = 'healthy';
        let color = 0x10b981; // Green
        let ndvi = 0.75 + Math.random() * 0.15;

        if (r === 1 && c === 3) {
          health = 'stressed';
          color = 0xef4444; // Red
          ndvi = 0.28;
        } else if (r === 4 && (c === 6 || c === 7)) {
          health = 'moderate';
          color = 0xf59e0b; // Amber
          ndvi = 0.52;
        }

        const plantGroup = new THREE.Group();

        // Stalk
        const stalkMat = new THREE.MeshStandardMaterial({ color });
        const stalk = new THREE.Mesh(stalkGeo, stalkMat);
        stalk.position.y = 3.5;
        stalk.castShadow = true;
        plantGroup.add(stalk);

        // Canopy Head
        const leafMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3 });
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.y = 7;
        leaf.castShadow = true;
        plantGroup.add(leaf);

        plantGroup.position.set(x, -10, z);
        scene.add(plantGroup);

        plants.push({
          mesh: plantGroup as any,
          initialX: x,
          initialZ: z,
          health,
          ndvi,
        });
      }
    }

    // 3. Falling Rain Particle System
    const rainCount = 120;
    const rainGeo = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount * 3; i += 3) {
      rainPositions[i] = (Math.random() - 0.5) * 120;
      rainPositions[i + 1] = Math.random() * 60;
      rainPositions[i + 2] = (Math.random() - 0.5) * 90;
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 1.2,
      transparent: true,
      opacity: 0.8,
    });
    const rainSystem = new THREE.Points(rainGeo, rainMat);
    scene.add(rainSystem);

    // 4. Lighting Environment
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    sunLight.position.set(40, 70, 40);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Swaying crop stalks in the wind
      const windSpeed = weatherMode === 'wind' ? 4 : 2;
      const windAmplitude = weatherMode === 'wind' ? 0.25 : 0.08;

      plants.forEach((p, idx) => {
        const offset = idx * 0.3;
        p.mesh.rotation.z = Math.sin(time * windSpeed + offset) * windAmplitude;
        p.mesh.rotation.x = Math.cos(time * (windSpeed * 0.8) + offset) * (windAmplitude * 0.5);
      });

      // Rain animation
      if (weatherMode === 'rain') {
        rainSystem.visible = true;
        const positions = rainGeo.attributes.position.array as Float32Array;
        for (let i = 1; i < rainCount * 3; i += 3) {
          positions[i] -= 1.8;
          if (positions[i] < -10) positions[i] = 50;
        }
        rainGeo.attributes.position.needsUpdate = true;
      } else {
        rainSystem.visible = false;
      }

      // Gentle camera orbit
      camera.position.x = Math.sin(time * 0.15) * 15;
      camera.lookAt(0, -3, 0);

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
  }, [height, weatherMode]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#0c1420]/85 border border-white/10 shadow-2xl backdrop-blur-2xl p-5 space-y-4">
      {/* Header with Weather Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 animate-leaf-sway">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              3D Living Farm Ecosystem
              <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Real-Time Vigor</Badge>
            </h3>
            <p className="text-xs text-gray-400">Interactive 3D canopy terrain with wind & moisture physics</p>
          </div>
        </div>

        {/* Weather Toggles */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setWeatherMode('sun')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              weatherMode === 'sun' ? 'bg-yellow-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Sunlight
          </button>
          <button
            onClick={() => setWeatherMode('rain')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              weatherMode === 'rain' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" /> Rain
          </button>
          <button
            onClick={() => setWeatherMode('wind')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              weatherMode === 'wind' ? 'bg-cyan-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" /> Wind
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} style={{ width: '100%', height: `${height}px` }} className="cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden bg-black/40" />

      {/* Bottom Interactive Crop Row Telemetry */}
      <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Healthy Crops (51)</span>
          <p className="text-xs font-bold text-emerald-400">NDVI 0.75 – 0.88</p>
        </div>

        <div className="p-2.5 rounded-xl bg-yellow-950/30 border border-yellow-500/30">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Moderate Stress (2)</span>
          <p className="text-xs font-bold text-yellow-400">NDVI 0.52</p>
        </div>

        <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/30">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Disease Hotspot (1)</span>
          <p className="text-xs font-bold text-red-400">NDVI 0.28 (Alert)</p>
        </div>
      </div>
    </div>
  );
}
