import { useEffect, useRef } from "react";
import { useGameContext } from "../../context/GameContext";
import { Loader } from "./Loader";
import { Howl } from "howler";
import { Leva } from "leva";

export const UIGame = () => {
  const { isLobby } = useGameContext();

  const soundRef = useRef();

  useEffect(() => {
    soundRef.current = new Howl({
      src: ["/audio/music/forest-ambience-152005.mp3"],
      volume: 0.4,
      loop: true,
      preload: true,
      autoplay: false,
    });
  }, []);

  useEffect(() => {
    if (!isLobby) {
      soundRef.current.play();
    }
  }, [isLobby]);

  return (
    <>
      <Leva hidden={true} />
      <Loader />
    </>
  );
};
