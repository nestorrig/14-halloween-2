import { useEffect } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../../context/GameContext";

export const DiePage = () => {
  const { isDead } = useGameContext();

  // const navigate = useNavigate();

  const navigateToLobby = () => {
    // navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    gsap.set(".die-page", { display: "none", opacity: 0 });
  }, []);

  useEffect(() => {
    if (isDead) {
      let tl = gsap.timeline();
      tl.to(".die-page", {
        display: "flex",
        duration: 0.1,
      }).to(".die-page", {
        opacity: 1,
        duration: 0.5,
      });
    }
  }, [isDead]);

  return (
    <div className="die-page z-40 absolute w-screen h-screen flex flex-col justify-center items-center gap-4 bg-[#0d0d0d]">
      <h1 className="font-Jolly-Lodger text-[#E2DFD0] text-9xl">You Die</h1>
      <button
        className={`text-[#481E14] font-Kanit font-light italic text-3xl transition-all duration-700 hover:text-[#E2DFD0]`}
        onClick={navigateToLobby}
      >
        Return to Lobby
      </button>
    </div>
  );
};
