import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { FirstPersonControls, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import Terrain from "three.terrain.js"; // Asegúrate de que la librería está instalada y configurada
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useControls } from "leva";

function ProceduralTerrain() {
  const terrainRef = useRef(); // Referencia para el grupo del terreno

  // Texturas para el terreno

  const models = [
    useLoader(GLTFLoader, "/models/nature/Pine.glb").scene,
    useLoader(GLTFLoader, "/models/nature/Rock Medium.glb").scene,
    useLoader(GLTFLoader, "/models/nature/Bush with Flowers.glb").scene,
    useLoader(GLTFLoader, "/models/nature/Tree.glb").scene,
  ];

  models.forEach((model) => {
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  });

  const [t1, t2, t3, t4] = useLoader(THREE.TextureLoader, [
    "/textures/terrain/sand1.jpg",
    "/textures/terrain/grass1.jpg",
    "/textures/terrain/stone1.jpg",
    "/textures/terrain/snow1.jpg",
  ]);

  useEffect(() => {
    const material = Terrain.generateBlendedMaterial(
      [
        // The first texture is the base; other textures are blended in on top.
        { texture: t1 },
        // Start blending in at height -80; opaque between -35 and 20; blend out by 50
        { texture: t2, levels: [-80, -35, 20, 50] },
        { texture: t3, levels: [20, 50, 60, 85] },
        // How quickly this texture is blended in depends on its x-position.
        {
          texture: t4,
          glsl: "1.0 - smoothstep(65.0 + smoothstep(-256.0, 256.0, vPosition.x) * 10.0, 80.0, vPosition.z)",
        },
        // Use this texture if the slope is between 27 and 45 degrees
        {
          texture: t3,
          glsl: "slope > 0.7853981633974483 ? 0.2 : 1.0 - smoothstep(0.47123889803846897, 0.7853981633974483, slope) + 0.2",
        },
      ],
      new THREE.MeshStandardMaterial({
        roughness: 1,
        metalness: 0,
      })
    );

    const xSegments = 48;
    const ySegments = 48;
    const size = 264;

    // Crear el terreno con la librería THREE.Terrain
    const terrain = new Terrain({
      easing: Terrain.EaseInWeak,
      frequency: 2,
      heightmap: Terrain.Fault, // Cambiado a "Fault" para un estilo más montañoso
      material: material,
      maxHeight: 20,
      minHeight: -10,
      steps: 3,
      xSegments: xSegments,
      xSize: size,
      ySegments: ySegments,
      ySize: size,
    });

    console.log(terrain);
    terrain.scene.receiveShadow = true; // Permitir que el terreno reciba sombras
    terrain.mesh.castShadow = true; // Permitir que el terreno emita sombras
    terrain.mesh.receiveShadow = true; // Permitir que el terreno reciba sombras

    const terrainScene = terrain.getScene(); // Obtener la escena que contiene el terreno
    console.log(terrainScene);

    terrainRef.current.add(terrainScene); // Añadir el terreno a la referencia React

    // Añadir vegetación (foliage) aleatoriamente sobre el terreno
    const geo = terrainScene.children[0].geometry;

    for (let i = 0; i < models.length; i++) {
      const newAmbient = Terrain.ScatterMeshes(geo, {
        mesh: models[i],
        w: xSegments,
        h: ySegments,
        spread: 0.02,
        randomness: Math.random,
      });

      terrainScene.add(newAmbient);
    }

    // Limpiar el terreno cuando el componente se desmonte
    return () => {
      if (terrainRef.current) terrainRef.current.remove(terrainScene);
    };
  }, []);

  return <group ref={terrainRef}></group>; // Devolvemos el grupo con el terreno
}

function App() {
  const { position } = useControls({
    position: {
      x: 0,
      y: 50,
      z: 0,
    },
  });

  return (
    <Canvas shadows>
      {/* <perspectiveCamera position={[0, -10, 0]} fov={45} /> */}
      <ambientLight intensity={1} />
      <directionalLight
        position={[position.x, position.y, position.z]}
        intensity={1}
        castShadow
      />
      <group position={[0, -30, 0]}>
        <ProceduralTerrain />
      </group>
      <OrbitControls />
      {/* <FirstPersonControls movementSpeed={15} lookSpeed={0.05} /> */}
    </Canvas>
  );
}

export default App;
