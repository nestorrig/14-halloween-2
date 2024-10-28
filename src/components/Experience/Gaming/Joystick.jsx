import { EcctrlJoystick } from "ecctrl";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const material = new THREE.MeshBasicMaterial({
  color: "#E2DFD0",
  transparent: true,
  opacity: 0.3,
});

export const Joystick = () => {
  const ref = useRef();

  useEffect(() => {
    console.log({ ref });
  }, []);

  return (
    <EcctrlJoystick
      ref={ref}
      buttonNumber={5}
      joystickBaseProps={{
        material: material,
      }}
      joystickStickProps={{
        material: material,
      }}
      joystickHandleProps={{
        material: material,
      }}
      buttonTop3Props={{
        material: material,
      }}
      buttonTop5Props={{
        material: material,
      }}
      buttonSmallBaseProps={{
        material: material,
      }}
      buttonGroup2Position={{ x: 0, y: 0, z: 0 }}
      buttonGroup4Position={{ x: 0, y: 0, z: 0 }}
      buttonGroup1Position={{ x: 0, y: 0, z: 0 }}
      buttonPositionBottom={-55}
      buttonPositionRight={-30}
    />
  );
};
