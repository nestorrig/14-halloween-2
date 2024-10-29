import { useEffect, useRef } from "react";
import { useGameContext } from "../../context/GameContext";
import { Loader } from "./Loader";
import { Howl } from "howler";
import { Leva } from "leva";
import { useLocation } from "react-router-dom";

export const UIGame = () => {
  const { isLobby } = useGameContext();
  const url = useLocation();

  const soundRef = useRef();

  useEffect(() => {
    soundRef.current = new Howl({
      src: ["/audio/music/forest-ambience-152005.mp3"],
      volume: 0.4,
      loop: true,
      preload: true,
      autoplay: false,
    });
    if (url.pathname === "/game" && isLobby) {
      soundRef.current.play();
    }
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
