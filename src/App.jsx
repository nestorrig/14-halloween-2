import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { Loader } from "./components/UI/Loader";
import { Lobby } from "./components/Experience/Lobby";
import { Game } from "./components/Experience/Game";
import { Experience } from "./components/Experience/Experience";

// const Lobby = lazy(() => import("./components/Experience/Lobby"));
// const Game = lazy(() => import("./components/Experience/Game"));

function App() {
  return (
    <GameProvider>
      {/* <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Lobby />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </Suspense>
      </Router> */}
      <Experience />
    </GameProvider>
  );
}

export default App;
