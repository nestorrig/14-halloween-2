import { useEffect, useRef } from "react";
import { useGameContext } from "../../context/GameContext";
import { Loader } from "./Loader";
import { Howl } from "howler";
import { Leva } from "leva";
// import { useLocation } from "react-router-dom";
import { DiePage } from "./DiePage";
import { useGame } from "ecctrl";
import { Health } from "./Health";
import { Guide } from "./Guide";

export const UIGame = () => {
  const { isLobby } = useGameContext();
  const { curAnimation } = useGame();
  // const url = useLocation();

  const soundRef = useRef();
  const walkSoundRef = useRef();

  useEffect(() => {
    soundRef.current = new Howl({
      src: ["/audio/music/forest-ambience-152005.mp3"],
      volume: 0.4,
      loop: true,
      preload: true,
      autoplay: false,
    });
    walkSoundRef.current = new Howl({
      src: ["/audio/sounds/running-in-grass.mp3"],
      volume: 0.2,
      loop: true,
      preload: true,
      autoplay: false,
      // rate: 0.5,
      sprite: {
        walk: [0, 700],
      },
    });
    // if (url.pathname === "/game" && isLobby) {
    //   soundRef.current.play();
    // }
  }, []);

  useEffect(() => {
    console.log({ curAnimation });

    if (
      curAnimation != "CharacterArmature|Walk" &&
      curAnimation != "CharacterArmature|Run"
    ) {
      walkSoundRef.current.stop();
      return;
    }

    if (curAnimation === "CharacterArmature|Walk") {
      walkSoundRef.current.play("walk");
      walkSoundRef.current.rate(0.5);
      return;
    } else if (curAnimation === "CharacterArmature|Run") {
      walkSoundRef.current.play("walk");
      walkSoundRef.current.rate(1);
      return;
    }
  }, [curAnimation]);

  useEffect(() => {
    if (!isLobby) {
      soundRef.current.play();
    }
  }, [isLobby]);

  return (
    <>
      <Leva hidden={true} />
      <Loader />
      <DiePage />
      <Health />
      <Guide />
    </>
  );
};
