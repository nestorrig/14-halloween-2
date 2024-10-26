import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export const PerimeterWall = () => {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[45, 45, 45, 4, 1, true]} />
        <meshStandardMaterial color={"#0d0d0d"} side={THREE.DoubleSide} />
      </mesh>
    </RigidBody>
  );
};
