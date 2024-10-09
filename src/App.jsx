import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"


function App() {


  return (
    <>
      <h1 className='absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-9xl text-center w-full font-bold'>
        Hola nuevo reto
      </h1>
      <Canvas>
        <OrbitControls />
        <ambientLight />
       <directionalLight position={[10, 10, 5]} /> 
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color='hotpink' />
        </mesh>
      </Canvas>
    </>
  )
}

export default App
