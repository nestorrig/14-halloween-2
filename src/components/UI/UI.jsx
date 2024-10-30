import { useEffect, useRef } from "react";
import { useGameContext } from "../../context/GameContext";
import { Loader } from "./Loader";
import { SelectPlayer } from "./SelectPlayer";
import { Welcome } from "./Welcome";
import { Howl } from "howler";
// import { useNavigate } from "react-router-dom";
import { Leva } from "leva";

export const UI = () => {
  const { initUILobby, stopMusic, isLobby } = useGameContext();

  const soundRef = useRef();
  // const navigate = useNavigate();
  // const goToGame = () => {
  //   navigate("/game");
  // };

  useEffect(() => {
    soundRef.current = new Howl({
      src: ["/audio/music/horror-piano-250870.mp3"],
      volume: 0.5,
      loop: false,
      preload: true,
      autoplay: false,
    });
  }, []);

  useEffect(() => {
    if (initUILobby) {
      soundRef.current.play();
    }
  }, [initUILobby]);

  useEffect(() => {
    if (!isLobby) {
      soundRef.current.stop();
    }
  }, [isLobby]);

  // useEffect(() => {
  //   if (stopMusic) {
  //     soundRef.current.stop();
  //     // goToGame();
  //   }
  // }, [stopMusic]);

  return (
    <>
      <Leva hidden={true} />
      <Loader />
      <Welcome />
      <SelectPlayer />
      {/* <div className="z-50 absolute w-20 h-10 flex flex-col gap-4">
        <h1>UI</h1>
        <button className="bg-white" onClick={() => setCameraAnimation(1)}>
          Position 2
        </button>
        <button className="bg-white" onClick={() => setCameraAnimation(2)}>
          Position 3
        </button>
        <button className="bg-white" onClick={() => setCameraAnimation(3)}>
          Position 4
        </button>
      </div> */}
    </>
  );
};
