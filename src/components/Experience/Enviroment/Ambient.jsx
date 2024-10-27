import React, { useEffect, useRef } from "react";
import { useControls } from "leva";
// import { useThree } from "@react-three/fiber";
// import { useHelper } from "@react-three/drei";
// import * as THREE from "three";

export const Ambient = ({ sunPosition = [0, 25, -35] }) => {
  const light = useControls("Sun Position", {
    directionalLightIntensity: {
      value: 1.5,
      min: 0,
      max: 10,
      name: "Sun Intensity",
    },
    directionalLightX: {
      value: 0,
      min: -75,
      max: 75,
      name: "Sun X",
    },
    directionalLightY: {
      value: 25,
      min: -75,
      max: 75,
      name: "Sun Y",
    },
    directionalLightZ: {
      value: -35,
      min: -75,
      max: 75,
      name: "Sun Z",
    },
    ambientLightIntensity: {
      value: 0.5,
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
      <color attach="background" args={["#0d0d0d"]} />
      {/* <fog attach="fog" args={["#0d0d0d", 0, 16]} /> */}
      <ambientLight intensity={light.ambientLightIntensity} />
      <directionalLight
        ref={lightRef}
        position={sunPosition}
        intensity={light.directionalLightIntensity}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={80}
        shadow-camera-left={-36}
        shadow-camera-right={36}
        shadow-camera-top={36}
        shadow-camera-bottom={-36}
        // position={[
        //   light.directionalLightX,
        //   light.directionalLightY,
        //   light.directionalLightZ,
        // ]}
      />
    </>
  );
};
