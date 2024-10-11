import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "three.terrain.js": "three.terrain.js/build/THREE.Terrain.Module.mjs",
    },
  },
  optimizeDeps: {
    exclude: ["three.terrain.js"],
  },
  assetsInclude: ["**/*.glb", "**/*.gltf"],
});
