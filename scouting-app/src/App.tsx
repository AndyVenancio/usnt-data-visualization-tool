import { BrowserRouter as Router, Route, Routes } from "react-router";
import "./index.css";
import Players from "./pages/players";
// import PlayerStats from "./pages/player-stats";
// <Route path="/players" element={<Players />} />
// <Route path="/players/:player_name" element={<PlayerStats />} />

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Players />} />
        <Route path="*" element={<div>Page Not Found!</div>} />
      </Routes>
    </Router>
  );
}

export default App;
