import { useState, useRef } from "react";

export const useGameLogic = () => {
  const [gameOver, setGameOver] = useState(false);
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [kills, setKills] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [zombies, setZombies] = useState([]); // Estado para manejar los zombies
  const characterRef = useRef();
  const zombiesRef = useRef([]); // Array de referencias para los zombies

  // Estado de la salud de los zombies
  const [zombiesHealth, setZombiesHealth] = useState(Array(10).fill(100));

  // Funciones para manejar el juego
  const startGame = () => {
    setIsRunning(true);
    setIsPaused(false);
    setGameOver(false);
    setHealth(100);
    setScore(0);
    setKills(0);
    setTime(0);
    setZombiesHealth(Array(10).fill(100)); // Reiniciar la salud de los zombies
  };

  const pauseGame = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const resumeGame = () => {
    setIsPaused(false);
    setIsRunning(true);
  };

  const endGame = () => {
    setIsRunning(false);
    setIsPaused(false);
    setGameOver(true);
  };

  // Actualizar la salud del jugador
  const updateHealth = (value) => {
    setHealth((prevHealth) => Math.min(100, Math.max(0, prevHealth + value)));
  };

  // Actualizar la puntuación del jugador
  const updateScore = (value) => {
    setScore((prevScore) => prevScore + value);
  };

  // Actualizar el conteo de muertes y eliminar zombies
  const updateKills = (zombieIndex) => {
    setKills((prevKills) => prevKills + 1);
    setZombies((prevZombies) =>
      prevZombies.filter((_, i) => i !== zombieIndex)
    );
    setZombiesHealth((prevHealth) =>
      prevHealth.filter((_, i) => i !== zombieIndex)
    );
  };

  // Actualizar el tiempo de juego
  const updateTime = (value) => {
    setTime((prevTime) => prevTime + value);
  };

  return {
    gameOver,
    health,
    score,
    kills,
    time,
    isRunning,
    isPaused,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    updateHealth,
    updateScore,
    updateKills,
    updateTime,
    zombies,
    setZombies,
    characterRef,
    zombiesRef,
    zombiesHealth,
    setZombiesHealth,
  };
};
