//funcion para generar posicion aleatoria en ele eje x y z

import { Zombie } from "../Characters";

const randomPosition = () => {
  return Math.floor(Math.random() * 50) * (Math.random() > 0.5 ? 1 : -1);
};

const enemies = Array(20)
  .fill()
  .map(() => ({
    position: [randomPosition(), 30, randomPosition()],
    // health: 100,
  }));

console.log(enemies);

export const Enemies = () => {
  return enemies.map((enemy, i) => (
    <Zombie key={i} position={enemy.position} scale={0.5} />
  ));
  // return <Zombie position={[10, 30, 10]} scale={0.5} />;
};
