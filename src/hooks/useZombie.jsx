import { useEffect, useRef, useState, useMemo } from "react";
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
  const [zombieState, setZombieState] = useState("patrolling");
  const [animation, setAnimation] = useState("Armature|Walk");
  const [health, setHealth] = useState(100);
  const [zombieHitReceived, setZombieHitReceived] = useState(0);
  const [direction, setDirection] = useState(new THREE.Vector3());
  const [zombieIsDead, setZombieIsDead] = useState(false);
  const growlTimeout = useRef(null);
  const patrolTimeout = useRef(null);
  const controller = useGame();
  let speed = 0.03;

  const handleDeath = () => {
    changeAnimation("Armature|Die");
    setZombieIsDead(true);
    actions["Armature|Die"].clampWhenFinished = true;
    actions["Armature|Die"].setLoop(THREE.LoopOnce);
    actions["Armature|Die"].play();

    mixer.addEventListener("finished", () => {
      console.log("Zombie died");
      onDeath();
      threeScene.remove(group.current);
    });
  };

  const changeAnimation = (newAnimation) => {
    if (animation !== newAnimation && actions[newAnimation]) {
      actions[animation]?.fadeOut(0.5);
      actions[newAnimation].reset().fadeIn(0.5).play();
      setAnimation(newAnimation);
    }
  };

  const randomDirection = () => {
    const angle = Math.random() * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)).normalize();
  };

  const patrol = () => {
    group.current.position.add(direction.clone().multiplyScalar(speed));
    const targetDirection = direction.clone().setY(0).normalize();
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
      if (zombieState === "patrolling") {
        setZombieState("growling");
        changeAnimation("Armature|Scream");

        setTimeout(() => {
          setZombieState("patrolling");
          changeAnimation("Armature|Walk");
          scheduleGrowl();
        }, 2000);
      }
    }, interval);
  };

  const schedulePatrol = () => {
    if (zombieIsDead) return;
    const interval = Math.random() * (10 - 4) * 1000 + 4000;
    patrolTimeout.current = setTimeout(() => {
      if (zombieState === "patrolling") {
        setDirection(randomDirection());
        schedulePatrol();
      }
    }, interval);
  };

  useEffect(() => {
    if (zombieIsDead) {
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
  }, [zombieState]);

  const receiveDamage = (damage) => {
    setHealth((prevHealth) => Math.max(0, prevHealth - damage));
    setZombieHitReceived(0);
  };

  const changeEmissive = (color) => {
    for (const key in materials) {
      if (Object.prototype.hasOwnProperty.call(materials, key)) {
        const element = materials[key];
        element.emissive = new THREE.Color(color);
      }
    }
  };

  useEffect(() => {
    if (zombieHitReceived === 0) return;
    changeEmissive(0xff0000);
    setTimeout(() => changeEmissive(0x000000), 300);
    if (zombieHitReceived === 1) {
      receiveDamage(50);
    } else if (zombieHitReceived === 2) {
      receiveDamage(35);
    }
  }, [zombieHitReceived]);

  const updateZombie = () => {
    if (!group.current || zombieIsDead) return;

    const zombiePosition = group.current.getWorldPosition(new THREE.Vector3());
    const playerPos = new THREE.Vector3(...playerPosition);
    const distanceToPlayer = zombiePosition.distanceTo(playerPos);
    // console.log(distanceToPlayer);

    switch (zombieState) {
      case "growling":
        if (distanceToPlayer < detectDistance) return;
        setTimeout(() => {
          setZombieState("patrolling");
          changeAnimation("Armature|Walk");
        }, 1000);
        break;

      case "attacking":
        if (distanceToPlayer > attackDistance) {
          setZombieState("patrolling");
        } else {
          changeAnimation("Armature|Attack");
        }
        break;

      case "patrolling":
        if (distanceToPlayer < detectDistance) {
          setZombieState("attacking");
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
      if (animation === "Armature|Attack") {
        if (actions[animation].time > 0.9 && actions[animation].time < 1.2) {
          setPlayerHealth((prevHealth) => prevHealth - 1);
          setHitReceived(true);
          setTimeout(() => setHitReceived(false), 1000);
        }
      }

      if (controller.curAnimation === "CharacterArmature|Punch_Left") {
        setZombieHitReceived(2);
      }
      if (controller.curAnimation === "CharacterArmature|Gun_Shoot") {
        setZombieHitReceived(1);
      }
    }

    if (health <= 0 && zombieState !== "dying") {
      setZombieState("dying");
    }
  };

  return {
    group,
    zombieState,
    zombieIsDead,
    nodes,
    materials,
    updateZombie,
    capsuleRadius,
    capsuleHalfHeight,
  };
}
