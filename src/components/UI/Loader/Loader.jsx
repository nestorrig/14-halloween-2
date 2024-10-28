import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useGameContext } from "../../../context/GameContext";
import gsap from "gsap";

export const Loader = () => {
  const { setInitUILobby } = useGameContext();
  const [animateLoader, setAnimateLoader] = useState(false);
  const progress = useProgress();

  useEffect(() => {
    console.log(progress.progress);
    console.log(progress.item);
    console.log(progress);

    if (animateLoader && progress.progress === 100) {
      const tl = gsap.timeline();

      tl.to(
        ".loader-button",
        {
          scale: 0,
          x: "50vw",
          duration: 0.7,
          opacity: 0,
        },
        "-=0.7"
      )
        .to(".loader-text", {
          scale: 0,
          x: "-50vw",
          duration: 0.7,
          opacity: 0,
        })
        .to(
          ".loader-bar",
          {
            duration: 0.7,
            scaleX: 0,
            ease: "power3.inOut",
          },
          "-=0.3"
        )
        .to(".loader-container", {
          duration: 1,
          y: "-100%",
          ease: "power3.inOut",
          onComplete: () => setInitUILobby(true),
        })
        .to(".loader-container", {
          duration: 1,
          display: "none",
        });
    }
  }, [animateLoader, progress]);

  return (
    <div className="z-50 absolute w-screen h-screen flex flex-col justify-center items-center gap-4 bg-[#0d0d0d] loader-container">
      <h1 className="font-Jolly-Lodger text-[#E2DFD0] text-9xl loader-text">
        Loading
      </h1>
      <div className="w-1/2 h-1 bg-[#3C3D37] origin-center loader-bar">
        <div
          className="h-full bg-[#3e2b2b]"
          style={{ width: `${progress.progress}%` }}
        ></div>
      </div>
      <button
        className={`loader-button text-[#3e2b2b] font-Kanit font-light italic text-3xl transition-all duration-700 hover:text-[#E2DFD0] ${
          !progress.active ? "opacity-100" : "opacity-0"
        }`}
        disabled={progress.active}
        onClick={() => setAnimateLoader(true)}
      >
        Start
      </button>
    </div>
  );
};
