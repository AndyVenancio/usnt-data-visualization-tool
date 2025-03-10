import { BrowserRouter as Router, Route, Routes } from "react-router";
import "./index.css";
import Players from "./pages/players";

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
