import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls, PerformanceMonitor } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "@/lib/theme";

// Simplified Nigeria outline (lon, lat)
const OUTLINE: [number, number][] = [
  [2.7, 6.4], [2.7, 9.0], [3.6, 10.3], [3.6, 11.7], [4.1, 13.5], [5.5, 13.9], [6.9, 13.1], [8.0, 13.3],
  [9.6, 12.8], [11.0, 13.4], [12.3, 13.1], [13.6, 13.7], [14.2, 12.4], [14.6, 11.5], [13.6, 10.1],
  [13.3, 9.0], [12.2, 8.4], [11.8, 7.0], [10.6, 7.0], [9.8, 6.4], [8.9, 4.8], [7.1, 4.4], [6.0, 4.3],
  [5.3, 5.6], [4.5, 6.3],
];
const toXZ = (lon: number, lat: number) => [(lon - 8.6) * 0.9, -(lat - 9) * 0.9] as const;
const POLY = OUTLINE.map(([a, b]) => toXZ(a, b));

const CITIES: { name: string; ll: [number, number] }[] = [
  { name: "Lagos", ll: [3.4, 6.5] }, { name: "Ibadan", ll: [3.9, 7.4] }, { name: "Abuja", ll: [7.5, 9.06] },
  { name: "Kano", ll: [8.5, 12.0] }, { name: "Enugu", ll: [7.5, 6.45] }, { name: "Port Harcourt", ll: [7.0, 4.8] },
  { name: "BS Island", ll: [5.0, 3.5] },
];
const ROUTES: [number, number][] = [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [0, 6], [5, 6], [0, 4], [1, 3]];

function inside(x: number, z: number) {
  let c = false;
  for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) {
    const [xi, zi] = POLY[i]!, [xj, zj] = POLY[j]!;
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
}
const height = (x: number, z: number) => {
  // Jos plateau + northern highlands, river valley dip
  const jos = Math.exp(-((x - 0.4) ** 2 + (z + 0.7) ** 2) / 1.2) * 0.55;
  const ne = Math.exp(-((x - 4.5) ** 2 + (z - 1) ** 2) / 1.5) * 0.4;
  const river = -Math.exp(-((x + 0.8) ** 2 + (z - 1.0) ** 2) / 0.6) * 0.15;
  return 0.15 + jos + ne + river + Math.sin(x * 2.3) * Math.cos(z * 1.9) * 0.06;
};

function Terrain({ dark }: { dark: boolean }) {
  const geo = useMemo(() => {
    const plane = new THREE.PlaneGeometry(12, 10, 70, 60).toNonIndexed();
    plane.rotateX(-Math.PI / 2);
    const p = plane.getAttribute("position");
    const out: number[] = [];
    for (let i = 0; i < p.count; i += 3) {
      const cx = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3;
      const cz = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3;
      if (!inside(cx, cz)) continue;
      for (let k = 0; k < 3; k++) {
        const x = p.getX(i + k), z = p.getZ(i + k);
        out.push(x, height(x, z), z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(out, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  const base = useMemo(() => {
    const s = new THREE.Shape(POLY.map(([x, z]) => new THREE.Vector2(x, -z)));
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.35, bevelEnabled: false });
    g.rotateX(-Math.PI / 2);
    g.translate(0, -0.2, 0);
    return g;
  }, []);
  return (
    <group>
      <mesh geometry={geo}>
        <meshStandardMaterial color={dark ? "#1a1a20" : "#d9c7a6"} flatShading roughness={dark ? 0.5 : 0.9} metalness={dark ? 0.4 : 0} />
      </mesh>
      <mesh geometry={base}>
        <meshStandardMaterial color={dark ? "#0e0e12" : "#bfa77f"} roughness={1} />
      </mesh>
      {/* Niger & Benue rivers */}
      <Line points={[[-3.8, 0.3, -3], [-2.5, 0.25, -1], [-1.0, 0.2, 0.6], [-0.8, 0.2, 1.4], [-1.2, 0.22, 3.2]].map((v) => v as [number, number, number])} color={dark ? "#3b5bdb" : "#2f6f8f"} lineWidth={2} />
      <Line points={[[4.6, 0.3, -0.2], [2.5, 0.25, 0.4], [0.5, 0.22, 0.8], [-0.8, 0.2, 1.4]]} color={dark ? "#3b5bdb" : "#2f6f8f"} lineWidth={2} />
    </group>
  );
}

type LineRef = { material: { dashOffset: number } } | null;
function Artery({ a, b, color, speed }: { a: THREE.Vector3; b: THREE.Vector3; color: string; speed: number }) {
  const ref = useRef<LineRef>(null);
  const pts = useMemo(() => {
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y += a.distanceTo(b) * 0.25 + 0.3;
    return new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(32);
  }, [a, b]);
  useFrame((_, d) => { if (ref.current) ref.current.material.dashOffset -= Math.min(d, 0.05) * speed; });
  return (
    <>
      <Line points={pts} color={color} lineWidth={1} transparent opacity={0.25} />
      <Line ref={ref as never} points={pts} color={color} lineWidth={2.5} dashed dashSize={0.25} gapSize={0.6} />
    </>
  );
}

function Hub({ pos, amber, purple }: { pos: THREE.Vector3; amber: string; purple: string }) {
  const ring = useRef<THREE.Mesh>(null);
  const off = useMemo(() => Math.random() * 2, []);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const t = (clock.elapsedTime * 0.6 + off) % 1;
    ring.current.scale.setScalar(1 + t * 2.5);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = 1 - t;
  });
  return (
    <group position={pos}>
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.14, 24]} />
        <meshBasicMaterial color={amber} />
      </mesh>
      <mesh ref={ring} rotation-x={-Math.PI / 2} position-y={0.01}>
        <ringGeometry args={[0.15, 0.19, 32]} />
        <meshBasicMaterial color={amber} transparent />
      </mesh>
      <mesh position-y={0.5}>
        <cylinderGeometry args={[0.012, 0.012, 1, 6]} />
        <meshBasicMaterial color={amber} transparent opacity={0.6} />
      </mesh>
      <mesh position-y={1}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color={purple} />
      </mesh>
    </group>
  );
}

