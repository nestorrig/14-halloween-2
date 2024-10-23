import { createContext, useContext, useRef, useState } from "react";

// Crear el contexto para el juego
const GameContext = createContext();

// Proveedor del contexto donde estará la lógica del juego
export const GameProvider = ({ children }) => {
  const playerRef = useRef();
  const zombiesRef = useRef([]); // Referencias a todos los zombies
  const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
  const [zombies, setZombies] = useState([]);

  return (
    <GameContext.Provider
      value={{
        playerRef,
        playerPosition,
        setPlayerPosition,
        zombiesRef,
        zombies,
        setZombies,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Hook personalizado para usar el contexto del juego
export const useGameContext = () => {
  return useContext(GameContext);
};
