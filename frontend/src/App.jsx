import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Index from "./Pages/Index";
import Auth from "./Pages/Auth";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminUsers from "./Pages/Admin/AdminUsers";
import AdminServiceProviders from "./Pages/Admin/AdminServiceProviders";
import ProviderPortfolio from "./Pages/Admin/ProviderPortfolio";
import AdminPayments from "./Pages/Admin/AdminPayments";
import AdminKYC from "./Pages/Admin/AdminKYC";
import SPDashboard from "./Pages/ServiceProvider/SPDashboard";
import SPPostList from "./Pages/ServiceProvider/SPPostList";
import SPBids from "./Pages/ServiceProvider/SPBids";
import SPPortfolio from "./Pages/ServiceProvider/SPPortfolio";

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
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isProviderRoute = location.pathname.startsWith("/provider");

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/service-providers" element={<AdminServiceProviders />} />
        <Route path="/admin/service-providers/:id/portfolio" element={<ProviderPortfolio />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/payments/:id" element={<AdminPayments />} />
        <Route path="/admin/kyc" element={<AdminKYC />} />
      </Routes>
    );
  }

  if (isProviderRoute) {
    return (
      <Routes>
        <Route path="/provider" element={<SPDashboard />} />
        <Route path="/provider/posts" element={<SPPostList />} />
        <Route path="/provider/bids" element={<SPBids />} />
        <Route path="/provider/portfolio" element={<SPPortfolio />} />
      </Routes>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 bg-light">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Auth />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
