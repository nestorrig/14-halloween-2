import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import Terrain from "three.terrain.js";
import { useControls } from "leva";


function createSolidTexture(color) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d");
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

export function GenerativeTerrain() {
  const terrainRef = useRef(); // Referencia para el grupo del terreno

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
      value: "Perlin",
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
      value: 256,
      min: 64,
      max: 512,
      step: 64,
    },
    Segments: {
      value: 48,
      min: 16,
      max: 64,
      step: 8,
    },
    maxHeight: {
      value: 40,
      min: 5,
      max: 120,
      step: 5,
    },
    minHeight: {
      value: -15,
      min: -50,
      max: 0,
      step: 5,
    },
    steps: {
      value: 5,
      min: 1,
      max: 8,
      step: 1,
    },
    sand: "#524d45",
    grass: "#1a4519",
    stone: "#3e2b2b",
    snow: "#f2efef",
  });

  const models = [
    useLoader(GLTFLoader, "/models/nature/Pine.glb").scene,
    useLoader(GLTFLoader, "/models/nature/Rock Medium.glb").scene,
    useLoader(GLTFLoader, "/models/nature/Bush with Flowers.glb").scene,
  ];

  models.forEach((model) => {
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  });

  // const [t1, t2, t3, t4] = useLoader(THREE.TextureLoader, [
  //   "/textures/terrain/sand1.jpg",
  //   "/textures/terrain/grass1.jpg",
  //   "/textures/terrain/stone1.jpg",
  //   "/textures/terrain/snow1.jpg",
  // ]);
  // console.log(t1, t2, t3, t4);

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
        // The first texture is the base; other textures are blended in on top.
        { texture: textureSand },
        // Start blending in at height -80; opaque between -35 and 20; blend out by 50
        { texture: textureGrass, levels: [-80, -35, 20, 50] },
        { texture: textureStone, levels: [20, 50, 60, 75] },
        // How quickly this texture is blended in depends on its x-position.
        {
          texture: textureSnow,
          glsl: "1.0 - smoothstep(65.0 + smoothstep(-256.0, 256.0, vPosition.x) * 10.0, 80.0, vPosition.z)",
        },
        // Use this texture if the slope is between 27 and 45 degrees
        {
          texture: textureStone,
          glsl: "slope > 0.7853981633974483 ? 0.2 : 1.0 - smoothstep(0.47123889803846897, 0.7853981633974483, slope) + 0.2",
        },
      ],
      new THREE.MeshStandardMaterial({
        roughness: 1,
        metalness: 0,
      })
    );

    // Crear el terreno con la librería THREE.Terrain
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

    console.log(terrain);
    terrain.scene.receiveShadow = true; // Permitir que el terreno reciba sombras
    terrain.mesh.castShadow = true; // Permitir que el terreno emita sombras
    terrain.mesh.receiveShadow = true; // Permitir que el terreno reciba sombras

    const terrainScene = terrain.getScene(); // Obtener la escena que contiene el terreno
    console.log(terrainScene);

    terrainRef.current.add(terrainScene); // Añadir el terreno a la referencia React

    // Añadir vegetación (foliage) aleatoriamente sobre el terreno
    const geo = terrainScene.children[0].geometry;

    // for (let i = 0; i < models.length; i++) {
    //   const newAmbient = Terrain.ScatterMeshes(geo, {
    //     mesh: models[i],
    //     w: terrainControls.size,
    //     h: terrainControls.size,
    //     spread: 0.01,
    //     randomness: Math.random,
    //   });

    //   terrainScene.add(newAmbient);
    // }

    // Limpiar el terreno cuando el componente se desmonte
    return () => {
      if (terrainRef.current) terrainRef.current.remove(terrainScene);
    };
  }, [terrainControls]);

  return <group position={[0, -64, 0]} ref={terrainRef}></group>; // Devolvemos el grupo con el terreno
}
