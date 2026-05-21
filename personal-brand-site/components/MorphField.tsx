"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

type ShapeFn = (count: number) => Float32Array;

const shapeHead: ShapeFn = (count) => {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Sample on an ellipsoid (head-like), thicker at the top, narrower at chin.
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    // jitter the radius so it doesn't look like a perfect shell
    const r = 1.15 + (Math.random() - 0.5) * 0.05;
    const yFactor = 1.25 - 0.25 * Math.sin(phi); // elongate vertical
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.cos(phi) * yFactor;
    arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return arr;
};

const shapeScatter: ShapeFn = (count) => {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Random in a soft cloud
    const r = Math.cbrt(Math.random()) * 2.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.cos(phi);
    arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return arr;
};

const shapeFiber: ShapeFn = (count) => {
  const arr = new Float32Array(count * 3);
  const strands = 80;
  for (let i = 0; i < count; i++) {
    const strand = i % strands;
    const along = (Math.floor(i / strands) % Math.ceil(count / strands)) /
      Math.ceil(count / strands);
    const angle = (strand / strands) * Math.PI * 2;
    const wave = Math.sin(along * 6 + strand) * 0.15;
    const radius = along * 3 + 0.3;
    arr[i * 3] = Math.cos(angle) * radius + wave;
    arr[i * 3 + 1] = Math.sin(angle * 0.7) * 0.6 + (Math.random() - 0.5) * 0.2;
    arr[i * 3 + 2] = Math.sin(angle) * radius + wave;
  }
  return arr;
};

const shapeCrystal: ShapeFn = (count) => {
  const arr = new Float32Array(count * 3);
  // Octahedron-like form: sample on |x|+|y|+|z| = r
  for (let i = 0; i < count; i++) {
    const r = 1.4;
    // Random unit vector then project to octahedron surface
    let x = Math.random() - 0.5;
    let y = Math.random() - 0.5;
    let z = Math.random() - 0.5;
    const s = Math.abs(x) + Math.abs(y) + Math.abs(z) || 1;
    x = (x / s) * r;
    y = (y / s) * r * 1.5; // elongate
    z = (z / s) * r;
    // jitter for organic feel
    arr[i * 3] = x + (Math.random() - 0.5) * 0.04;
    arr[i * 3 + 1] = y + (Math.random() - 0.5) * 0.04;
    arr[i * 3 + 2] = z + (Math.random() - 0.5) * 0.04;
  }
  return arr;
};

const SHAPES = [shapeHead, shapeScatter, shapeFiber, shapeCrystal];

export default function MorphField({
  progress,
  count = 4000,
  pointSize = 0.025,
}: {
  progress: MotionValue<number>;
  count?: number;
  pointSize?: number;
}) {
  const targets = useMemo(() => SHAPES.map((fn) => fn(count)), [count]);
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  // initial copy from first shape
  useMemo(() => {
    positions.set(targets[0]);
  }, [positions, targets]);

  const pointsRef = useRef<THREE.Points>(null);
  const tmp = useRef(new THREE.Vector3());

  useFrame((state) => {
    const p = THREE.MathUtils.clamp(progress.get(), 0, 1);
    const seg = p * (SHAPES.length - 1);
    const i0 = Math.min(Math.floor(seg), SHAPES.length - 2);
    const i1 = i0 + 1;
    const t = seg - i0;
    // smoothstep for nicer easing
    const e = t * t * (3 - 2 * t);

    const a = targets[i0];
    const b = targets[i1];
    const n = count;
    for (let i = 0; i < n; i++) {
      const idx = i * 3;
      positions[idx] = a[idx] + (b[idx] - a[idx]) * e;
      positions[idx + 1] = a[idx + 1] + (b[idx + 1] - a[idx + 1]) * e;
      positions[idx + 2] = a[idx + 2] + (b[idx + 2] - a[idx + 2]) * e;
    }

    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      attr.needsUpdate = true;
      // gentle rotation
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      pointsRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
    // suppress unused warning
    tmp.current.set(0, 0, 0);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={pointSize}
        sizeAttenuation
        color="#ff5a1f"
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
