import { OrbitControls } from "@react-three/drei";
import { Ambient, GenerativeTerrain, PerimeterWall } from "./Enviroment";
import { Suspense, useState } from "react";
import { Physics } from "@react-three/rapier";
import { Controller, Enemies } from "./Gaming";

export const Game = () => {
  const [isTerrainLoaded, setIsTerrainLoaded] = useState(false);

  const handleTerrainLoaded = () => {
    setIsTerrainLoaded(true);
  };

  return (
    <>
      <Ambient />
      <OrbitControls />
      <Suspense fallback={null}>
        <Physics gravity={[0, -9.8, 0]}>
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
    </>
  );
};
