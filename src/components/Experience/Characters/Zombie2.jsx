import React, { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useZombie } from "../../../hooks/useZombie";

export function Zombie({ position, scale, onDeath }) {
  useEffect(() => {
    console.log("Zombie mounted");
  }, []);


  const {
    group,
    zombieIsDead,
    nodes,
    materials,
    updateZombie,
    capsuleRadius,
    capsuleHalfHeight,
  } = useZombie(onDeath); // Pasamos `onDeath` para que se invoque al morir

  useFrame(() => {
    if (!zombieIsDead) updateZombie(); // Solo actualizar si está vivo
  });

  return (
    <RigidBody
      colliders={false}
      type="dynamic"
      lockRotations={[true, false, true]}
      enabledRotations={[false, true, false]}
      linearDamping={0.5}
      angularDamping={1.0}
      friction={5}
      position={position}
      scale={scale}
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

      <group
        ref={group}
        dispose={null}
        position={position}
        scale={[0.7, 0.7, 0.7]}
      >
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
