import { KeyboardControls } from "@react-three/drei";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { Adventurer } from "../Characters";
import { AdventurerModel } from "../../../assets/models";

export const Controller = () => {
  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
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
          characterURL={AdventurerModel}
        >
          <group position={[0, -1, 0]} visible={true}>
            <Adventurer />
          </group>
          s
        </EcctrlAnimation>
      </Ecctrl>
    </KeyboardControls>
  );
};
