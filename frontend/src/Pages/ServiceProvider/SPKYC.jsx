import { useContext, useState } from "react";
import Footer from "../../Components/Footer";
import SPNavbar from "../../Components/SPNavbar";
import "../../Styles/Global.css";
import { AuthContext } from "../../context/authContext";
import api from "../../utils/api";

export default function SPKYC() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    citizenshipNumber: "",
    licenseNumber: "",
    issuingAuthority: "",
    licenseValidUntil: "",
    certificateName: "",
    trainingProvider: "",
    insuranceProvider: "",
    policyNumber: "",
    insuranceValidUntil: "",
    yearsExperience: "",
    description: ""
  });

  const [files, setFiles] = useState({
    citizenshipImage: null,
    licenseImage: null,
    certificateImage: null,
    insuranceDocument: null
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    setFiles(prev => ({ ...prev, [field]: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });
    Object.keys(files).forEach(key => {
      if (files[key]) {
        submissionData.append(key, files[key]);
      }
    });

    try {
      await api.post("/provider/kyc", submissionData);
      setLoading(false);
      setStatus("success");
      alert("KYC documents submitted successfully!");
    } catch (err) {
      console.error(err);
      setLoading(false);
      setStatus("error");
      alert("Failed to submit KYC documents. Please try again.");
    }
  };

  const PROVIDER_NAME = user?.name || "Provider";

  return (
    <div className="d-flex flex-column min-vh-100 animate-fade">
      <SPNavbar providerName="Ramesh Sharma" backTo="/provider" isVerified={false} />
      
      <main className="sm-container sm-section">
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--sm-navy)', margin: 0 }}>Complete Your KYC</h1>
          <p style={{ color: 'var(--sm-text-mid)', marginTop: '0.6rem', fontSize: '1.1rem' }}>
            Verify your identity and professional credentials to start bidding on premium projects.
          </p>
        </header>

        {status === "success" && (
          <div className="sm-badge sm-badge-success" style={{ width: '100%', padding: '1.5rem', marginBottom: '2rem', fontSize: '1rem', justifyContent: 'center' }}>
            KYC documents submitted successfully. Our team will review them within 24-48 hours.
          </div>
        )}

        <form onSubmit={handleSubmit} className="sm-grid" style={{ gridTemplateColumns: '1fr', gap: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Section 1: Personal Identity */}
          <section className="sm-card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--sm-navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ background: 'var(--sm-navy)', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>1</span>
              Identity Verification
            </h2>
            <div className="sm-input-group">
              <label className="sm-label">Citizenship Number</label>
              <input 
                type="text" 
                name="citizenshipNumber" 
                className="sm-input" 
                placeholder="Enter your citizenship number"
                value={formData.citizenshipNumber}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="sm-input-group">
              <label className="sm-label">Upload Citizenship Image (Front/Back Combined)</label>
              <input 
                type="file" 
                accept="image/*" 
                className="sm-input" 
                onChange={(e) => handleFileChange(e, 'citizenshipImage')}
                required 
              />
            </div>
          </section>

          {/* Section 2: Professional License (Optional) */}
          <section className="sm-card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--sm-navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ background: 'var(--sm-navy)', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>2</span>
              Professional License <span style={{ fontSize: '0.8rem', fontWeight: 400, opacity: 0.6, marginLeft: 'auto' }}>(Optional)</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="sm-input-group">
                <label className="sm-label">License Number</label>
                <input 
                  type="text" 
                  name="licenseNumber" 
                  className="sm-input" 
                  placeholder="e.g. ELEC-12345"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="sm-input-group">
                <label className="sm-label">Issuing Authority</label>
                <input 
                  type="text" 
                  name="issuingAuthority" 
                  className="sm-input" 
                  placeholder="e.g. NEA"
                  value={formData.issuingAuthority}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="sm-input-group">
              <label className="sm-label">License Expiry Date</label>
              <input 
                type="date" 
                name="licenseValidUntil" 
                className="sm-input" 
                value={formData.licenseValidUntil}
                onChange={handleInputChange}
              />
            </div>
            <div className="sm-input-group">
              <label className="sm-label">Upload License Image</label>
              <input 
                type="file" 
                accept="image/*" 
                className="sm-input" 
                onChange={(e) => handleFileChange(e, 'licenseImage')}
              />
            </div>
          </section>

          {/* Section 3: Certification & Training */}
          <section className="sm-card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--sm-navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ background: 'var(--sm-navy)', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>3</span>
              Specialized Certification <span style={{ fontSize: '0.8rem', fontWeight: 400, opacity: 0.6, marginLeft: 'auto' }}>(Optional)</span>
            </h2>
            <div className="sm-input-group">
              <label className="sm-label">Certificate Name</label>
              <input 
                type="text" 
                name="certificateName" 
                className="sm-input" 
                placeholder="e.g. Advanced HVAC Training"
                value={formData.certificateName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="sm-input-group">
              <label className="sm-label">Training Provider</label>
              <input 
                type="text" 
                name="trainingProvider" 
                className="sm-input" 
                placeholder="e.g. CTEVT"
                value={formData.trainingProvider}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="sm-input-group">
              <label className="sm-label">Upload Certificate</label>
              <input 
                type="file" 
                accept="image/*,application/pdf" 
                className="sm-input" 
                onChange={(e) => handleFileChange(e, 'certificateImage')}
                required
              />
            </div>
          </section>

          {/* Section 4: Insurance */}
          <section className="sm-card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--sm-navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ background: 'var(--sm-navy)', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>4</span>
              Business Insurance <span style={{ fontSize: '0.8rem', fontWeight: 400, opacity: 0.6, marginLeft: 'auto' }}>(Optional)</span>
            </h2>
            <div className="sm-input-group">
              <label className="sm-label">Insurance Provider</label>
              <input 
                type="text" 
                name="insuranceProvider" 
                className="sm-input" 
                placeholder="e.g. Shikhar Insurance"
                value={formData.insuranceProvider}
                onChange={handleInputChange}
              />
            </div>
            <div className="sm-input-group">
              <label className="sm-label">Policy Number</label>
              <input 
                type="text" 
                name="policyNumber" 
                className="sm-input" 
                placeholder="Enter policy number"
                value={formData.policyNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="sm-input-group">
              <label className="sm-label">Policy Expiry</label>
              <input 
                type="date" 
                name="insuranceValidUntil" 
                className="sm-input" 
                value={formData.insuranceValidUntil}
                onChange={handleInputChange}
              />
            </div>
            <div className="sm-input-group">
              <label className="sm-label">Upload Insurance Document</label>
              <input 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png" 
                className="sm-input"
                onChange={(e) => handleFileChange(e, 'insuranceDocument')}
              />
            </div>
          </section>

          <footer style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
             <button type="button" className="sm-btn sm-btn-outline" style={{ flex: 1 }}>Discard Changes</button>
             <button type="submit" className="sm-btn sm-btn-primary" style={{ flex: 2 }} disabled={loading}>
               {loading ? "Submitting Documents..." : "Submit for Verification"}
             </button>
          </footer>
        </form>
      </main>

      <Footer />
    </div>
  );
}
