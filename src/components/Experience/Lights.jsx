import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { Helper, useHelper } from "@react-three/drei";

export const Lights = () => {
  const light = useControls("Sun Position", {
    directionalLightIntensity: {
      value: 1.5,
      min: 0,
      max: 10,
      name: "Sun Intensity",
    },
    directionalLightX: {
      value: 0,
      min: -128,
      max: 128,
      name: "Sun X",
    },
    directionalLightY: {
      value: 128,
      min: -128,
      max: 128,
      name: "Sun Y",
    },
    directionalLightZ: {
      value: -90,
      min: -128,
      max: 128,
      name: "Sun Z",
    },
    ambientLightIntensity: {
      value: 2,
      min: 0,
      max: 10,
      name: "Ambient Intensity",
    },
  });

  // const { scene } = useThree();
  const lightRef = useRef();

  // useHelper(lightRef, THREE.DirectionalLightHelper, "cyan");
  // useEffect(() => {
  //   let directionalLightCameraHelper;
  //   if (lightRef.current.shadow.camera) {
  //     directionalLightCameraHelper = new THREE.CameraHelper(
  //       lightRef.current.shadow.camera
  //     );
  //     scene.add(directionalLightCameraHelper);
  //   }

  //   return () => {
  //     scene.remove(directionalLightCameraHelper);
  //   };
  // }, [scene]);

  return (
    <>
      <ambientLight intensity={light.ambientLightIntensity} />
      <directionalLight
        ref={lightRef}
        position={[
          light.directionalLightX,
          light.directionalLightY,
          light.directionalLightZ,
        ]}
        intensity={light.directionalLightIntensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={256}
        shadow-camera-left={-128}
        shadow-camera-right={128}
        shadow-camera-top={128}
        shadow-camera-bottom={-128}
      />
      <Helper object={lightRef} />
    </>
  );
};
