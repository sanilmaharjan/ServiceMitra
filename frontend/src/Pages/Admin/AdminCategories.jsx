import { useEffect, useState } from "react";
import AdminNavbar from "../../Components/AdminNavbar";
import "../../Styles/Admin.css";
import adminApi from "../../utils/adminApi";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, formData);
      } else {
        await adminApi.createCategory(formData);
      }
      await fetchCategories();
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || "" });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await adminApi.deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  return (
    <div className="admin-layout animate-fade">
      <AdminNavbar />
      <main className="sm-container sm-section">
        <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--sm-navy)', margin: 0 }}>Category Management</h1>
            <p style={{ color: 'var(--sm-text-mid)', marginTop: '0.5rem' }}>Manage service categories for job postings.</p>
          </div>
          <button className="sm-btn sm-btn-primary" onClick={openCreateModal}>
            Add Category
          </button>
        </header>

        {loading ? (
          <div className="sm-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Loading categories...</p>
          </div>
        ) : (
          <div className="sm-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {categories.map((category) => (
              <div key={category.id} className="sm-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem', color: 'var(--sm-navy)' }}>{category.name}</h3>
                <p style={{ margin: '0 0 1rem', color: 'var(--sm-text-mid)' }}>
                  {category.description || "No description"}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="sm-btn sm-btn-outline" onClick={() => handleEdit(category)}>
                    Edit
                  </button>
                  <button className="sm-btn sm-btn-danger" onClick={() => handleDelete(category.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="sm-overlay" onClick={() => setIsModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="sm-card" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
              <h3 style={{ margin: '0 0 1.5rem', color: 'var(--sm-navy)' }}>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="sm-input-group">
                  <label className="sm-label">Category Name</label>
                  <input
                    className="sm-input"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div className="sm-input-group">
                  <label className="sm-label">Description (Optional)</label>
                  <textarea
                    className="sm-input"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter category description"
                    rows="3"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" className="sm-btn sm-btn-outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="sm-btn sm-btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}