import { OrbitControls } from "@react-three/drei";
import { Ambient, GenerativeTerrain, PerimeterWall } from "../Enviroment";
import { Suspense, useState } from "react";
import { Physics } from "@react-three/rapier";
import { Controller, Enemies } from "../Gaming";
import { Canvas } from "@react-three/fiber";
import { isMobile } from "react-device-detect";

export const GameScene = () => {
  const [isTerrainLoaded, setIsTerrainLoaded] = useState(false);

  const handleTerrainLoaded = () => {
    setIsTerrainLoaded(true);
  };

  return (
    <Canvas shadows dpr={isMobile ? [0.8, 0.8] : [1, 2]}>
      <Ambient />
      <Physics gravity={[0, -9.8, 0]}>
        <GenerativeTerrain onTerrainLoaded={handleTerrainLoaded} />
        <PerimeterWall />
        {isTerrainLoaded && (
          <>
            <Enemies />
            <Controller />
          </>
        )}
      </Physics>
    </Canvas>
  );
};
