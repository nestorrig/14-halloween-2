import {
  OrbitControls,
  PerspectiveCamera,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { Ambient } from "./Enviroment";
import { useControls } from "leva";
import * as THREE from "three";
import { useEffect, useRef } from "react";

export const Lobby = () => {
  const Pine = useGLTF("/models/nature/Pine.glb");
  const Pine2 = useGLTF("/models/nature/Pine 2.glb");
  const PebbleRound = useGLTF("/models/nature/Pebble Round.glb");
  const Fern = useGLTF("/models/nature/Fern.glb");
  const Clover = useGLTF("/models/nature/Clover.glb");
  const Plant = useGLTF("/models/nature/Plant.glb");
  const Mushroom = useGLTF("/models/nature/Mushroom.glb");

  const group = useRef();
  const groupFem = useRef();
  const { scene, animations } = useGLTF("/models/characters/Adventurer.glb");
  const { scene: sceneFem, animations: animationsFem } = useGLTF(
    "/models/characters/Adventurer-fem.glb"
  );
  const { actions, mixer } = useAnimations(animations, group);
  const { actions: actionsFem, mixer: mixerFem } = useAnimations(
    animationsFem,
    groupFem
  );

  useEffect(() => {
    actions["CharacterArmature|Idle"].reset().fadeIn(0.5).play();
    actionsFem["CharacterArmature|Idle"].reset().fadeIn(0.5).play();
  }, [actions, actionsFem]);

  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true; // Proyectar sombra
        node.receiveShadow = true; // Recibir sombra
      }
    });
    sceneFem.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true; // Proyectar sombra
        node.receiveShadow = true; // Recibir sombra
      }
    });
  }, [scene, sceneFem]);

  const createVegetationClone = (model, position, scale = [1, 1, 1]) => {
    const clone = model.scene.clone();
    clone.position.set(...position);
    clone.scale.set(...scale);
    clone.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true; // Proyectar sombra
        node.receiveShadow = true; // Recibir sombra
      }
    });
    return clone;
  };

  return (
    <>
      {/* 28, 9, -3 */}
      {/* 28, 15, 7 */}
      <Ambient sunPosition={[28, 15, 7]} />
      <PerspectiveCamera position={[0, 2, 10]} makeDefault />
      <OrbitControls />
      <group>
        <mesh
          receiveShadow
          position={[0, 0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#1a4519" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Vegetación en la escena */}
      <group rotation={[0, 0, 0]} position={[0, 0, 0]}>
        {/* Pine */}
        <primitive object={createVegetationClone(Pine, [3, 0, -3])} />
        <primitive object={createVegetationClone(Pine, [10, 0, 2])} />
        <primitive object={createVegetationClone(Pine, [3, 0, 4])} />
        <primitive object={createVegetationClone(Pine, [-3, 0, 3])} />
        <primitive object={createVegetationClone(Pine, [-2, 0, 1])} />
        <primitive object={createVegetationClone(Pine, [-4, 0, -2])} />
        <primitive object={createVegetationClone(Pine, [-8, 0, 1])} />
        <primitive object={createVegetationClone(Pine, [-7, 0, 5])} />
        <primitive object={createVegetationClone(Pine, [7, 0, 3])} />
        <primitive object={createVegetationClone(Pine, [0, 0, -3])} />
        {/* Pine 2 */}
        <primitive object={createVegetationClone(Pine2, [2, 0, 0])} />
        <primitive object={createVegetationClone(Pine2, [6, 0, 0])} />
        <primitive object={createVegetationClone(Pine2, [0, 0, 0])} />
        <primitive object={createVegetationClone(Pine2, [-5, 0, 2])} />
        <primitive object={createVegetationClone(Pine2, [-9, 0, 4])} />
        <primitive object={createVegetationClone(Pine2, [2, 0, 0])} />
        <primitive object={createVegetationClone(Pine2, [1, 0, 1])} />
        <primitive object={createVegetationClone(Pine2, [-4, 0, 4])} />
        {/* Pebble Round */}
        <primitive object={createVegetationClone(PebbleRound, [0.5, 0, 1.7])} />
        <primitive object={createVegetationClone(PebbleRound, [5.5, 0, 3.6])} />
        <primitive
          object={createVegetationClone(PebbleRound, [-4.2, 0, 0.5])}
        />
        <primitive object={createVegetationClone(PebbleRound, [-1.6, 0, 6])} />
        {/* Fern */}
        <primitive
          object={createVegetationClone(Fern, [-3, 0, 6], [0.2, 0.2, 0.2])}
        />
        <primitive
          object={createVegetationClone(Fern, [4, 0, 4.5], [0.2, 0.2, 0.2])}
        />
        <primitive
          object={createVegetationClone(Fern, [3, 0, 2], [0.2, 0.2, 0.2])}
        />
        <primitive
          object={createVegetationClone(Fern, [-5, 0, -1], [0.2, 0.2, 0.2])}
        />
        {/* Clover */}
        <primitive object={createVegetationClone(Clover, [1.5, 0, 6])} />
        <primitive object={createVegetationClone(Clover, [-1, 0, -1.5])} />
        <primitive object={createVegetationClone(Clover, [5, 0, -1])} />
        <primitive object={createVegetationClone(Clover, [-3, 0, 1])} />
        {/* Plant */}
        <primitive object={createVegetationClone(Plant, [-6, 0, 2.5])} />
        <primitive object={createVegetationClone(Plant, [5, 0, 3.2])} />
        <primitive object={createVegetationClone(Plant, [0.5, 0, 3])} />
        <primitive object={createVegetationClone(Plant, [-3, 0, 4.5])} />
        {/* Mushroom */}
        <primitive object={createVegetationClone(Mushroom, [2, 0, 3])} />
        <primitive object={createVegetationClone(Mushroom, [-0.5, 0, 1])} />
        <primitive object={createVegetationClone(Mushroom, [-2, 0, 3])} />
      </group>

      {/* Personajes en la escena */}
      <group>
        <primitive
          ref={group}
          object={scene}
          position={[0.5, 0, 5]}
          scale={[1, 1, 1]}
        />
        <primitive
          ref={groupFem}
          object={sceneFem}
          position={[-0.5, 0, 5]}
          scale={[1, 1, 1]}
        />
      </group>
    </>
  );
};

// Pre-cargar modelos
useGLTF.preload("/models/nature/Pine.glb");
useGLTF.preload("/models/nature/Pine 2.glb");
useGLTF.preload("/models/nature/Pebble Round.glb");
useGLTF.preload("/models/nature/Fern.glb");
useGLTF.preload("/models/nature/Clover.glb");
useGLTF.preload("/models/nature/Plant.glb");
useGLTF.preload("/models/nature/Mushroom.glb");
useGLTF.preload("/models/characters/Adventurer.glb");
useGLTF.preload("/models/characters/Adventurer-fem.glb");
