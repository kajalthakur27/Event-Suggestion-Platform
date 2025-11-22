import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthScreen from "./Pages/login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/login" element={<AuthScreen />} />
      </Routes>
    </Router>
  );
}

export default App;

