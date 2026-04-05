import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";
import adminApi from "../../utils/adminApi";

export default function AdminKYC() {
  const navigate = useNavigate();
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionType, setActionType] = useState(null);

  // useEffect(() => {
  //   fetchKYC();
  // }, []);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchKYC();
    }
  }, []);

  const fetchKYC = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getPendingKYC();
      const formattedData = (response.data || []).map(item => ({
        id: item.id,
        provider_id: item.provider_id,
        name: item.name,
        phone: item.phone,
        categories: item.categories || [],
        citizenship_number: item.citizenship_number,
        citizenship_image: item.citizenship_image,
        pan_number: item.pan_number,
        pan_image: item.pan_image,
        license_number: item.license_number,
        license_image: item.license_image,
        insurance_provider: item.insurance_provider,
        years_experience: item.years_experience,
        created_at: item.created_at,
        status: "pending",
        avatar: item.name?.charAt(0).toUpperCase() || "P",
        hasDocuments: !!(item.citizenship_number || item.pan_number || item.license_number)
      }));
      setKycList(formattedData);
    } catch (err) {
      console.error("Error fetching KYC:", err);
      alert("Failed to load pending verifications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await adminApi.approveKYC(selectedProvider.provider_id, { notes: noteInput });
      alert(`Provider "${selectedProvider.name}" has been approved successfully!`);
      setActionType(null);
      setSelectedProvider(null);
      setNoteInput("");
      fetchKYC();
    } catch (err) {
      console.error(err);
      alert("Failed to approve KYC");
    }
  };

  const handleReject = async () => {
    if (!reasonInput.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    try {
      await adminApi.rejectKYC(selectedProvider.provider_id, { reason: reasonInput });
      alert(`Provider "${selectedProvider.name}" has been rejected`);
      setActionType(null);
      setSelectedProvider(null);
      setReasonInput("");
      fetchKYC();
    } catch (err) {
      console.error(err);
      alert("Failed to reject KYC");
    }
  };

  const openActionModal = (provider, action) => {
    setSelectedProvider(provider);
    setActionType(action);
    if (action === 'approve') {
      setNoteInput("");
    } else {
      setReasonInput("");
    }
  };

  const getDocumentCount = (provider) => {
    let count = 0;
    if (provider.citizenship_number) count++;
    if (provider.pan_number) count++;
    if (provider.license_number) count++;
    if (provider.insurance_provider) count++;
    return count;
  };

  const filteredList = kycList.filter(item => {
    if (filter === "all") return true;
    if (filter === "has-docs") return item.hasDocuments;
    if (filter === "no-docs") return !item.hasDocuments;
    return true;
  });

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminNavbar backTo="/admin" pageTitle="KYC Verification" />
        <main className="sm-container sm-section">
          <div style={{textAlign: 'center', padding: '3rem'}}>Loading pending verifications...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout animate-fade">
      <AdminNavbar 
        backTo="/admin" 
        pageTitle="KYC Verification"
        rightSlot={
          <span className="admin-count-chip urgent" style={{background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '20px'}}>
            {kycList.length} Pending
          </span>
        }
      />

      <main className="sm-container sm-section">
        <header className="page-header" style={{marginBottom: '2rem'}}>
          <h1 style={{fontSize: '2rem', fontWeight: 800, color: 'var(--sm-navy)', margin: 0}}>KYC Verification</h1>
          <p style={{color: 'var(--sm-text-mid)', marginTop: '0.4rem'}}>Review and verify service provider identity documents</p>
        </header>

        <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--sm-gray-border)'}}>
          <button 
            onClick={() => setFilter("all")}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: filter === 'all' ? 700 : 400,
              color: filter === 'all' ? 'var(--sm-orange)' : 'var(--sm-text-mid)',
              borderBottom: filter === 'all' ? '2px solid var(--sm-orange)' : 'none'
            }}
          >
            All ({kycList.length})
          </button>
          <button 
            onClick={() => setFilter("has-docs")}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: filter === 'has-docs' ? 700 : 400,
              color: filter === 'has-docs' ? 'var(--sm-orange)' : 'var(--sm-text-mid)',
              borderBottom: filter === 'has-docs' ? '2px solid var(--sm-orange)' : 'none'
            }}
          >
            With Documents
          </button>
          <button 
            onClick={() => setFilter("no-docs")}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: filter === 'no-docs' ? 700 : 400,
              color: filter === 'no-docs' ? 'var(--sm-orange)' : 'var(--sm-text-mid)',
              borderBottom: filter === 'no-docs' ? '2px solid var(--sm-orange)' : 'none'
            }}
          >
            No Documents
          </button>
        </div>

        {filteredList.length === 0 ? (
          <div className="sm-card" style={{textAlign: 'center', padding: '3rem'}}>
            <h3 style={{color: 'var(--sm-navy)', marginBottom: '0.5rem'}}>No Pending Verifications</h3>
            <p style={{color: 'var(--sm-text-mid)'}}>All service providers have been verified</p>
          </div>
        ) : (
          <div className="sm-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem'}}>
            {filteredList.map((provider) => (
              <div key={provider.id} className="sm-card" style={{padding: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem'}}>
                  <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
                    <div style={{
                      width: '50px', 
                      height: '50px', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}>
                      {provider.avatar}
                    </div>
                    <div>
                      <h3 style={{margin: 0, fontSize: '1.1rem', fontWeight: 700}}>{provider.name}</h3>
                      <p style={{margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--sm-text-light)'}}>
                        Phone: {provider.phone}
                      </p>
                    </div>
                  </div>
                  <span className="sm-badge sm-badge-warning" style={{background: '#fef3c7', color: '#92400e'}}>
                    Pending
                  </span>
                </div>

                {provider.categories && provider.categories.length > 0 && (
                  <div style={{marginBottom: '1rem'}}>
                    <div style={{fontSize: '0.75rem', color: 'var(--sm-text-light)', marginBottom: '0.5rem'}}>Categories:</div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.25rem'}}>
                      {provider.categories.slice(0, 3).map((cat, idx) => (
                        <span key={idx} className="sm-badge" style={{background: '#dbeafe', color: '#1e40af', fontSize: '0.7rem'}}>
                          {cat}
                        </span>
                      ))}
                      {provider.categories.length > 3 && (
                        <span className="sm-badge" style={{fontSize: '0.7rem'}}>+{provider.categories.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}

                <div style={{marginBottom: '1rem', padding: '0.75rem', background: 'var(--sm-gray-light)', borderRadius: '8px'}}>
                  <div style={{fontSize: '0.75rem', color: 'var(--sm-text-light)', marginBottom: '0.5rem'}}>Documents:</div>
                  <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                    {provider.citizenship_number && <span style={{fontSize: '0.7rem'}}>Citizenship</span>}
                    {provider.pan_number && <span style={{fontSize: '0.7rem'}}>PAN Card</span>}
                    {provider.license_number && <span style={{fontSize: '0.7rem'}}>License</span>}
                    {provider.insurance_provider && <span style={{fontSize: '0.7rem'}}>Insurance</span>}
                    {getDocumentCount(provider) === 0 && (
                      <span style={{fontSize: '0.7rem', color: 'var(--sm-text-light)'}}>No documents uploaded</span>
                    )}
                  </div>
                </div>

                {provider.years_experience > 0 && (
                  <div style={{marginBottom: '1rem', fontSize: '0.85rem'}}>
                    Experience: {provider.years_experience} years
                  </div>
                )}

                <div style={{fontSize: '0.7rem', color: 'var(--sm-text-light)', marginBottom: '1rem'}}>
                  Submitted: {new Date(provider.created_at).toLocaleDateString()}
                </div>

                <div style={{display: 'flex', gap: '0.75rem'}}>
                  <button 
                    className="sm-btn sm-btn-primary" 
                    style={{flex: 1, background: '#10b981'}}
                    onClick={() => openActionModal(provider, 'approve')}
                  >
                    Approve
                  </button>
                  <button 
                    className="sm-btn sm-btn-outline" 
                    style={{flex: 1, color: '#ef4444', borderColor: '#ef4444'}}
                    onClick={() => openActionModal(provider, 'reject')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {actionType === 'approve' && selectedProvider && (
        <div className="sm-overlay animate-fade" onClick={() => setActionType(null)} style={{
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(15, 23, 42, 0.7)', 
          backdropFilter: 'blur(4px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000
        }}>
          <div className="sm-card" style={{maxWidth: '500px', width: '90%'}} onClick={e => e.stopPropagation()}>
            <h3 style={{fontWeight: 800, color: 'var(--sm-navy)', marginBottom: '0.5rem'}}>Approve Provider</h3>
            <p style={{color: 'var(--sm-text-mid)', marginBottom: '1.5rem'}}>
              Approve <strong>{selectedProvider.name}</strong> as a verified service provider?
            </p>
            
            <div style={{marginBottom: '1.5rem'}}>
              <label className="sm-label" style={{marginBottom: '0.5rem', display: 'block'}}>Notes (Optional)</label>
              <textarea
                className="sm-input"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add any notes about this verification..."
                rows={3}
              />
            </div>
            
            <div style={{display: 'flex', gap: '0.75rem'}}>
              <button className="sm-btn sm-btn-ghost" style={{flex: 1}} onClick={() => setActionType(null)}>
                Cancel
              </button>
              <button className="sm-btn sm-btn-primary" style={{flex: 1, background: '#10b981'}} onClick={handleApprove}>
                Confirm Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {actionType === 'reject' && selectedProvider && (
        <div className="sm-overlay animate-fade" onClick={() => setActionType(null)} style={{
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(15, 23, 42, 0.7)', 
          backdropFilter: 'blur(4px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000
        }}>
          <div className="sm-card" style={{maxWidth: '500px', width: '90%'}} onClick={e => e.stopPropagation()}>
            <h3 style={{fontWeight: 800, color: 'var(--sm-navy)', marginBottom: '0.5rem'}}>Reject Provider</h3>
            <p style={{color: 'var(--sm-text-mid)', marginBottom: '1.5rem'}}>
              Reject <strong>{selectedProvider.name}</strong>'s verification request?
            </p>
            
            <div style={{marginBottom: '1.5rem'}}>
              <label className="sm-label" style={{marginBottom: '0.5rem', display: 'block'}}>Reason for Rejection *</label>
              <textarea
                className="sm-input"
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Explain why this verification is being rejected..."
                rows={3}
                required
              />
            </div>
            
            <div style={{display: 'flex', gap: '0.75rem'}}>
              <button className="sm-btn sm-btn-ghost" style={{flex: 1}} onClick={() => setActionType(null)}>
                Cancel
              </button>
              <button className="sm-btn sm-btn-danger" style={{flex: 1}} onClick={handleReject}>
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}