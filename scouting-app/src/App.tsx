import { BrowserRouter as Router, Route, Routes } from "react-router";
import "./App.css";
import Players from "./pages/players";
import PlayerStats from "./pages/player-stats";

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Players />} />
            <Route path="/players" element={<Players />} />
            <Route path="/players/:player_name" element={<PlayerStats />} />
            <Route path="*" element={<div>Page Not Found!</div>} />
        </Routes>
    </Router>
  )
}

export default App
