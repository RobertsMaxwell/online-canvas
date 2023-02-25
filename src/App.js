import './App.css';
import Canvas from "./components/Canvas"
import Header from "./components/Header"
import Home from "./components/Home"
import Footer from "./components/Footer"
import {Routes, Route, useLocation} from "react-router-dom"

function App() {
  const location = useLocation()

  return (
    <div className="App">
      <Header location={location} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/canvas" element={<Canvas />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
