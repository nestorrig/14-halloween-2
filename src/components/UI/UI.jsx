import { useGameContext } from "../../context/GameContext";

export const UI = () => {
  const { setCameraAnimation } = useGameContext();

  return (
    <div className="z-50 absolute w-20 h-10 flex flex-col gap-4">
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
      {/* <button className="bg-white" onClick={() => setCameraAnimation(0)}>
        Position 1
      </button> */}
    </div>
  );
};
