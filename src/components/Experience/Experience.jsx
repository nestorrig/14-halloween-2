import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { EcctrlJoystick } from "ecctrl";
import { Ambient, GenerativeTerrain, PerimeterWall } from "./Enviroment";
import { Controller } from "./Gaming";

export const Experience = () => {
  return (
    <>
      <EcctrlJoystick buttonNumber={5} />
      <Canvas shadows>
        <Ambient />
        <OrbitControls />

        <Physics
          // debug
          gravity={[0, -9.8, 0]}
        >
          <PerimeterWall />
          <GenerativeTerrain />
          <Controller />
        </Physics>
      </Canvas>
    </>
  );
};
