import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import Terrain from "three.terrain.js";
import { useControls } from "leva";
import { RigidBody } from "@react-three/rapier";

function createSolidTexture(color) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d");
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

export function GenerativeTerrain() {
  const models = [
    {
      model: useLoader(GLTFLoader, "/models/nature/Pine.glb").scene,
      spread: 0.01,
    },
    {
      model: useLoader(GLTFLoader, "/models/nature/Pine 2.glb").scene,
      spread: 0.005,
    },
  ];

  const modelsWithoutPhysics = [
    {
      model: useLoader(GLTFLoader, "/models/nature/Pebble Round.glb").scene,
      spread: 0.01,
    },
    {
      model: useLoader(GLTFLoader, "/models/nature/Fern.glb").scene,
      spread: 0.01,
    },
    {
      model: useLoader(GLTFLoader, "/models/nature/Clover.glb").scene,
      spread: 0.01,
    },
    {
      model: useLoader(GLTFLoader, "/models/nature/Plant.glb").scene,
      spread: 0.01,
    },
    {
      model: useLoader(GLTFLoader, "/models/nature/Mushroom.glb").scene,
      spread: 0.01,
    },
  ];

  modelsWithoutPhysics[1].model.children[0].scale.set(0.3, 0.3, 0.3);

  models.forEach((model) => {
    model.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  });

  modelsWithoutPhysics.forEach((model) => {
    model.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  });

  const terrainRef = useRef(); // Referencia para el terreno
  const [terrainScene, setTerrainScene] = useState(null); // Almacenamos la escena del terreno para react
  const [decoScene, setDecoScene] = useState(null); // Almacenamos la decoración (árboles, rocas, etc.)
  const [decoSceneWithoutPhysics, setDecoSceneWithoutPhysics] = useState(null); // Almacenamos la decoración sin físicas
  const terrainControls = useControls("Terrain", {
    heightmap: {
      options: [
        "Cosine",
        "CosineLayers",
        "DiamondSquare",
        "Fault",
        "Hill",
        "HillIsland",
        "Particles",
        "Perlin",
        "PerlinDiamond",
        "PerlinLayers",
        "Simplex",
        "SimplexLayers",
        "Value",
        "Weierstrass",
      ],
      value: "DiamondSquare",
    },
    easing: {
      options: [
        "Linear",
        "EaseIn",
        "EaseInWeak",
        "EaseOut",
        "EaseInOut",
        "InEaseOut",
      ],
      value: "EaseInWeak",
    },
    size: {
      value: 150,
      min: 64,
      max: 512,
      step: 64,
    },
    Segments: {
      value: 64,
      min: 16,
      max: 64,
      step: 8,
    },
    maxHeight: {
      value: 27,
      min: 5,
      max: 120,
      step: 5,
    },
    minHeight: {
      value: -10,
      min: -50,
      max: 0,
      step: 5,
    },
    steps: {
      value: 8,
      min: 1,
      max: 8,
      step: 1,
    },
    sand: "#524d45",
    grass: "#1a4519",
    stone: "#3e2b2b",
    snow: "#f2efef",
  });

  useEffect(() => {
    const textureSand = createSolidTexture(terrainControls.sand);
    const textureGrass = createSolidTexture(terrainControls.grass);
    const textureStone = createSolidTexture(terrainControls.stone);
    const textureSnow = createSolidTexture(terrainControls.snow);

    textureGrass.colorSpace = THREE.SRGBColorSpace;
    textureStone.colorSpace = THREE.SRGBColorSpace;
    textureSnow.colorSpace = THREE.SRGBColorSpace;
    textureSand.colorSpace = THREE.SRGBColorSpace;

    const material = Terrain.generateBlendedMaterial(
      [
        { texture: textureSand },
        { texture: textureGrass, levels: [-80, -35, 20, 50] },
        { texture: textureStone, levels: [20, 50, 60, 75] },
        {
          texture: textureSnow,
          glsl: "1.0 - smoothstep(65.0 + smoothstep(-256.0, 256.0, vPosition.x) * 10.0, 80.0, vPosition.z)",
        },
        {
          texture: textureStone,
          glsl: "slope > 0.7853981633974483 ? 0.2 : 1.0 - smoothstep(0.47123889803846897, 0.7853981633974483, slope) + 0.2",
        },
      ],
      new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0 })
    );

    // Crear el terreno
    const terrain = new Terrain({
      easing: Terrain[terrainControls.easing],
      frequency: 2,
      heightmap: Terrain[terrainControls.heightmap],
      material: material,
      maxHeight: terrainControls.maxHeight,
      minHeight: terrainControls.minHeight,
      steps: terrainControls.steps,
      xSegments: terrainControls.Segments,
      xSize: terrainControls.size,
      ySegments: terrainControls.Segments,
      ySize: terrainControls.size,
    });

    terrain.scene.receiveShadow = true;
    terrain.mesh.castShadow = true;
    terrain.mesh.receiveShadow = true;

    setTerrainScene(terrain.scene); // Guardar el terreno en el estado

    // Obtener la geometría del terreno
    const geo = terrain.scene.children[0].geometry;

    // Usar ScatterMeshes para distribuir los modelos en el terreno
    let scatterScene = new THREE.Object3D(); // Crear un objeto para la escena de decoración
    scatterScene.rotateX(-Math.PI / 2); // Rotar la decoración para que se ajuste al terreno

    let scatterSceneWithoutPhysics = new THREE.Object3D();
    scatterSceneWithoutPhysics.rotateX(-Math.PI / 2);

    // Distribuir los modelos en el terreno
    models.forEach((model) => {
      const scatter = Terrain.ScatterMeshes(geo, {
        mesh: model.model,
        spread: model.spread,
      });
      scatterScene.add(scatter);
    });

    setDecoScene(scatterScene);

    modelsWithoutPhysics.forEach((model) => {
      const scatter = Terrain.ScatterMeshes(geo, {
        mesh: model.model,
        spread: model.spread,
      });
      scatterSceneWithoutPhysics.add(scatter);
    });

    setDecoSceneWithoutPhysics(scatterSceneWithoutPhysics);

    return () => {
      if (terrainRef.current) terrainRef.current.remove(terrain.scene);
    };
  }, [terrainControls]);

  const ZombiesControls = useControls("Zombies", {
    rotateX: {
      value: 0,
      min: -Math.PI,
      max: Math.PI,
      step: 0.1,
    },
    rotateY: {
      value: 0,
      min: -Math.PI,
      max: Math.PI,
      step: 0.1,
    },
    rotateZ: {
      value: 0,
      min: -Math.PI,
      max: Math.PI,
      step: 0.1,
    },
  });

  return (
    <group position={[0, -24, 0]} ref={terrainRef}>
      {/* Renderizar el terreno */}
      {terrainScene && (
        <RigidBody type="fixed" colliders="trimesh">
          <primitive object={terrainScene} />
        </RigidBody>
      )}

      {/* Renderizar los modelos distribuidos */}
      {decoScene && (
        <RigidBody
          type="fixed"
          colliders="hull"
          // onCollisionEnter={() => {
          //   console.log("Collision");
          // }}
        >
          <primitive object={decoScene} />
        </RigidBody>
      )}

      {decoSceneWithoutPhysics && (
        <primitive object={decoSceneWithoutPhysics} />
      )}

    </group>
  );
}
