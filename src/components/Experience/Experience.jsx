import { Canvas } from "@react-three/fiber";
import { EcctrlJoystick } from "ecctrl";
import { Game } from "./Game";
import { Lobby } from "./Lobby";

export const Experience = () => {
  return (
    <>
      {/* <EcctrlJoystick buttonNumber={5} /> */}
      <Canvas shadows>
        {/* lobyy */}
        <Lobby />

        {/* game */}
        {/* <Game /> */}
      </Canvas>
    </>
  );
};
