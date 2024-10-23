import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { EcctrlJoystick } from "ecctrl";
import { Ambient, GenerativeTerrain, PerimeterWall } from "./Enviroment";
import { Controller, Enemies } from "./Gaming";
import { Suspense } from "react";

export const Experience = () => {
  return (
    <>
      <EcctrlJoystick buttonNumber={5} />
      <Canvas shadows>
        <Ambient />
        <OrbitControls />
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.8, 0]}>
            <Enemies />
            <PerimeterWall />
            <GenerativeTerrain />
            <Controller />
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
};
