/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.2 public/models/characters/Adventurer.glb -o src/components/Experience/Characters/Adventurer.jsx -r public 
*/

import React from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

export function Adventurer(props) {
  const group = React.useRef();
  const { scene, animations } = useGLTF("/models/characters/Adventurer.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

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
