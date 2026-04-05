import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Index from "./Pages/Index";
import Auth from "./Pages/Auth";
import AboutUs from "./Pages/AboutUs";
import Contact from "./Pages/Contact";
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
import UserDashboard from "./Pages/User/UserDashboard";
import UserPostDetail from "./Pages/User/UserPostDetail";
import UserProfile from "./Pages/User/UserProfile";
import SPProfile from "./Pages/ServiceProvider/SPProfile";
// 👇 ADD THESE IMPORTS
import PaymentGateway from "./Pages/Payment/PaymentGateway";
import EsewaCallback from "./Pages/Payment/EsewaCallback";
import UserHistory from "./Pages/User/UserHistory";
import "./Styles/Global.css";

import KhaltiSuccess from "./Pages/Payment/KhaltiSuccess";
import EsewaFailed from "./Pages/Payment/EsewaFailed";
import TestEsewa from "./Pages/TestEsewa";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isProviderRoute = location.pathname.startsWith("/provider");
  const isUserRoute = location.pathname.startsWith("/user");

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
        <Route path="/provider/profile" element={<SPProfile />} />
      </Routes>
    );
  }

  if (isUserRoute) {
    return (
      <Routes>
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/posts/:id" element={<UserPostDetail />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/payment/khaltiSuccess" element={<KhaltiSuccess />} />
        <Route path="/payment/failed" element={<EsewaFailed />} />
        <Route path="/test-esewa" element={<TestEsewa />} />

// Add inside user routes section
        <Route path="/user/history" element={<UserHistory />} />
      </Routes>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Auth />} />
          {/* 👇 ADD PAYMENT ROUTES HERE */}
          <Route path="/payment/:jobId" element={<PaymentGateway />} />
          <Route path="/payment/callback/:paymentType" element={<EsewaCallback />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;