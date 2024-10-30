import React, { useRef } from "react";
import { useControls } from "leva";
import { isMobile } from "react-device-detect";

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

  const lightRef = useRef();

  return (
    <>
      <color attach="background" args={["#0d0d0d"]} />
      <fog attach="fog" args={["#0d0d0d", 0, 16]} />
      <ambientLight intensity={light.ambientLightIntensity} />
      <directionalLight
        ref={lightRef}
        position={sunPosition}
        intensity={light.directionalLightIntensity}
        castShadow
        shadow-mapSize-width={isMobile ? 2048 : 2048}
        shadow-mapSize-height={isMobile ? 2048 : 2048}
        shadow-camera-far={80}
        shadow-camera-left={-36}
        shadow-camera-right={36}
        shadow-camera-top={36}
        shadow-camera-bottom={-36}
      />
    </>
  );
};
