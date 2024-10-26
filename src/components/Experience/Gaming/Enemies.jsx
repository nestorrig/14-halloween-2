// Enemies.js
import React, { useState, useCallback } from "react";
import { Zombie } from "../Characters/Zombie2";

const randomPosition = () =>
  Math.floor(Math.random() * 20) * (Math.random() > 0.5 ? 1 : -1);

export const Enemies = () => {
  const [zombieKey, setZombieKey] = useState(0);
  const [position, setPosition] = useState([
    randomPosition(),
    30,
    randomPosition(),
  ]);

  const respawnZombie = useCallback(() => {
    setPosition([randomPosition(), 30, randomPosition()]);
    setZombieKey((prevKey) => prevKey + 1); // Cambiamos el `key` para recrear el zombie
    console.log(position);
  }, []);

  return (
    <Zombie
      key={zombieKey}
      position={position}
      scale={0.5}
      onDeath={respawnZombie} // Pasamos `respawnZombie` para invocar al morir
    />
  );
};
