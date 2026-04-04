import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";
import AboutUs from "./Pages/AboutUs";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminKYC from "./Pages/Admin/AdminKYC";
import AdminServiceProviders from "./Pages/Admin/AdminServiceProviders";
import AdminUsers from "./Pages/Admin/AdminUsers";
import ProviderPortfolio from "./Pages/Admin/ProviderPortfolio";
import Auth from "./Pages/Auth";
import Contact from "./Pages/Contact";
import Index from "./Pages/Index";
import SPBids from "./Pages/ServiceProvider/SPBids";
import SPDashboard from "./Pages/ServiceProvider/SPDashboard";
import SPKYC from "./Pages/ServiceProvider/SPKYC";
import SPPortfolio from "./Pages/ServiceProvider/SPPortfolio";
import SPPostList from "./Pages/ServiceProvider/SPPostList";
import SPProfile from "./Pages/ServiceProvider/SPProfile";
import UserDashboard from "./Pages/User/UserDashboard";
import UserHistory from "./Pages/User/UserHistory";
import UserPostDetail from "./Pages/User/UserPostDetail";
import UserProfile from "./Pages/User/UserProfile";
import "./Styles/Global.css";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isProviderRoute = location.pathname.startsWith("/provider");
  const isUserRoute = location.pathname.startsWith("/user");
  const isAuthRoute = location.pathname === "/auth" || location.pathname === "/login";

  if (isAdminRoute) {
    return (
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/service-providers" element={<AdminServiceProviders />} />
          <Route path="/admin/service-providers/:id/portfolio" element={<ProviderPortfolio />} />
          {/* <Route path="/admin/payments" element={<AdminPayments />} /> */}
          {/* <Route path="/admin/payments/:id" element={<AdminPayments />} /> */}
          <Route path="/admin/kyc" element={<AdminKYC />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  if (isProviderRoute) {
    return (
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["provider"]} />}>
          <Route path="/provider" element={<SPDashboard />} />
          <Route path="/provider/posts" element={<SPPostList />} />
          <Route path="/provider/bids" element={<SPBids />} />
          <Route path="/provider/portfolio" element={<SPPortfolio />} />
          <Route path="/provider/profile" element={<SPProfile />} />
          <Route path="/provider/kyc" element={<SPKYC />} />
        </Route>
        <Route path="*" element={<Navigate to="/provider" replace />} />
      </Routes>
    );
  }

  if (isUserRoute) {
    return (
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/posts/:id" element={<UserPostDetail />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/history" element={<UserHistory />} />
        </Route>
        <Route path="*" element={<Navigate to="/user" replace />} />
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
