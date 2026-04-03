import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Index from "./Pages/Index";

const About = () => (
  <div className="container py-5 text-center">
    <h2>About Us</h2>
  </div>
);
const Contact = () => (
  <div className="container py-5 text-center">
    <h2>Contact</h2>
  </div>
);

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
export default App;
