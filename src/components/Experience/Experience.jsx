import { Canvas } from "@react-three/fiber";
import { EcctrlJoystick } from "ecctrl";
import { Game } from "./Game";
import { Lobby } from "./Lobby";
import { Suspense } from "react";
import { Loader } from "../UI/Loader";

export const Experience = () => {
  return (
    <>
      {/* <EcctrlJoystick buttonNumber={5} /> */}
      <Suspense fallback={<Loader />}>
        <Canvas shadows>
          {/* lobyy */}
          <Lobby />

          {/* game */}
          {/* <Game /> */}
        </Canvas>
      </Suspense>
    </>
  );
};
