import React, { useEffect } from "react";
import { useFrame, useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";

const capsuleRadius = 1.2;
const capsuleHalfHeight = 0.5;
const rayOriginOffest = { x: 0, y: -capsuleHalfHeight, z: 0 };
const slopeRayOriginOffest = capsuleRadius - 0.03;

export function Zombie(props) {
  const bodyContactForce = React.useMemo(() => new THREE.Vector3(), []);
  const group = React.useRef();
  const { scene, animations } = useGLTF("/models/characters/Zombie.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  const speed = 0.02; // Velocidad de movimiento del zombie
  const [groupPosition, setGroupPosition] = React.useState([0, 0, 0]);

  console.log(Object.keys(actions));

  useFrame(() => {
    if (!group.current) return;
    // console.log(group.current.position);

    // const zombiePosition = group.current.position;
    // const playerPosition = new THREE.Vector3(0, 0, 0); // Posición fija del jugador (puede cambiar)

    // const distance = zombiePosition.distanceTo(playerPosition);

    // if (distance < 5 && distance > 1.5) {
    //   if (actions["Armature|Run"]) {
    //     actions["Armature|Run"].reset().fadeIn(0.5).play();
    //   }

    //   const direction = new THREE.Vector3()
    //     .subVectors(playerPosition, zombiePosition)
    //     .normalize();
    //   zombiePosition.add(direction.multiplyScalar(speed));
    // }

    // if (distance <= 1.5) {
    //   if (actions["Armature|Attack"]) {
    //     actions["Armature|Attack"].reset().fadeIn(0.5).play();
    //   }
    // }

    // if (distance > 5) {
    //   if (actions["Armature|Idle"]) {
    //     actions["Armature|Idle"].reset().fadeIn(0.5).play();
    //   }
    // }
  });

  React.useEffect(() => {
    if (!group.current) return;

    const { position } = group.current;
    setGroupPosition([position.x, position.y, position.z]);
  }, [group.current]);

  // Animación inicial
  React.useEffect(() => {
    if (!actions["Armature|Idle"]) return;
    actions["Armature|Idle"].reset().fadeIn(0.5).play();
    return () => actions["Armature|Idle"].fadeOut(0.5);
  }, [actions]);

  return (
    <RigidBody
      colliders={false}
      type="dynamic" // Cuerpo dinámico
      lockRotations={[true, true, true]} // Bloquear todas las rotaciones para mayor estabilidad
      enabledRotations={[false, true, false]}
      linearDamping={0.5} // Para suavizar el movimiento
      angularDamping={1.0} // Reducir las rotaciones no deseadas
      {...props}
    >
      <CapsuleCollider
        name="zombie-capsule-collider"
        args={[capsuleHalfHeight, capsuleRadius]}
        position={[
          groupPosition[0] + capsuleRadius / 5,
          groupPosition[1] + capsuleHalfHeight * 3,
          groupPosition[2] + capsuleRadius / 5,
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

useGLTF.preload("/models/characters/Zombie.glb");
