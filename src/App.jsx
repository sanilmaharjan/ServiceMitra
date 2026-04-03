import React from "react";
import { Routes, Route } from "react-router-dom";

//Components
import Navbar from "./components/Navbar.jsx";

//Pages
import Index from "./pages/Index.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

function App() {
  return (
    <>
      <Navbar />

      <main className="container mt-5">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
