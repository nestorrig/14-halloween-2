import { Canvas } from "@react-three/fiber";
import { Game } from "./Game";
import { Lobby } from "./Lobby";
import { Suspense } from "react";
import { Loader } from "../UI/Loader";
import { useGameContext } from "../../context/GameContext";
import { isMobile } from "react-device-detect";
import { Joystick } from "./Gaming";

export const Experience = () => {
  const { isLobby } = useGameContext();

  return (
    <>
      {isMobile && !isLobby && <Joystick />}
      <Suspense fallback={<Loader />}>
        <Canvas shadows>{isLobby ? <Lobby /> : <Game />}</Canvas>
      </Suspense>
    </>
  );
};
