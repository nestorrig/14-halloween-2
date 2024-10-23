import { Experience } from "./components/Experience/";
import { GameProvider } from "./context/GameContext";

function App() {
  return (
    <GameProvider>
      <Experience />
    </GameProvider>
  );
}

export default App;
