import { Canvas } from "@react-three/fiber";
import { GenerativeTerrain, Lights } from "./components/Experience";
import { useControls } from "leva";
import { Helper, KeyboardControls, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Physics, RigidBody } from "@react-three/rapier";
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from "ecctrl";
import { Adventurer } from "./components/Experience/Characters";
import AdventurerURL from "../public/models/characters/Adventurer.glb";
// Assets in public directory cannot be imported from JavaScript.
// If you intend to import that asset, put the file in the src directory, and use /src/models/characters/Adventurer.glb instead of /public/models/characters/Adventurer.glb.
// If you intend to use the URL of that asset, use /models/characters/Adventurer.glb?url.Files in the public directory are served at the root path.
// Instead of /public/models/characters/Adventurer.glb, use /models/characters/Adventurer.glb.

function App() {
  const fog = useControls("Fog", {
    // color: "#0d0d0d", // This is the default value
    color: "#ddd",
    near: {
      value: 0,
      min: 0,
      max: 100,
    },
    far: {
      value: 100,
      min: 0,
      max: 100,
    },
    active: false,
    rotateY: {
      value: Math.PI / 4,
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 4,
    },
    rotateX: {
      value: 0,
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 2,
    },
    rotateZ: {
      value: 0,
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 2,
    },
  });

  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
    // Optional animation key map
    // { name: "action1", keys: ["1"] },
    // { name: "action2", keys: ["2"] },
    // { name: "action3", keys: ["3"] },
    // { name: "action4", keys: ["KeyF"] },
  ];

  const animationSet = {
    idle: "CharacterArmature|Idle",
    walk: "CharacterArmature|Walk",
    run: "CharacterArmature|Run",
    jump: "CharacterArmature|Idle",
    jumpIdle: "CharacterArmature|Idle",
    jumpLand: "CharacterArmature|Idle",
    fall: "CharacterArmature|Idle", // This is for falling from high sky
    // Currently support four additional animations
    // action1: "Wave",
    // action2: "Dance",
    // action3: "Cheer",
    // action4: "Attack(1h)", // This is special action which can be trigger while walking or running
  };

  return (
    <>
      <EcctrlJoystick />
      <Canvas shadows>
        <color attach="background" args={["#0d0d0d"]} />
        <Lights />
        <OrbitControls />
        {/* <FirstPersonControls movementSpeed={15} lookSpeed={0.05} /> */}

        {fog.active && (
          <fog attach="fog" args={[fog.color, fog.near, fog.far]} />
        )}

        <Physics debug>
          <RigidBody type="fixed" colliders="trimesh">
            <mesh rotation={[fog.rotateX, fog.rotateY, fog.rotateZ]}>
              <cylinderGeometry args={[180, 180, 180, 4, 1, true]} />
              <meshStandardMaterial color={fog.color} side={THREE.DoubleSide} />
            </mesh>
          </RigidBody>

          <GenerativeTerrain />
          {/* <RigidBody type="fixed" position={[0, 0, 0]} colliders="trimesh">
          </RigidBody> */}

          <KeyboardControls map={keyboardMap}>
            <Ecctrl
              mode="FixedCamera"
              camMoveSpeed={5}
              animated
              debug
              capsuleHalfHeight={0.5}
              // rayLength={0}
              position={[0, -20, 0]}
              // capsuleHalfHeight={0.8}
              // slopeRayOriginOffest={[0, 0.8, 0]}
              // headRayOriginOffest={[0, 0.8, 0]}
              // camCollisionOffset={0.5}
              // rayOriginOffest={[0, -0.4, 0]}
            >
              <EcctrlAnimation
                animationSet={animationSet}
                characterURL={AdventurerURL}
              >
                <group position={[0, -1, 0]}>
                  <Adventurer />
                </group>
              </EcctrlAnimation>
            </Ecctrl>
          </KeyboardControls>
        </Physics>
      </Canvas>
    </>
  );
}

export default App;
