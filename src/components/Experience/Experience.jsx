import { Canvas } from "@react-three/fiber";
import { EcctrlJoystick } from "ecctrl";
import { Game } from "./Game";
import { Lobby } from "./Lobby";
import { Suspense } from "react";
import { Loader } from "../UI/Loader";
import { useGameContext } from "../../context/GameContext";
import { isMobile } from "react-device-detect";

export const Experience = () => {
  const { isLobby } = useGameContext();

  return (
    <>
      {isMobile && !isLobby && <EcctrlJoystick buttonNumber={3} />}
      <Suspense fallback={<Loader />}>
        <Canvas shadows>{isLobby ? <Lobby /> : <Game />}</Canvas>
      </Suspense>
    </>
  );
};
