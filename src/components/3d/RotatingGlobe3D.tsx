import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FarmPoint {
  name: string;
  lat: number;
  lng: number;
  ndvi: number;
  crop: string;
}

const MONITORED_FARMS: FarmPoint[] = [
  { name: 'Punjab Wheat Block', lat: 30.9, lng: 75.8, ndvi: 0.82, crop: 'Wheat' },
  { name: 'Iowa Corn Basin', lat: 41.8, lng: -93.6, ndvi: 0.74, crop: 'Corn' },
  { name: 'California Valley', lat: 36.7, lng: -119.7, ndvi: 0.68, crop: 'Almonds' },
  { name: 'Bordeaux Vineyard', lat: 44.8, lng: -0.5, ndvi: 0.79, crop: 'Grapes' },
  { name: 'Andhra Paddy Delta', lat: 16.5, lng: 80.6, ndvi: 0.85, crop: 'Rice' },
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export function RotatingGlobe3D({ height = 280 }: { height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 300;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Earth Sphere Core (Dark Navy/Emerald Atmosphere)
    const sphereRadius = 75;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 36, 36);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x071520,
      emissive: 0x052015,
      specular: 0x10b981,
      shininess: 25,
      transparent: true,
      opacity: 0.95,
    });
    const earthMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(earthMesh);

    // 2. Wireframe Lattice Grid
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireMesh = new THREE.Mesh(sphereGeo, wireMat);
    globeGroup.add(wireMesh);

    // 3. Glowing Atmospheric Halo
    const haloGeo = new THREE.SphereGeometry(sphereRadius * 1.15, 32, 32);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(0.06, 0.72, 0.50, 1.0) * intensity * 1.8;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    globeGroup.add(haloMesh);

    // 4. Glowing Farm Beacons & Light Pillars
    MONITORED_FARMS.forEach((farm) => {
      const pos = latLngToVector3(farm.lat, farm.lng, sphereRadius);

      // Core Beacon Point
      const beaconGeo = new THREE.SphereGeometry(2.2, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.copy(pos);
      globeGroup.add(beacon);

      // Radial Pulse Ring
      const ringGeo = new THREE.RingGeometry(2.5, 4.5, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos.clone().multiplyScalar(1.01));
      ring.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(ring);
    });

    // 5. Orbiting Sentinel-2 Satellite
    const orbitRadius = sphereRadius * 1.4;
    const orbitCurve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius * 0.9, 0, 2 * Math.PI, false, 0);
    const orbitPoints = orbitCurve.getPoints(64).map((p) => new THREE.Vector3(p.x, p.y * 0.4, p.y));
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitLine.rotation.x = Math.PI / 4;
    scene.add(orbitLine);

    const satelliteGeo = new THREE.BoxGeometry(3, 2, 4);
    const satelliteMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const satellite = new THREE.Mesh(satelliteGeo, satelliteMat);
    scene.add(satellite);

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x10b981, 1.8);
    dirLight.position.set(100, 80, 100);
    scene.add(dirLight);

    // Animation Loop
    let animId: number;
    let time = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.015;

      // Slow Earth rotation
      globeGroup.rotation.y += 0.003;
      globeGroup.rotation.x = 0.2;

      // Orbiting Satellite calculation
      const satAngle = time * 0.8;
      const satX = Math.cos(satAngle) * orbitRadius;
      const satZ = Math.sin(satAngle) * orbitRadius;
      const satY = Math.sin(satAngle) * 35;
      satellite.position.set(satX, satY, satZ);

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
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#09111c]/60 to-[#060c14]/90 border border-emerald-500/20 shadow-xl backdrop-blur-xl flex flex-col items-center justify-center p-3">
      {/* Top Header Badge */}
      <div className="w-full flex items-center justify-between px-2 pt-1 z-10">
        <span className="text-[11px] font-bold text-emerald-400 font-mono flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          3D Satellite Earth Observation
        </span>
        <span className="text-[10px] text-gray-400 font-mono">5 Farm Beacons Active</span>
      </div>

      <div ref={containerRef} style={{ width: '100%', height: `${height}px` }} className="cursor-grab active:cursor-grabbing" />

      {/* Bottom Telemetry Legend */}
      <div className="w-full flex items-center justify-between text-[10px] text-gray-300 px-3 pb-1 border-t border-white/10 pt-2 z-10">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400" /> Monitored Farms
        </span>
        <span className="flex items-center gap-1 text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400" /> Sentinel-2 Orbit
        </span>
      </div>
    </div>
  );
}