function Dust({ count, color }: { count: number; color: string }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { a[i * 3] = (Math.random() - 0.5) * 14; a[i * 3 + 1] = Math.random() * 4; a[i * 3 + 2] = (Math.random() - 0.5) * 12; }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(a, 3));
    return g;
  }, [count]);
  useFrame((_, d) => {
    const p = geo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) { let y = p.getY(i) + Math.min(d, 0.05) * 0.25; if (y > 4) y = 0; p.setY(i, y); }
    p.needsUpdate = true;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.05} color={color} transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function HeroScene() {
  const { resolved } = useTheme();
  const dark = resolved === "dark";
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [dust, setDust] = useState(mobile ? 50 : 150);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  const amber = dark ? "#F5A623" : "#C2410C";
  const purple = dark ? "#7B3FE4" : "#6D28D9";
  const cities = useMemo(() => CITIES.map((c) => { const [x, z] = toXZ(...c.ll); return new THREE.Vector3(x, inside(x, z) ? height(x, z) + 0.02 : 0.05, z); }), []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas dpr={[1, 1.5]} frameloop={visible ? "always" : "never"} camera={{ position: [0, 9, 11], fov: mobile ? 60 : 42 }} gl={{ antialias: true, alpha: true }}>
        <PerformanceMonitor onDecline={() => setDust((d) => Math.max(20, Math.floor(d / 2)))} />
        <ambientLight intensity={dark ? 0.35 : 0.9} />
        <hemisphereLight args={[dark ? "#7B3FE4" : "#fff6e5", dark ? "#000" : "#c9b48f", dark ? 0.4 : 0.6]} />
        <directionalLight position={[5, 8, 3]} intensity={dark ? 1.2 : 1.6} color={dark ? "#ffd59a" : "#fff1d6"} />
        <directionalLight position={[-6, 2, -6]} intensity={dark ? 0.8 : 0.2} color={dark ? "#F5A623" : "#fff"} />
        <group position={[mobile ? 0 : 2.2, mobile ? 1 : -0.5, mobile ? -2 : 0]} scale={mobile ? 0.65 : 0.8}>
          <Terrain dark={dark} />
          {ROUTES.map(([a, b], i) => (
            <Artery key={i} a={cities[a]!} b={cities[b]!} color={i % 3 === 2 ? purple : amber} speed={0.6 + (i % 4) * 0.25} />
          ))}
          {cities.map((p, i) => <Hub key={i} pos={p} amber={amber} purple={purple} />)}
          <Dust count={dust} color={amber} />
        </group>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} autoRotate autoRotateSpeed={0.25 * 9.55 / 4} />
      </Canvas>
    </div>
  );
}
