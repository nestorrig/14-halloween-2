import { useEffect, useRef, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useGameContext } from "../context/GameContext";
import * as THREE from "three";
import { useGame } from "ecctrl";
import { useGraph, useThree } from "@react-three/fiber";

const capsuleRadius = 0.8;
const capsuleHalfHeight = 0.8;
const attackDistance = 1;
const detectDistance = 8;

export function useZombie(onDeath) {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/characters/Zombie_2.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions, mixer } = useAnimations(animations, group);
  const { scene: threeScene } = useThree();

  const { playerPosition, setPlayerHealth, setHitReceived } = useGameContext();

  // Replace state with refs
  const zombieState = useRef("patrolling");
  const animation = useRef("Armature|Walk");
  const health = useRef(100);
  const zombieHitReceived = useRef(0);
  const direction = useRef(new THREE.Vector3());
  const zombieIsDead = useRef(false);

  const growlTimeout = useRef(null);
  const patrolTimeout = useRef(null);
  const lastDamageTime = useRef(0);
  const lastHitTime = useRef(0);
  const controller = useGame();
  let speed = 0.03;

  const changeAnimation = (newAnimation) => {
    if (animation.current !== newAnimation && actions[newAnimation]) {
      actions[animation.current]?.fadeOut(0.5);
      actions[newAnimation].reset().fadeIn(0.5).play();
      animation.current = newAnimation;
    }
  };

  const handleDeath = () => {
    changeAnimation("Armature|Die");
    zombieIsDead.current = true;
    actions["Armature|Die"].clampWhenFinished = true;
    actions["Armature|Die"].setLoop(THREE.LoopOnce);
    actions["Armature|Die"].play();

    mixer.addEventListener("finished", () => {
      console.log("Zombie died");
      onDeath();
      threeScene.remove(group.current);
    });
  };

  const randomDirection = () => {
    const angle = Math.random() * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)).normalize();
  };

  const patrol = () => {
    group.current.position.add(direction.current.clone().multiplyScalar(speed));
    const targetDirection = direction.current.clone().setY(0).normalize();
    const angle = Math.atan2(targetDirection.x, targetDirection.z);
    group.current.rotation.set(0, angle, 0);
  };

  const chasePlayer = (playerPos, zombiePosition) => {
    const directionToPlayer = new THREE.Vector3()
      .subVectors(playerPos, zombiePosition)
      .normalize();

    if (directionToPlayer.length() > 0.01) {
      group.current.position.add(directionToPlayer.multiplyScalar(speed));
      group.current.lookAt(playerPos);
    }
  };

  const scheduleGrowl = () => {
    const interval = Math.random() * (20 - 10) * 1000 + 10000;
    growlTimeout.current = setTimeout(() => {
      if (zombieState.current === "patrolling") {
        zombieState.current = "growling";
        changeAnimation("Armature|Scream");

        setTimeout(() => {
          zombieState.current = "patrolling";
          changeAnimation("Armature|Walk");
          scheduleGrowl();
        }, 2000);
      }
    }, interval);
  };

  const schedulePatrol = () => {
    if (zombieIsDead.current) return;
    const interval = Math.random() * (10 - 4) * 1000 + 4000;
    patrolTimeout.current = setTimeout(() => {
      if (zombieState.current === "patrolling") {
        direction.current = randomDirection();
        schedulePatrol();
      }
    }, interval);
  };

  useEffect(() => {
    if (zombieIsDead.current) {
      clearTimeout(growlTimeout.current);
      clearTimeout(patrolTimeout.current);
      return;
    }

    scheduleGrowl();
    schedulePatrol();

    return () => {
      clearTimeout(growlTimeout.current);
      clearTimeout(patrolTimeout.current);
    };
  }, []);

  const receiveDamage = (damage) => {
    health.current = Math.max(0, health.current - damage);
    zombieHitReceived.current = 0;
  };

  const changeEmissive = (color) => {
    Object.values(materials).forEach((material) => {
      material.emissive = new THREE.Color(color);
    });
  };

  useEffect(() => {
    console.log("damage received");

    if (zombieHitReceived.current === 0) return;
    changeEmissive(0xff0000);
    setTimeout(() => changeEmissive(0x000000), 300);
    if (zombieHitReceived.current === 1) {
      receiveDamage(50);
    } else if (zombieHitReceived.current === 2) {
      receiveDamage(35);
    }
  }, [lastDamageTime.current]);

  const updateZombie = () => {
    if (!group.current || zombieIsDead.current) return;

    const zombiePosition = group.current.getWorldPosition(new THREE.Vector3());
    const playerPos = new THREE.Vector3(...playerPosition);
    const distanceToPlayer = zombiePosition.distanceTo(playerPos);

    console.log(distanceToPlayer);

    switch (zombieState.current) {
      case "growling":
        if (distanceToPlayer < detectDistance) return;
        setTimeout(() => {
          zombieState.current = "patrolling";
          changeAnimation("Armature|Walk");
        }, 1000);
        break;

      case "attacking":
        if (distanceToPlayer > attackDistance) {
          zombieState.current = "patrolling";
        } else {
          changeAnimation("Armature|Attack");
        }
        break;

      case "patrolling":
        if (distanceToPlayer < detectDistance) {
          zombieState.current = "attacking";
          changeAnimation("Armature|Running_Crawl");
          speed = 0.2;
          chasePlayer(playerPos, zombiePosition);
        } else {
          changeAnimation("Armature|Walk");
          speed = 0.03;
          patrol();
        }
        break;

      case "dying":
        handleDeath();
        break;

      default:
        break;
    }

    if (distanceToPlayer < attackDistance) {
      const now = performance.now();
      if (
        animation.current === "Armature|Attack" &&
        now - lastHitTime.current > 1500
      ) {
        setPlayerHealth((prev) => prev - 1);
        setHitReceived(true);
        lastHitTime.current = now;
        setTimeout(() => setHitReceived(false), 1000);
      }

      if (
        controller.curAnimation === "CharacterArmature|Punch_Left" &&
        now - lastDamageTime.current > 500
      ) {
        zombieHitReceived.current = 2;
        // changeEmissive(0xff0000); // Indicador visual de daño
        // receiveDamage(35);
        lastDamageTime.current = now;
        // setTimeout(() => changeEmissive(0x000000), 300); // Reinicia el color después de 300 ms
      }

      if (
        controller.curAnimation === "CharacterArmature|Gun_Shoot" &&
        now - lastDamageTime.current > 500
      ) {
        zombieHitReceived.current = 1;
        // changeEmissive(0xff0000);
        // receiveDamage(50);
        lastDamageTime.current = now;
        // setTimeout(() => changeEmissive(0x000000), 300);
      }
    }

    if (health.current <= 0 && zombieState.current !== "dying") {
      zombieState.current = "dying";
    }

    if (distanceToPlayer > 100) handleDeath();
  };

  return {
    group,
    zombieState: zombieState.current,
    zombieIsDead: zombieIsDead.current,
    nodes,
    materials,
    updateZombie,
    capsuleRadius,
    capsuleHalfHeight,
  };
}
