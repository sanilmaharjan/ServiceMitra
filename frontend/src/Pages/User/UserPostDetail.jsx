import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserNavbar from "../../Components/UserNavbar";

export default function UserPostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => {
    fetchPost();
    fetchBids();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/jobs/${id}/`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      const data = await response.json();
      setPost(data);
      setEditTitle(data.title);
      setEditDesc(data.description);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/jobs/${id}/bids/list/`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      const data = await response.json();
      setBids(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAcceptBid = async (bidId) => {
    if (window.confirm("Accept this bid? This will assign the job to this provider.")) {
      try {
        await fetch(`http://127.0.0.1:8000/api/jobs/bids/${bidId}/accept/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          }
        });
        alert("Bid accepted! Job assigned to provider.");
        fetchPost();
        fetchBids();
      } catch (err) {
        alert("Failed to accept bid");
      }
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/jobs/bids/${bidId}/reject/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      alert("Bid rejected");
      fetchBids();
    } catch (err) {
      alert("Failed to reject bid");
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/jobs/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({ title: editTitle, description: editDesc })
      });
      const data = await response.json();
      setPost(data);
      setIsEditing(false);
      alert("Job updated!");
    } catch (err) {
      alert("Failed to update");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this job?")) {
      await fetch(`http://127.0.0.1:8000/api/jobs/${id}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      navigate("/user");
      alert("Job deleted!");
    }
  };

  if (loading) return <div><UserNavbar /><div style={{padding: "20px"}}>Loading...</div></div>;
  if (!post) return <div><UserNavbar /><div style={{padding: "20px"}}>Job not found</div></div>;

  return (
    <div>
      <UserNavbar userName="User" backTo="/user" />
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Job Details */}
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
          {!isEditing ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h1>{post.title}</h1>
                <div>
                  <button onClick={() => setIsEditing(true)} style={{ padding: "8px 16px", marginRight: "10px", cursor: "pointer" }}>✏️ Edit</button>
                  <button onClick={handleDelete} style={{ padding: "8px 16px", color: "red", cursor: "pointer" }}>🗑️ Delete</button>
                </div>
              </div>
              <p>{post.description}</p>
              <p><strong>Budget:</strong> Rs. {post.budget}</p>
              <p><strong>Category:</strong> {post.category_name}</p>
              <p><strong>Status:</strong> <span style={{ background: post.status === 'pending' ? '#f4a261' : '#22c55e', color: "white", padding: "4px 8px", borderRadius: "20px", fontSize: "12px" }}>{post.status}</span></p>
              <p><strong>Created:</strong> {new Date(post.created_at).toLocaleDateString()}</p>
            </>
          ) : (
            <>
              <input 
                type="text" 
                value={editTitle} 
                onChange={e => setEditTitle(e.target.value)} 
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              />
              <textarea 
                value={editDesc} 
                onChange={e => setEditDesc(e.target.value)} 
                style={{ width: "100%", padding: "8px", minHeight: "100px", marginBottom: "10px" }}
              />
              <button onClick={handleSave} style={{ padding: "8px 16px", marginRight: "10px", cursor: "pointer" }}>💾 Save</button>
              <button onClick={() => setIsEditing(false)} style={{ padding: "8px 16px", cursor: "pointer" }}>Cancel</button>
            </>
          )}
        </div>

        {/* Bids Section - Client accepts/rejects here */}
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px" }}>
          <h2>Bids Received ({bids.length})</h2>
          
          {bids.length === 0 ? (
            <p>No bids yet. Providers will bid soon.</p>
          ) : (
            bids.map(bid => (
              <div key={bid.id} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "15px", marginBottom: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: "0 0 5px" }}>{bid.provider?.name || 'Provider'}</h3>
                    <p><strong>Amount:</strong> Rs. {bid.amount}</p>
                    <p><strong>Estimated Days:</strong> {bid.estimated_days} days</p>
                    <p><strong>Message:</strong> {bid.message}</p>
                  </div>
                  <div>
                    {bid.status === 'pending' ? (
                      <div>
                        <button 
                          onClick={() => handleAcceptBid(bid.id)} 
                          style={{ padding: "8px 16px", background: "#22c55e", color: "white", border: "none", borderRadius: "8px", marginRight: "10px", cursor: "pointer" }}
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleRejectBid(bid.id)} 
                          style={{ padding: "8px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ background: bid.status === 'accepted' ? '#22c55e' : '#ef4444', color: "white", padding: "4px 12px", borderRadius: "20px" }}>
                        {bid.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}