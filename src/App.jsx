import { Canvas } from "@react-three/fiber";
import { GenerativeTerrain } from "./components/Experience";
import { useControls } from "leva";
import { Helper, OrbitControls } from "@react-three/drei";

function App() {
  const light = useControls("Sun Position", {
    directionalLightIntensity: {
      value: 1.5,
      min: 0,
      max: 10,
      name: "Sun Intensity",
    },
    directionalLightX: {
      value: 0,
      min: -100,
      max: 100,
      name: "Sun X",
    },
    directionalLightY: {
      value: 25,
      min: -100,
      max: 100,
      name: "Sun Y",
    },
    directionalLightZ: {
      value: -100,
      min: -100,
      max: 100,
      name: "Sun Z",
    },
    ambientLightIntensity: {
      value: 2,
      min: 0,
      max: 10,
      name: "Ambient Intensity",
    },
  });

  return (
    <Canvas shadows>
      <color attach="background" args={["#0d0d0d"]} />
      <ambientLight intensity={light.ambientLightIntensity} />
      <directionalLight
        position={[
          light.directionalLightX,
          light.directionalLightY,
          light.directionalLightZ,
        ]}
        intensity={light.directionalLightIntensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <group position={[0, -30, 0]}>
        <GenerativeTerrain />
      </group>
      <OrbitControls />
      {/* <FirstPersonControls movementSpeed={15} lookSpeed={0.05} /> */}
    </Canvas>
  );
}

export default App;
