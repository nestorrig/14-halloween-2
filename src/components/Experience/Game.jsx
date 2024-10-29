import { isMobile } from "react-device-detect";
import { Joystick } from "./Gaming";
import { GameScene } from "./Scenes/GameScene";
import { UIGame } from "../UI/UIGame";

export const Game = () => {
  return (
    <>
      <UIGame />
      {isMobile && <Joystick />}
      <GameScene />
    </>
  );
};
