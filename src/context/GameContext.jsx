import { createContext, useContext, useRef, useState } from "react";

// Crear el contexto para el juego
const GameContext = createContext();

// Proveedor del contexto donde estará la lógica del juego
export const GameProvider = ({ children }) => {
  const playerRef = useRef();
  const zombiesRef = useRef([]); // Referencias a todos los zombies
  const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [hitReceived, setHitReceived] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [cameraAnimation, setCameraAnimation] = useState(0);
  const [initUILobby, setInitUILobby] = useState(false);
  const [initSelectPlayer, setInitSelectPlayer] = useState(false);
  const [isLobby, setIsLobby] = useState(true);
  const [isMale, setIsMale] = useState(null);
  const [isUIGame, setIsUIGame] = useState(false);
  const [stopMusic, setStopMusic] = useState(false);
  return (
    <GameContext.Provider
      value={{
        playerRef,
        playerPosition,
        setPlayerPosition,
        zombiesRef,
        playerHealth,
        setPlayerHealth,
        hitReceived,
        setHitReceived,
        isDead,
        setIsDead,
        cameraAnimation,
        setCameraAnimation,
        initUILobby,
        setInitUILobby,
        initSelectPlayer,
        setInitSelectPlayer,
        isLobby,
        setIsLobby,
        isMale,
        setIsMale,
        isUIGame,
        setIsUIGame,
        stopMusic,
        setStopMusic,
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
