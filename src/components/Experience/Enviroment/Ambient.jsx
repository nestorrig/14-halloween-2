import React, { useRef } from "react";
import { useControls } from "leva";

export const Ambient = () => {
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
      value: 75,
      min: -75,
      max: 75,
      name: "Sun Y",
    },
    directionalLightZ: {
      value: -75,
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
        position={[
          light.directionalLightX,
          light.directionalLightY,
          light.directionalLightZ,
        ]}
        intensity={light.directionalLightIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
      />
    </>
  );
};
