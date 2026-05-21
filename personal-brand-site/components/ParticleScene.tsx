"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import type { MotionValue } from "framer-motion";
import MorphField from "./MorphField";
import { useIsMobile } from "./useMediaQuery";

export default function ParticleScene({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const isMobile = useIsMobile();
  // Aggressive mobile reduction to keep frames smooth.
  const count = isMobile ? 1200 : 4000;
  const pointSize = isMobile ? 0.032 : 0.024;

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[2, 3, 4]} intensity={1.4} color="#ff5a1f" />
          <pointLight position={[-3, -2, 1]} intensity={0.8} color="#5a8bff" />
          <MorphField
            progress={progress}
            count={count}
            pointSize={pointSize}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
