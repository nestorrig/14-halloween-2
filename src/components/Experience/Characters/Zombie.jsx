import React, { useEffect, useState, useRef, useMemo } from "react";
import { useFrame, useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useGameContext } from "../../../context/GameContext";

const capsuleRadius = 0.8;
const capsuleHalfHeight = 0.8;
const attackDistance = 0.5;
const detectDistance = 5;

export function Zombie(props) {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/characters/Zombie_2.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  const { playerPosition } = useGameContext(); // Obtener la posición del jugador
  const [zombieState, setZombieState] = useState("patrolling"); // Estados: "patrolling", "attacking", "growling", "dying"
  const [animation, setAnimation] = useState("Armature|Walk"); // Animación actual
  const [health, setHealth] = useState(100); // Salud del zombie
  const [direction, setDirection] = useState(new THREE.Vector3()); // Dirección del movimiento
  const [speed, setSpeed] = useState(0.03);
  const growlInterval = useRef(null);

  // Función para cambiar animaciones
  const changeAnimation = (newAnimation) => {
    if (animation !== newAnimation) {
      setAnimation(newAnimation);
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
    group.current.position.add(directionToPlayer.multiplyScalar(speed));
    group.current.lookAt(playerPos); // Mirar hacia el jugador
  };

  // Manejo de gruñidos ocasionales y cambio de dirección durante la patrulla
  useEffect(() => {
    if (zombieState === "patrolling") {
      setDirection(randomDirection()); // Cambiar la dirección al patrullar
    }

    const patrolInterval = setInterval(() => {
      if (zombieState === "patrolling") {
        setDirection(randomDirection()); // Cambiar la dirección aleatoriamente
      }
    }, 4000);

    growlInterval.current = setInterval(() => {
      if (zombieState === "patrolling") {
        setZombieState("growling");
        changeAnimation("Armature|Scream");
      }
    }, 10000); // Gruñir cada 10 segundos

    return () => {
      clearInterval(patrolInterval);
      clearInterval(growlInterval.current);
    };
  }, [zombieState]);

  // Cambiar animación al estado correspondiente
  useEffect(() => {
    if (!actions[animation]) return;
    actions[animation].reset().fadeIn(0.5).play();

    return () => actions[animation].fadeOut(0.5);
  }, [animation, actions]);

  // Manejo por frame
  useFrame(() => {
    if (!group.current) return;

    const zombiePosition = group.current.getWorldPosition(new THREE.Vector3());
    const playerPos = new THREE.Vector3(...playerPosition);
    const distanceToPlayer = zombiePosition.distanceTo(playerPos);

    // Manejo del estado del zombie
    switch (zombieState) {
      case "growling":
        setTimeout(() => {
          setZombieState("patrolling");
          changeAnimation("Armature|Walk");
        }, 2000); // Volver a patrullar después de 2 segundos de gruñido
        break;

      case "attacking":
        if (distanceToPlayer > attackDistance) {
          setZombieState("patrolling");
          changeAnimation("Armature|Walk");
        }
        break;

      case "patrolling":
        if (distanceToPlayer < detectDistance) {
          changeAnimation("Armature|Running_Crawl");
          setSpeed(0.12); // Aumentar la velocidad al detectar al jugador
          chasePlayer(playerPos, zombiePosition); // Perseguir al jugador
        } else {
          setSpeed(0.03); // Restaurar la velocidad de patrulla
          patrol(); // Continuar patrullando
        }
        break;

      case "dying":
        changeAnimation("Armature|Die");
        break;

      default:
        break;
    }

    // Si la salud del zombie llega a 0, activar la animación de muerte
    if (health <= 0 && zombieState !== "dying") {
      setZombieState("dying");
    }
  });

  // Recibir daño
  const receiveDamage = (damage) => {
    setHealth((prevHealth) => Math.max(0, prevHealth - damage));
  };

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
      <CapsuleCollider
        name="zombie-capsule-collider"
        args={[capsuleHalfHeight, capsuleRadius]}
        position={[
          group.current?.position.x || 0,
          group.current?.position.y + capsuleHalfHeight * 2 || 0,
          group.current?.position.z || 0,
        ]}
      />
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
