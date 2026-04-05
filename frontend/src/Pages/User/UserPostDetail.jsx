import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserNavbar from "../../Components/UserNavbar";
import "../../Styles/User.css";
import { AuthContext } from "../../context/authContext";
import bidsApi from "../../utils/bidsApi";
import jobsApi from "../../utils/jobsApi";

const CATEGORIES = [
  "Electrical","Plumbing","Painting","Carpentry","Cleaning",
  "Gardening","Appliance Repair","Electronics","Beauty & Wellness","Other",
];

export default function UserPostDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(location.state?.post || null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [viewBidder, setViewBidder] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editUrgency, setEditUrgency] = useState("normal");

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const [postRes, bidsRes] = await Promise.all([
        jobsApi.getJobById(id),
        bidsApi.getJobBids(id)
      ]);
      const loadedPost = postRes?.data || postRes;
      const loadedBids = bidsRes?.data || bidsRes || [];
      setPost(loadedPost);
      setBids(loadedBids);

      setEditTitle(loadedPost?.title || "");
      setEditDesc(loadedPost?.description || "");
      setEditCategory(loadedPost?.category || "");
      setEditUrgency(loadedPost?.urgency || "normal");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        title: editTitle,
        description: editDesc,
        category: editCategory,
        urgency: editUrgency
      };
      const response = await jobsApi.updateJobPartial(id, updatedData);
      setPost(response.data);
      setIsEditing(false);
      alert("Post updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update post.");
    }
  };

  const handleDelete = async () => {
    try {
      await jobsApi.deleteJob(id);
      navigate("/user");
      alert("Post removed successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    }
  };

  const handleBidAction = async (bidId, action) => {
    try {
      if (action === 'accept') {
        await bidsApi.acceptBid(bidId);
      } else {
        await bidsApi.rejectBid(bidId);
      }
      setBids(prev => prev.map(b => b.id === bidId ? { ...b, status: action === 'accept' ? 'accepted' : 'rejected' } : b));
      alert(`Bid ${action}ed!`);
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} bid.`);
    }
  };

  if (loading) return <div className="user-layout"><UserNavbar userName={user?.name} /><main className="sm-container sm-section">Loading...</main></div>;

  if (!post) {
    return (
      <div className="user-layout">
        <UserNavbar userName={user?.name || "User"} backTo="/user" />
        <main className="sm-container sm-section">
          <div className="sm-card animate-fade" style={{textAlign: 'center', padding: '4rem 2rem'}}>
            <h2 style={{color: 'var(--sm-navy)', margin: '0 0 0.5rem'}}>Post Not Found</h2>
            <p style={{color: 'var(--sm-text-mid)', marginBottom: '2rem'}}>This request may have been removed or moved.</p>
            <button className="sm-btn sm-btn-primary" onClick={() => navigate("/user")}>Return to Dashboard</button>
          </div>
        </main>
      </div>
    );
  }

  const USER_NAME = user?.name || "User";

  return (
    <div className="user-layout animate-fade">
      <UserNavbar userName={USER_NAME} backTo="/user" />

      <main className="sm-container sm-section" style={{maxWidth: '900px'}}>
        {/* --- Post Details Card --- */}
        <section className="sm-card" style={{padding: '2rem', marginBottom: '2rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem'}}>
            <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
              <span className={`sm-badge ${post.status === 'open' ? 'sm-badge-success' : 'sm-badge-warning'}`}>{post.status}</span>
              <span style={{fontSize: '0.8rem', color: 'var(--sm-text-light)'}}>{post.postedAt}</span>
            </div>
            {!isEditing ? (
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <button className="sm-btn sm-btn-outline" style={{padding: '0.5rem 1rem', fontSize: '0.8rem'}} onClick={() => setIsEditing(true)}>Edit</button>
                <button className="sm-btn sm-btn-ghost" style={{padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'var(--sm-danger)'}} onClick={() => setConfirmDelete(true)}>Remove</button>
              </div>
            ) : (
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <button className="sm-btn sm-btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="sm-btn sm-btn-primary" style={{padding: '0.5rem 1rem', fontSize: '0.8rem'}} onClick={handleSave}>Save</button>
              </div>
            )}
          </div>

          {!isEditing ? (
            <>
              <h1 style={{fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--sm-navy)'}}>{post.title}</h1>
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem'}}>
                <span style={{fontSize: '0.85rem', color: 'var(--sm-text-mid)'}}>Category: {post.category}</span>
                <span style={{fontSize: '0.85rem', color: 'var(--sm-text-mid)'}}>Location: {post.location}</span>
                <span style={{fontSize: '0.85rem', color: 'var(--sm-text-mid)'}}>Budget: NRS {post.budget}</span>
                {post.urgency === 'urgent' && <span style={{fontSize: '0.85rem', fontWeight: 700, color: 'var(--sm-danger)'}}>Urgent</span>}
              </div>
              <p style={{fontSize: '1rem', color: 'var(--sm-text-mid)', lineHeight: '1.7', margin: '0 0 2rem'}}>{post.description}</p>
            </>
          ) : (
            <div className="sm-grid" style={{marginTop: '1rem'}}>
              <div className="sm-input-group">
                <label className="sm-label">Post Title</label>
                <input className="sm-input" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
              </div>
              <div className="sm-input-group">
                <label className="sm-label">Description</label>
                <textarea className="sm-input" style={{minHeight: '120px'}} value={editDesc} onChange={e => setEditDesc(e.target.value)} />
              </div>
              <div className="sm-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
                <div className="sm-input-group">
                  <label className="sm-label">Category</label>
                  <select className="sm-input" value={editCategory} onChange={e => setEditCategory(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm-input-group">
                  <label className="sm-label">Urgency</label>
                  <select className="sm-input" value={editUrgency} onChange={e => setEditUrgency(e.target.value)}>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* --- Bids Section --- */}
        <section className="bids-section">
          <h2 style={{fontSize: '1.25rem', fontWeight: 700, color: 'var(--sm-navy)', marginBottom: '1.5rem'}}>Bids Received ({bids.length})</h2>
          
          <div className="sm-grid">
            {bids.length === 0 ? (
              <div className="sm-card" style={{textAlign: 'center', padding: '3rem', borderStyle: 'dashed'}}>
                <p style={{color: 'var(--sm-text-light)'}}>No bids yet. Service providers will see your request and send offers soon.</p>
              </div>
            ) : (
              bids.map((bid, index) => (
                <div key={bid.id} className="sm-card animate-fade" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', animationDelay: `${index * 0.1}s`}}>
                  <div style={{display: 'flex', gap: '1.25rem', alignItems: 'center', flex: 1}}>
                    <div 
                      onClick={() => setViewBidder(bid.bidder)}
                      style={{width: '48px', height: '48px', background: 'var(--sm-gray-light)', color: 'var(--sm-navy)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, cursor: 'pointer', transition: 'background 0.2s'}}
                    >
                      {bid.bidder.initials}
                    </div>
                    <div>
                      <h4 onClick={() => setViewBidder(bid.bidder)} style={{margin: '0 0 0.25rem', fontSize: '1rem', color: 'var(--sm-text-dark)', cursor: 'pointer', fontWeight: 700}}>{bid.bidder.name}</h4>
                      <p style={{margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--sm-text-mid)'}}>{bid.note}</p>
                      <div style={{display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--sm-text-light)'}}>
                        <span> {bid.bidder.rating}</span>
                        <span> {bid.bidder.jobs} Jobs</span>
                        <span> {bid.placedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{textAlign: 'right', minWidth: '120px'}}>
                    <div style={{fontSize: '1.1rem', fontWeight: 800, color: 'var(--sm-navy)', marginBottom: '0.5rem'}}>{bid.amount}</div>
                    {bid.status === 'pending' && post.status === 'open' ? (
                      <div style={{display: 'flex', gap: '0.4rem', justifyContent: 'flex-end'}}>
                        <button className="sm-btn sm-btn-primary" style={{padding: '0.35rem 0.75rem', fontSize: '0.7rem'}} onClick={() => handleBidAction(bid.id, 'accepted')}>Accept</button>
                        <button className="sm-btn sm-btn-outline" style={{padding: '0.35rem 0.75rem', fontSize: '0.7rem'}} onClick={() => handleBidAction(bid.id, 'rejected')}>Decline</button>
                      </div>
                    ) : (
                      <span className={`sm-badge ${bid.status === 'accepted' ? 'sm-badge-success' : bid.status === 'rejected' ? 'sm-badge-danger' : 'sm-badge-secondary'}`}>{bid.status}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* --- Modals --- */}
        {viewBidder && (
          <div className="sm-overlay animate-fade" onClick={() => setViewBidder(null)} style={{position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
            <div className="sm-card animate-fade" onClick={e => e.stopPropagation()} style={{width: '90%', maxWidth: '450px', padding: '2rem'}}>
               <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'center'}}>
                  <div style={{width: '64px', height: '64px', background: 'var(--sm-navy)', color: '#fff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.5rem'}}>{viewBidder.initials}</div>
                  <div>
                    <h3 style={{margin: '0 0 0.25rem', color: 'var(--sm-navy)', fontWeight: 800}}>{viewBidder.name}</h3>
                    <p style={{margin: 0, color: 'var(--sm-text-light)', fontSize: '0.85rem'}}>{viewBidder.category} · {viewBidder.location}</p>
                  </div>
               </div>
               <p style={{fontSize: '0.9rem', color: 'var(--sm-text-mid)', lineHeight: '1.6', marginBottom: '1.5rem', fontStyle: 'italic'}}>{viewBidder.bio}</p>
               <div className="sm-grid" style={{gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem'}}>
                  <div style={{padding: '0.75rem', background: 'var(--sm-gray-light)', borderRadius: '10px', textAlign: 'center'}}>
                    <div style={{fontSize: '0.7rem', color: 'var(--sm-text-light)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem'}}>Rating</div>
                    <div style={{fontWeight: 800, color: 'var(--sm-navy)'}}>Rating: {viewBidder.rating}</div>
                  </div>
                  <div style={{padding: '0.75rem', background: 'var(--sm-gray-light)', borderRadius: '10px', textAlign: 'center'}}>
                    <div style={{fontSize: '0.7rem', color: 'var(--sm-text-light)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem'}}>Completed</div>
                    <div style={{fontWeight: 800, color: 'var(--sm-navy)'}}>{viewBidder.jobs} Jobs</div>
                  </div>
               </div>
               <button className="sm-btn sm-btn-primary" style={{width: '100%'}} onClick={() => setViewBidder(null)}>Close Profile</button>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="sm-overlay animate-fade" onClick={() => setConfirmDelete(false)} style={{position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
             <div className="sm-card" style={{maxWidth: '400px', textAlign: 'center', padding: '2rem'}}>
                <h3 style={{color: 'var(--sm-navy)', fontWeight: 800}}>Delete Request?</h3>
                <p style={{color: 'var(--sm-text-mid)', marginBottom: '2rem'}}>This project will be permanently closed and removed. This action cannot be undone.</p>
                <div style={{display: 'flex', gap: '0.75rem'}}>
                  <button className="sm-btn sm-btn-ghost" style={{flex: 1}} onClick={() => setConfirmDelete(false)}>Keep it</button>
                  <button className="sm-btn sm-btn-primary" style={{flex: 1, color: 'white', background: 'var(--sm-danger)'}} onClick={handleDelete}>Confirm Delete</button>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
