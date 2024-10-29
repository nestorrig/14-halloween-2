import { Canvas } from "@react-three/fiber";
import { UI } from "../UI/UI";
import { LobbyScene } from "./Scenes/LobbyScene";

export const Lobby = () => {
  return (
    <>
      <UI />
      <Canvas shadows>
        <LobbyScene />
      </Canvas>
    </>
  );
};
