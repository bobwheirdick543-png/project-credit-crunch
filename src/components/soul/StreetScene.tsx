import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/lib/theme";

function Danfo() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.position.x = ((clock.elapsedTime * 0.8) % 8) - 4; });
  return (
    <group ref={ref} position={[0, 0.35, 0.6]}>
      <mesh><boxGeometry args={[1.4, 0.6, 0.6]} /><meshStandardMaterial color="#f2b705" flatShading /></mesh>
      <mesh position={[0, 0.02, 0]}><boxGeometry args={[1.42, 0.06, 0.62]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0.1, 0.15, 0]}><boxGeometry args={[1.0, 0.18, 0.62]} /><meshStandardMaterial color="#223" metalness={0.6} roughness={0.2} /></mesh>
      {[-0.45, 0.45].map((x) => [-0.3, 0.3].map((z) => (
        <mesh key={`${x}${z}`} position={[x, -0.3, z]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.12, 0.12, 0.08, 10]} /><meshStandardMaterial color="#111" /></mesh>
      )))}
    </group>
  );
}

function Building({ p, s, c }: { p: [number, number, number]; s: [number, number, number]; c: string }) {
  return (
    <group position={p}>
      <mesh position-y={s[1] / 2}><boxGeometry args={s} /><meshStandardMaterial color={c} flatShading /></mesh>
      {Array.from({ length: Math.floor(s[1] / 0.5) }).map((_, i) => (
        <mesh key={i} position={[0, 0.35 + i * 0.5, s[2] / 2 + 0.01]}><planeGeometry args={[s[0] * 0.7, 0.18]} /><meshStandardMaterial color="#F5A623" emissive="#F5A623" emissiveIntensity={0.6} /></mesh>
      ))}
    </group>
  );
}

export default function StreetScene() {
  const { resolved } = useTheme();
  const dark = resolved === "dark";
  return (
    <Canvas dpr={[1, 1.5]} orthographic camera={{ position: [6, 6, 6], zoom: 60 }} gl={{ alpha: true }}>
      <ambientLight intensity={dark ? 0.4 : 0.8} />
      <directionalLight position={[-4, 3, 5]} intensity={1.6} color={dark ? "#ff9d4d" : "#ffd9a0"} />
      <mesh rotation-x={-Math.PI / 2}><planeGeometry args={[9, 5]} /><meshStandardMaterial color={dark ? "#1b1b20" : "#d8c6a5"} /></mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0.6]}><planeGeometry args={[9, 1.1]} /><meshStandardMaterial color={dark ? "#0c0c0f" : "#57534e"} /></mesh>
      <Building p={[-2.5, 0, -1]} s={[1.4, 1.6, 1.2]} c={dark ? "#3a2f2a" : "#e9dcc6"} />
      <Building p={[-0.6, 0, -1.2]} s={[1.2, 3, 1]} c={dark ? "#24242c" : "#b9b2a6"} />
      <Building p={[1.4, 0, -1]} s={[1.6, 2.2, 1.2]} c={dark ? "#2e2620" : "#cf8b5a"} />
      {/* market stall */}
      <group position={[3, 0, -0.6]}>
        <mesh position-y={0.3}><boxGeometry args={[1, 0.6, 0.6]} /><meshStandardMaterial color="#6b4423" /></mesh>
        <mesh position-y={0.85} rotation-z={0.15}><boxGeometry args={[1.3, 0.05, 0.9]} /><meshStandardMaterial color="#C2410C" /></mesh>
      </group>
      <Danfo />
    </Canvas>
  );
}
