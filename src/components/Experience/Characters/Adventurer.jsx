/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.2 public/models/characters/Adventurer.glb -o src/components/Experience/Characters/Adventurer.jsx -r public 
*/

import React, { useEffect } from "react";
import { useFrame, useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useControls } from "leva";
import * as THREE from "three";
import { useGameContext } from "../../../context/GameContext";
import { useGame } from "ecctrl";

export function Adventurer(props) {
  const group = React.useRef();
  const { scene, animations } = useGLTF("/models/characters/Adventurer.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);
  const { scene: gunScene } = useGLTF("/models/weapons/Pistol.glb"); // Cargar arma
  const { position } = nodes.WristR; // Posición del hueso de la muñeca derecha
  const controller = useGame();

  useControls("Adventurer", {
    "Gun x": {
      value: gunScene.position.x,
      step: 0.01,
      onChange: (x) => (gunScene.position.x = x),
    },
    "Gun y": {
      value: gunScene.position.y,
      step: 0.01,
      onChange: (y) => (gunScene.position.y = y),
    },
    "Gun z": {
      value: gunScene.position.z,
      step: 0.01,
      onChange: (z) => (gunScene.position.z = z),
    },

    "Gun rotation x": {
      value: -0.11,
      min: -Math.PI * 2,
      max: Math.PI * 2,
      step: 0.01,
      onChange: (x) => (gunScene.rotation.x = x),
    },

    "Gun rotation y": {
      value: -0.11,
      min: -Math.PI * 2,
      max: Math.PI * 2,
      step: 0.01,
      onChange: (y) => (gunScene.rotation.y = y),
    },

    "Gun rotation z": {
      value: -4.94,
      min: -Math.PI * 2,
      max: Math.PI * 2,
      step: 0.01,
      onChange: (z) => (gunScene.rotation.z = z),
    },
  });

  const { playerRef, setPlayerPosition, playerHealth, hitReceived, setIsDead } =
    useGameContext();

  React.useEffect(() => {
    nodes.WristR.add(gunScene); // Agregar arma al hueso de la muñeca derecha
    gunScene.rotation.set(-0.11, -0.11, -4.94); // Ajustar la rotación si es necesario
    gunScene.position.set(
      position.x - 0.0001,
      position.y - 0.001,
      position.z - 0.0002
    ); // Ajustar la posición del arma en relación a la muñeca
    gunScene.scale.set(0.0015, 0.0015, 0.0015); // Ajustar la escala del arma
    return () => {
      nodes.WristR.remove(gunScene); // Remover arma del hueso de la muñeca dere
    };
  }, []);

  React.useEffect(() => {
    if (!group.current) return;
    console.log(controller);

    playerRef.current = group.current; // Actualiza la referencia del jugador
  }, [group, playerRef]);

  useFrame(() => {
    if (!group.current) return;

    const worldPosition = group.current.getWorldPosition(new THREE.Vector3());
    setPlayerPosition([worldPosition.x, worldPosition.y, worldPosition.z]);
  });

  const changeEmmisive = (color) => {
    for (const key in materials) {
      if (Object.prototype.hasOwnProperty.call(materials, key)) {
        const element = materials[key];
        element.emissive = new THREE.Color(color);
      }
    }
  };

  useEffect(() => {
    // console.log(playerHealth);

    if (playerHealth <= 0) {
      controller.action3();
      setIsDead(true);
      changeEmmisive(0xff0000);
      return;
    }
    if (hitReceived) {
      controller.action4();
      changeEmmisive(0xff0000);
      setTimeout(() => changeEmmisive(0x000000), 300);
    }
  }, [hitReceived, playerHealth]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="CharacterArmature"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <primitive object={nodes.Root} />
          </group>
          <group
            name="Adventurer_Feet"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              castShadow
              receiveShadow
              name="Adventurer_Feet_1"
              geometry={nodes.Adventurer_Feet_1.geometry}
              material={materials.Black}
              skeleton={nodes.Adventurer_Feet_1.skeleton}
            />
            <skinnedMesh
              castShadow
              receiveShadow
              name="Adventurer_Feet_2"
              geometry={nodes.Adventurer_Feet_2.geometry}
              material={materials.Grey}
              skeleton={nodes.Adventurer_Feet_2.skeleton}
            />
          </group>
          <group
            name="Adventurer_Legs"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              castShadow
              receiveShadow
              name="Adventurer_Legs_1"
              geometry={nodes.Adventurer_Legs_1.geometry}
              material={materials.Brown2}
              skeleton={nodes.Adventurer_Legs_1.skeleton}
            />
            <skinnedMesh
              castShadow
              receiveShadow
              name="Adventurer_Legs_2"
              geometry={nodes.Adventurer_Legs_2.geometry}
              material={materials.Brown}
              skeleton={nodes.Adventurer_Legs_2.skeleton}
            />
          </group>
          <group
            name="Adventurer_Body"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              castShadow
              receiveShadow
              name="Adventurer_Body_1"
              geometry={nodes.Adventurer_Body_1.geometry}
              material={materials.Green}
              skeleton={nodes.Adventurer_Body_1.skeleton}
            />
            <skinnedMesh
              castShadow
              receiveShadow
              name="Adventurer_Body_2"
              geometry={nodes.Adventurer_Body_2.geometry}
              material={materials.LightGreen}
              skeleton={nodes.Adventurer_Body_2.skeleton}
            />
            <skinnedMesh
              castShadow
              receiveShadow
              name="Adventurer_Body_3"
              geometry={nodes.Adventurer_Body_3.geometry}
              material={materials.Skin}
              skeleton={nodes.Adventurer_Body_3.skeleton}
            />
          </group>
          <group
            name="Adventurer_Head"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              castShadow
              receiveShadow
              name="Adventurer_Head_1"
              geometry={nodes.Adventurer_Head_1.geometry}
              material={materials.Skin}
              skeleton={nodes.Adventurer_Head_1.skeleton}
            />
            <skinnedMesh
              castShadow
              receiveShadow
              name="Adventurer_Head_2"
              geometry={nodes.Adventurer_Head_2.geometry}
              material={materials.Eyebrows}
              skeleton={nodes.Adventurer_Head_2.skeleton}
            />
            <skinnedMesh
              castShadow
              receiveShadow
              name="Adventurer_Head_3"
              geometry={nodes.Adventurer_Head_3.geometry}
              material={materials.Eye}
              skeleton={nodes.Adventurer_Head_3.skeleton}
            />
            <skinnedMesh
              castShadow
              receiveShadow
              name="Adventurer_Head_4"
              geometry={nodes.Adventurer_Head_4.geometry}
              material={materials.Hair}
              skeleton={nodes.Adventurer_Head_4.skeleton}
            />
          </group>
          <group
            name="Backpack"
            position={[0, 1.373, -0.117]}
            rotation={[-Math.PI / 2, 0, Math.PI]}
            scale={26.077}
          >
            <skinnedMesh
              castShadow
              receiveShadow
              name="Backpack_1"
              geometry={nodes.Backpack_1.geometry}
              material={materials.Brown}
              skeleton={nodes.Backpack_1.skeleton}
            />
            <skinnedMesh
              castShadow
              receiveShadow
              name="Backpack_2"
              geometry={nodes.Backpack_2.geometry}
              material={materials.Green}
              skeleton={nodes.Backpack_2.skeleton}
            />
            <skinnedMesh
              castShadow
              receiveShadow
              name="Backpack_3"
              geometry={nodes.Backpack_3.geometry}
              material={materials.LightGreen}
              skeleton={nodes.Backpack_3.skeleton}
            />
            <skinnedMesh
              castShadow
              receiveShadow
              name="Backpack_4"
              geometry={nodes.Backpack_4.geometry}
              material={materials.Gold}
              skeleton={nodes.Backpack_4.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/characters/Adventurer.glb");
useGLTF.preload("/models/weapons/Pistol.glb");