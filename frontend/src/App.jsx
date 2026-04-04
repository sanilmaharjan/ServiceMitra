import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Index from "./Pages/Index";
import Auth from "./Pages/Auth";
import AboutUsDetails from "./Components/AboutUsDetail";
import ContactPage from "./Components/CantactPage";

// Placeholder components so routing doesn't break
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
      <main className="flex-grow-1 bg-light">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUsDetails />} />
          <Route path="/contact" element={<ContactPage/>} />
          <Route path="/login" element={<Auth />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
