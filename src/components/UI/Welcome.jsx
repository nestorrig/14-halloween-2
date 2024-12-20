import { useEffect, useRef, useState } from "react";
import { useGameContext } from "../../context/GameContext";
import gsap from "gsap";
import SplitType from "split-type";

export const Welcome = () => {
  const { initUILobby, setCameraAnimation } = useGameContext();
  const [removeWelcome, setRemoveWelcome] = useState(false);
  const titleRef = useRef();
  const parrafRef = useRef();
  const timeline = useRef();

  useEffect(() => {
    console.log(initUILobby);

    if (initUILobby) {
      timeline.current = gsap.timeline();
      timeline.current
        .to(titleRef.current.chars, {
          y: "0%",
          duration: 1,
          stagger: 0.05,
          ease: "power3.inOut",
        })
        .to(titleRef.current.chars, {
          color: "#E2DFD0",
          stagger: 0.05,
        })
        .to(
          ".subtitle",
          {
            y: "0%",
            duration: 1,

            ease: "power3.inOut",
          },
          "-=0.5"
        )
        .to(".subtitle", {
          color: "#E2DFD0",
          scale: 1.1,
        })
        .to(parrafRef.current.chars, {
          opacity: 1,
          duration: 2,
          stagger: 0.03,
        })
        .to(
          ".enter-btn",
          {
            opacity: 1,
            duration: 1,
          },
          "-=2"
        );
    }
  }, [initUILobby]);

  useEffect(() => {
    if (removeWelcome) {
      setCameraAnimation(1);
      gsap.to(".enter-container", {
        duration: 1,
        opacity: 0,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(".enter-container", { display: "none" });
        },
      });
    }
  }, [removeWelcome]);

  useEffect(() => {
    gsap.set(".subtitle", { y: "-100%", color: "#3C3D37" });
    gsap.set(".enter-btn", { opacity: 0 });

    titleRef.current = new SplitType(".title", {
      types: "chars",
    });
    gsap.set(titleRef.current.chars, { color: "#481E14", y: "100%" });

    parrafRef.current = new SplitType(".parraf", {
      types: "words,chars",
    });
    gsap.set(parrafRef.current.chars, { opacity: 0 });
  }, []);

  return (
    <div className="enter-container absolute top-0 left-0 p-4 py-16 lg:p-16 w-full max-w-3xl z-40">
      <div className="overflow-hidden">
        <h1
          className="text-[#E2DFD0] text-6xl lg:text-9xl font-Jolly-Lodger title"
          style={{ fontKerning: "none" }}
        >
          Echoes in the Fog
        </h1>
      </div>
      <div className="overflow-hidden mt-4 lg:mt-6">
        <h2 className="text-[#E2DFD0] text-3xl font-Kanit font-thin italic origin-left   subtitle">
          A 3D Adventure Game
        </h2>
      </div>
      <div className="overflow-hidden mt-1 lg:mt-2">
        <p className="text-[#E2DFD0] font-Kanit font-light italic parraf">
          Deep within a fog-drenched forest, something stirs. The dead walk
          again, haunting the misty trails, waiting to claim any who dare enter.
          As one of the last survivors, you step into this cursed wood, choosing
          your path as a lone character, armed with only a single weapon. One by
          one, the undead rise to confront you, and with each fallen, another
          emerges from the shadows. How many can you find… and how long will you
          survive?
        </p>
      </div>
      <div className="overflow-hidden">
        <button
          className="enter-btn fixed bottom-4 right-4 lg:static lg:mt-4 border px-2 py-1 hover:border-[#481E14] hover:text-[#481E14] font-Kanit font-light italic text-xl lg:text-2xl transition-all duration-700 text-[#E2DFD0] border-[#E2DFD0] bg-[#0d0d0d] bg-opacity-50"
          onClick={() => setRemoveWelcome(true)}
        >
          Enter the Forest
        </button>
      </div>
      <button
        className="skip-btn fixed bottom-4 left-4 lg:mt-4 border px-2 py-1 hover:border-[#481E14] hover:text-[#481E14] font-Kanit font-light italic text-xl lg:text-2xl transition-all duration-700 text-[#E2DFD0] border-[#E2DFD0] bg-[#0d0d0d] bg-opacity-50"
        onClick={() => setRemoveWelcome(true)}
      >
        Skip
      </button>
    </div>
  );
};
