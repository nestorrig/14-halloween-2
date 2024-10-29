import { KeyboardControls } from "@react-three/drei";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { Adventurer, AdventurerFem } from "../Characters";
import { AdventurerModel, AdventurerFemModel } from "../../../assets/models";
import { useGameContext } from "../../../context/GameContext";
import { isMobile } from "react-device-detect";

export const Controller = () => {
  const { isMale } = useGameContext();

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
    action1: "CharacterArmature|Gun_Shoot",
    action2: "CharacterArmature|Punch_Left",
    action3: "CharacterArmature|Death",
    action4: "CharacterArmature|HitRecieve",
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
        camInitDis={isMobile ? -4 : -2}
        camMoveSpeed={5}
        camUpLimit={isMobile ? -50 : 1.5}
        animated
        debug
        capsuleHalfHeight={0.5}
        position={[0, 32, 0]}
        maxVelLimit={isMobile ? 10 : 2.5}
        friction={isMobile ? 0.3 : -0.5}
      >
        <EcctrlAnimation
          animationSet={animationSet}
          // characterURL={AdventurerModel}
          characterURL={isMale ? AdventurerModel : AdventurerFemModel}
        >
          <group position={[0, -1, 0]} visible={true}>
            {isMale ? <Adventurer /> : <AdventurerFem />}
          </group>
        </EcctrlAnimation>
      </Ecctrl>
    </KeyboardControls>
  );
};
