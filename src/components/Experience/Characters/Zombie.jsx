import React, { useEffect, useState, useRef, useMemo, act } from "react";
import { useFrame, useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useGameContext } from "../../../context/GameContext";
import { useGame } from "ecctrl";

const capsuleRadius = 0.8;
const capsuleHalfHeight = 0.8;
const attackDistance = 1;
const detectDistance = 8;

export function Zombie(props) {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/characters/Zombie_2.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions, mixer } = useAnimations(animations, group);

  const { playerPosition, setPlayerHealth, setHitReceived } = useGameContext(); // Obtener la posición del jugador
  const [zombieState, setZombieState] = useState("patrolling"); // Estados: "patrolling", "attacking", "growling", "dying"
  const [animation, setAnimation] = useState("Armature|Walk"); // Animación actual
  const [health, setHealth] = useState(100); // Salud del zombie
  const [zombieHitReceived, setZombieHitReceived] = useState(0); // Daño recibido
  const [direction, setDirection] = useState(new THREE.Vector3()); // Dirección del movimiento
  const [zombieIsDead, setZombieIsDead] = useState(false); // Estado de muerte
  const growlTimeout = useRef(null);
  const patrolTimeout = useRef(null);
  const controller = useGame();

  // Variable local para la velocidad
  let speed = 0.03;
  const randomGrowlLapse = () => {
    return Math.random() * (20 - 10) + 10;
  };

  const handleDeath = () => {
    changeAnimation("Armature|Die");
    setZombieIsDead(true);

    // Detener el mixer en el último frame de la animación
    actions["Armature|Die"].clampWhenFinished = true; // Mantener el último frame
    actions["Armature|Die"].setLoop(THREE.LoopOnce); // Reproducir solo una vez
    actions["Armature|Die"].play();

    mixer.addEventListener("finished", () => {
      console.log("Zombie died");
    });
  };

  // Función para cambiar animaciones con control de estado
  const changeAnimation = (newAnimation) => {
    if (animation !== newAnimation && actions[newAnimation]) {
      actions[animation]?.fadeOut(0.5); // Asegúrate de que la animación anterior termine
      actions[newAnimation].reset().fadeIn(0.5).play();
      setAnimation(newAnimation); // Actualiza el estado de animación
    }
  };

  // Movimiento aleatorio en X y Z
  const randomDirection = () => {
    const angle = Math.random() * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)).normalize();
  };

  // Patrullar aleatoriamente
  const patrol = () => {
    group.current.position.add(direction.clone().multiplyScalar(speed));
    const targetDirection = direction.clone().setY(0).normalize();
    const angle = Math.atan2(targetDirection.x, targetDirection.z);
    group.current.rotation.set(0, angle, 0); // Solo rotación en el eje Y
  };

  // Perseguir al jugador
  const chasePlayer = (playerPos, zombiePosition) => {
    const directionToPlayer = new THREE.Vector3()
      .subVectors(playerPos, zombiePosition)
      .normalize();

    // Verificar la distancia para evitar curvas innecesarias
    if (directionToPlayer.length() > 0.01) {
      group.current.position.add(directionToPlayer.multiplyScalar(speed));
      group.current.lookAt(playerPos); // Mirar hacia el jugador
    }
  };
  const scheduleGrowl = () => {
    const interval = Math.random() * (20 - 10) * 1000 + 10000; // Entre 10 y 20 segundos
    growlTimeout.current = setTimeout(() => {
      if (zombieState === "patrolling") {
        setZombieState("growling");
        changeAnimation("Armature|Scream");

        // Regresar a patrullaje después de gruñir
        setTimeout(() => {
          setZombieState("patrolling");
          changeAnimation("Armature|Walk");
          scheduleGrowl(); // Reprogramar gruñido
        }, 2000);
      }
    }, interval);
  };

  const schedulePatrol = () => {
    if (zombieIsDead) return;
    const interval = Math.random() * (10 - 4) * 1000 + 4000; // Entre 10 y 20 segundos
    patrolTimeout.current = setTimeout(() => {
      if (zombieState === "patrolling") {
        setDirection(randomDirection());
        schedulePatrol(); // Reprogramar patrullaje
      }
    }, interval);
  };

  // Manejo de gruñidos y cambio de dirección en patrullaje
  useEffect(() => {
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

  const changeEmmisive = (color) => {
    for (const key in materials) {
      if (Object.prototype.hasOwnProperty.call(materials, key)) {
        const element = materials[key];
        element.emissive = new THREE.Color(color);
      }
    }
  };

  useEffect(() => {
    if (zombieHitReceived === 0) return;
    changeEmmisive(0xff0000); // Cambiar color al recibir daño
    setTimeout(() => changeEmmisive(0x000000), 300); // Restaurar color
    if (zombieHitReceived === 1) {
      receiveDamage(50);
    } else if (zombieHitReceived === 2) {
      receiveDamage(35);
    }
  }, [zombieHitReceived]);

  // Lógica de estados y animaciones por frame
  useFrame(() => {
    if (!group.current) return;
    if (zombieIsDead) return;

    const zombiePosition = group.current.getWorldPosition(new THREE.Vector3());
    const playerPos = new THREE.Vector3(...playerPosition);
    const distanceToPlayer = zombiePosition.distanceTo(playerPos);
    console.log(distanceToPlayer);

    switch (zombieState) {
      case "growling":
        if (distanceToPlayer < detectDistance) return; // No gruñir si el jugador está cerca
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
          speed = 0.2; // Aumentar la velocidad durante la persecución
          chasePlayer(playerPos, zombiePosition);
        } else {
          changeAnimation("Armature|Walk");
          speed = 0.03; // Velocidad estándar de patrullaje
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
      console.log("close to player");

      if (animation === "Armature|Attack") {
        if (actions[animation].time > 0.9 && actions[animation].time < 1.2) {
          console.log("Attacking player");
          setPlayerHealth((prevHealth) => prevHealth - 1); // Dañar al jugador
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
      console.log(health);
    }

    // Muerte del zombie
    if (health <= 0 && zombieState !== "dying") {
      setZombieState("dying");
    }
  });

  return (
    <RigidBody
      colliders={false}
      type="dynamic"
      lockRotations={[true, false, true]} // Bloquear rotaciones para mayor estabilidad
      enabledRotations={[false, true, false]}
      linearDamping={0.5} // Para suavizar el movimiento
      angularDamping={1.0} // Reducir las rotaciones no deseadas
      friction={5} // Fricción para evitar deslizamientos
      {...props}
    >
      {!zombieIsDead && (
        <CapsuleCollider
          name="zombie-capsule-collider"
          args={[capsuleHalfHeight, capsuleRadius]}
          position={[
            group.current?.position.x || 0,
            group.current?.position.y + capsuleHalfHeight * 2 || 0,
            group.current?.position.z || 0,
          ]}
        />
      )}

      <group ref={group} {...props} dispose={null} scale={[0.7, 0.7, 0.7]}>
        <group name="Root_Scene">
          <group name="RootNode">
            <group name="Armature">
              <primitive object={nodes.mixamorigHips} />
            </group>
            <skinnedMesh
              castShadow
              receiveShadow
              name="Character"
              geometry={nodes.Character.geometry}
              material={materials.ColorSwatch}
              skeleton={nodes.Character.skeleton}
            />
          </group>
        </group>
      </group>
    </RigidBody>
  );
}

useGLTF.preload("/models/characters/Zombie_2.glb");
