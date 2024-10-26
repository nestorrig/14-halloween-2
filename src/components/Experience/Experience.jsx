import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { EcctrlJoystick } from "ecctrl";
import { Ambient, GenerativeTerrain, PerimeterWall } from "./Enviroment";
import { Controller, Enemies } from "./Gaming";
import { Suspense, useState } from "react";

export const Experience = () => {
  const [isTerrainLoaded, setIsTerrainLoaded] = useState(false);

  const handleTerrainLoaded = () => {
    setIsTerrainLoaded(true);
  };

  return (
    <>
      <EcctrlJoystick buttonNumber={5} />
      <Canvas shadows>
        <Ambient />
        <OrbitControls />
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.8, 0]} debug>
            <GenerativeTerrain onTerrainLoaded={handleTerrainLoaded} />
            <PerimeterWall />
            {/* Solo mostrar los enemigos y el jugador si el terreno está listo */}
            {isTerrainLoaded && (
              <>
                <Enemies />
                <Controller />
              </>
            )}
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
};
