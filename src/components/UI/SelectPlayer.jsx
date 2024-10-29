import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { GiFemale, GiMale } from "react-icons/gi";
import { useGameContext } from "../../context/GameContext";
import { useNavigate } from "react-router-dom";

export const SelectPlayer = () => {
  const {
    initSelectPlayer,
    setCameraAnimation,
    setIsLobby,
    setIsMale,
    setStopMusic,
  } = useGameContext();
  const [removeSelectPlayer, setRemoveSelectPlayer] = useState(false);
  const [playerSelected, setPlayerSelected] = useState(null);
  const timeline = useRef();
  const timeline2 = useRef();
  const navigate = useNavigate();
  const goToGame = () => {
    navigate("/game");
  };

  useEffect(() => {
    if (initSelectPlayer) {
      gsap.set(".selectPlayer-container", { display: "block" });

      timeline.current
        .to(".Chris .player-text", {
          y: "0%",
          delay: 1.3,
          duration: 1,
          stagger: 0.05,
          ease: "power3.inOut",
        })
        .to(".Chris", {
          zIndex: 50,
        });
      timeline2.current
        .to(".Carole .player-text", {
          y: "0%",
          delay: 1.3,
          duration: 1,
          stagger: 0.05,
          ease: "power3.inOut",
        })
        .to(".Carole", {
          zIndex: 50,
        });

      gsap.to(".select-title", {
        y: 0,
        duration: 1,
        ease: "power3.inOut",
      });
      gsap.to([".fem-btn", ".male-btn"], {
        x: "0vw",
        duration: 1,
        ease: "power3.inOut",
      });
    }
  }, [initSelectPlayer]);

  useEffect(() => {
    timeline.current = gsap.timeline();
    timeline2.current = gsap.timeline();
    timeline.current.pause();
    timeline2.current.pause();
    gsap.set(".player-text", { y: "100%" });
    gsap.set(".fem-btn", { x: "-50vw" });
    gsap.set(".male-btn", { x: "50vw" });
    gsap.set(".select-title", { y: -200 });
  }, []);

  useEffect(() => {
    console.log(playerSelected);

    if (playerSelected === "Carole") {
      timeline2.current.play();
      timeline.current.reverse();
    } else if (playerSelected === "Chris") {
      timeline.current.play();
      timeline2.current.reverse();
    }
  }, [playerSelected]);

  useEffect(() => {
    if (removeSelectPlayer) {
      gsap.to(".selectPlayer-container", {
        duration: 1,
        opacity: 0,
        ease: "power3.inOut",
        // onComplete: () => {
        //   gsap.set(".selectPlayer-container", { display: "none" });
        // },
      });
    }
  }, [removeSelectPlayer]);

  return (
    <div className="selectPlayer-container hidden">
      <h2 className="fixed z-40 top-4 w-full text-center font-Jolly-Lodger text-6xl lg:text-7xl text-[#E2DFD0] select-title">
        Select Player
      </h2>
      <div className="fixed z-40 -bottom-4 lg:bottom-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-4">
        <button
          className="fem-btn border border-[#E2DFD0] rounded-full p-2 group"
          onClick={() => {
            setCameraAnimation(2);
            setPlayerSelected("Carole");
            setIsMale(false);
          }}
        >
          <GiFemale
            size={40}
            color="#E2DFD0"
            className="group-hover:scale-110 transition-transform duration-500"
          />
        </button>
        <button
          className="male-btn border border-[#E2DFD0] rounded-full p-2 group"
          onClick={() => {
            setCameraAnimation(3);
            setPlayerSelected("Chris");
            setIsMale(true);
          }}
        >
          <GiMale
            size={40}
            color="#E2DFD0"
            className="group-hover:scale-110 transition-transform duration-500"
          />
        </button>
      </div>
      <div className="character Carole font-Kanit fixed z-40 text-[#E2DFD0] bottom-20 lg:top-20 lg:bottom-auto p-4 text-end lg:text-start max-w-lg lg:right-1/2">
        <div className="overflow-hidden">
          <h2 className="player-text text-3xl lg:text-5xl">Carole</h2>
        </div>
        <div className="overflow-hidden">
          <p className="player-text text-lg lg:text-2xl">
            <span className="italic mr-1">Age:</span> 29
          </p>
        </div>
        <div className="overflow-hidden">
          <p className="player-text text-lg lg:text-2xl">
            <span className="italic mr-1">Occupation:</span> Forest Biologist
          </p>
        </div>
        <div className="overflow-hidden">
          <p className="player-text mt-3 text-sm lg:text-base font-light">
            Carole grew up surrounded by forests and has always felt a deep
            connection to nature. After years of studying the most uncharted
            ecosystems, she's developed a sixth sense for detecting danger among
            the trees. Persistent and analytical, her life has been marked by an
            unyielding quest to uncover the mysteries of the forest. But this
            time, the mist is thicker, and the secrets of these woods are darker
            than she ever imagined.
          </p>
        </div>
        <div className="overflow-hidden">
          <button
            className="player-text mt-3 py-1 border border-[#E2DFD0] relative group"
            onClick={() => {
              setRemoveSelectPlayer(true);
              setIsLobby(false);
              setStopMusic(true);
              // goToGame();
            }}
          >
            <span className="text-xl lg:text-3xl font-Jolly-Lodger px-3 relative z-10">
              Go to the Forest
            </span>
            <div className="absolute w-full h-full scale-x-0 bg-[#481E14] origin-left group-hover:scale-x-100 transition-transform duration-500 -z-0 top-0 left-0"></div>
          </button>
        </div>
      </div>

      <div className="character Chris font-Kanit fixed z-40 text-[#E2DFD0] bottom-20 lg:top-20 lg:bottom-auto p-4 lg:text-end max-w-lg lg:left-1/2">
        <div className="overflow-hidden">
          <h2 className="player-text text-3xl lg:text-5xl">Chris</h2>
        </div>
        <div className="overflow-hidden">
          <p className="player-text text-lg lg:text-2xl">
            <span className="italic mr-1">Age:</span> 32
          </p>
        </div>
        <div className="overflow-hidden">
          <p className="player-text text-lg lg:text-2xl">
            <span className="italic mr-1">Occupation:</span> Ex-Military, Urban
            Survivor
          </p>
        </div>
        <div className="overflow-hidden">
          <p className="player-text mt-3 text-sm lg:text-base font-light">
            Chris, a hardened veteran, spent years confronting threats in urban
            zones before retiring to a quieter life. His ability to stay calm
            and act under pressure makes him an expert in survival. After losing
            friends on critical missions, he prefers solitude and self-reliance,
            but this time, the forest he's chosen for escape holds unexpected
            horrors, and facing them will be his ultimate test.
          </p>
        </div>
        <div className="overflow-hidden">
          <button
            className="player-text mt-3 py-1 border border-[#E2DFD0] relative group"
            onClick={() => {
              setRemoveSelectPlayer(true);
              setIsLobby(false);
              setStopMusic(true);
              // goToGame();
            }}
          >
            <span className="text-xl lg:text-3xl font-Jolly-Lodger px-3 relative z-10">
              Go to the Forest
            </span>
            <div className="absolute w-full h-full scale-x-0 bg-[#481E14] origin-left group-hover:scale-x-100 transition-transform duration-500 -z-0 top-0 left-0"></div>
          </button>
        </div>
      </div>
    </div>
  );
};
