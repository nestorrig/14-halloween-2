import { Canvas } from "@react-three/fiber";
import { GenerativeTerrain, Lights } from "./components/Experience";
import { useControls } from "leva";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
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
      value: 16,
      min: 0,
      max: 100,
    },
    active: false,
    // active: true, // This is the default value
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
    { name: "action1", keys: ["1"] },
    { name: "action2", keys: ["2"] },
    { name: "action3", keys: ["3"] },
    { name: "action4", keys: ["KeyF"] },
  ];

  const animationSet = {
    idle: "CharacterArmature|Idle_Gun",
    walk: "CharacterArmature|Walk",
    run: "CharacterArmature|Run",
    jump: "CharacterArmature|Idle",
    jumpIdle: "CharacterArmature|Idle",
    jumpLand: "CharacterArmature|Idle",
    fall: "CharacterArmature|Idle", // This is for falling from high sky
    // Currently support four additional animations
    action1: "CharacterArmature|Idle_Gun_Pointing",
    action2: "CharacterArmature|Gun_Shoot",
    action3: "CharacterArmature|Punch_Left",
    action4: "CharacterArmature|Sword_Slash",
  };

  return (
    <>
      <EcctrlJoystick buttonNumber={5} />
      <Canvas shadows>
        <color attach="background" args={["#0d0d0d"]} />
        <Lights />
        <OrbitControls />
        {/* <FirstPersonControls movementSpeed={15} lookSpeed={0.05} /> */}

        {fog.active && (
          <fog attach="fog" args={[fog.color, fog.near, fog.far]} />
        )}

        <Physics>
          <RigidBody type="fixed" colliders="trimesh">
            <mesh rotation={[fog.rotateX, fog.rotateY, fog.rotateZ]}>
              <cylinderGeometry args={[106, 106, 106, 4, 1, true]} />
              <meshStandardMaterial color={fog.color} side={THREE.DoubleSide} />
            </mesh>
          </RigidBody>

          <GenerativeTerrain />

          <KeyboardControls map={keyboardMap}>
            <Ecctrl
              //  first person mode
              // camCollision={false} // disable camera collision detect (useless in FP mode)
              // camInitDis={-0.01} // camera intial position
              // camMinDis={-0.01} // camera zoom in closest position
              // camFollowMult={1000} // give a big number here, so the camera follows the target (character) instantly
              // camLerpMult={1000} // give a big number here, so the camera lerp to the followCam position instantly
              // turnVelMultiplier={1} // Turning speed same as moving speed
              // turnSpeed={100} // give it big turning speed to prevent turning wait time
              // mode="CameraBasedMovement" // character's rotation will follow camera's rotation in this mode

              //  third person mode
              mode="FixedCamera"
              camInitDis={-2}
              camMoveSpeed={5}
              animated
              debug
              capsuleHalfHeight={0.5}
              // rayLength={0}
              position={[0, 32, 0]}
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
                <group position={[0, -1, 0]} visible={true}>
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
