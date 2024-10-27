import { Experience } from "./components/Experience/";
import { UI } from "./components/UI/UI";
import { GameProvider } from "./context/GameContext";

function App() {
  return (
    <GameProvider>
      <UI />
      <Experience />
    </GameProvider>
  );
}

export default App;
