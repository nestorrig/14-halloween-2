import { useGameContext } from "../../context/GameContext";

export const Health = () => {
  const { playerHealth } = useGameContext();
  return (
    <div className="fixed z-30 top-4 left-4 font-Jolly-Lodger text-2xl text-[#E2DFD0]">
      Health: {playerHealth}
    </div>
  );
};
