import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTags, deleteTag, Tag } from '../../services/tagService';
import axiosInstance from '../../interceptor/interceptor';
import '../provider/Provider.css';

/* ---- inline SVG icons ---- */
const Icon = {
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.09 12.97a1 1 0 0 0 .77 1.63H10v6.4a1 1 0 0 0 1.78.63L19.91 11.03A1 1 0 0 0 19.14 9.4H14V3a1 1 0 0 0-1-1Z"/></svg>
  ),
  Tag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  Save: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
  ),
};

/* ---- Add Tag Modal ---- */
interface AddTagModalProps {
  show: boolean;
  onHide: () => void;
  onTagAdded: () => void;
}

const AddTagModal: React.FC<AddTagModalProps> = ({ show, onHide, onTagAdded }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/tags', { name });
      if (response.status < 200 || response.status >= 300) {
        throw new Error('Failed to create tag');
      }
      setName('');
      onTagAdded();
      onHide();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error creating tag.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { setName(''); setError(''); onHide(); };

  if (!show) return null;

  return (
    <div className="pr-modal-overlay" onClick={handleClose}>
      <div className="pr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pr-modal-header">
          <h3 className="pr-modal-title">Add Tag</h3>
          <button className="pr-modal-close" onClick={handleClose}><Icon.Close /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="pr-modal-body">
            {error && (
              <div className="pr-alert pr-alert-danger" style={{ marginBottom: 14 }}>
                <Icon.AlertCircle /><span>{error}</span>
              </div>
            )}
            <div className="pr-modal-form-group">
              <label className="pr-modal-form-label pr-modal-form-label-required">Tag Name</label>
              <input
                className="pr-modal-form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter tag name"
                required
                autoFocus
              />
            </div>
          </div>
          <div className="pr-modal-footer">
            <button type="button" className="pr-btn pr-btn-ghost" onClick={handleClose} disabled={loading}>Cancel</button>
            <button type="submit" className="pr-btn pr-btn-primary" disabled={loading}>
              {loading
                ? <><span className="pr-spinner" style={{ width: 14, height: 14, borderWidth: 2, margin: 0, display: 'inline-block' }} />Saving…</>
                : <><Icon.Save />Add Tag</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---- Edit Tag Modal ---- */
interface EditTagModalProps {
  show: boolean;
  onHide: () => void;
  tag: Tag | null;
  onTagEdited: () => void;
}

const EditTagModal: React.FC<EditTagModalProps> = ({ show, onHide, tag, onTagEdited }) => {
  const [name, setName] = useState(tag?.name || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { setName(tag?.name || ''); setError(''); }, [tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!tag) return;
      const response = await axiosInstance.put(`/api/tags/${tag.id}`, { name });
      if (response.status < 200 || response.status >= 300) {
        throw new Error('Failed to update tag');
      }
      onTagEdited();
      onHide();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error updating tag.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="pr-modal-overlay" onClick={onHide}>
      <div className="pr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pr-modal-header">
          <h3 className="pr-modal-title">Edit Tag</h3>
          <button className="pr-modal-close" onClick={onHide}><Icon.Close /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="pr-modal-body">
            {error && (
              <div className="pr-alert pr-alert-danger" style={{ marginBottom: 14 }}>
                <Icon.AlertCircle /><span>{error}</span>
              </div>
            )}
            <div className="pr-modal-form-group">
              <label className="pr-modal-form-label pr-modal-form-label-required">Tag Name</label>
              <input
                className="pr-modal-form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter tag name"
                required
                autoFocus
              />
            </div>
          </div>
          <div className="pr-modal-footer">
            <button type="button" className="pr-btn pr-btn-ghost" onClick={onHide} disabled={loading}>Cancel</button>
            <button type="submit" className="pr-btn pr-btn-primary" disabled={loading}>
              {loading
                ? <><span className="pr-spinner" style={{ width: 14, height: 14, borderWidth: 2, margin: 0, display: 'inline-block' }} />Saving…</>
                : <><Icon.Save />Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---- Delete Tag Modal ---- */
interface DeleteTagModalProps {
  show: boolean;
  onHide: () => void;
  tag: Tag | null;
  loading: boolean;
  error: string;
  onConfirm: () => void;
}

const DeleteTagModal: React.FC<DeleteTagModalProps> = ({ show, onHide, tag, loading, error, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="pr-modal-overlay" onClick={onHide}>
      <div className="pr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pr-modal-header">
          <h3 className="pr-modal-title">Delete Tag</h3>
          <button className="pr-modal-close" onClick={onHide}><Icon.Close /></button>
        </div>
        <div className="pr-modal-body">
          {error && (
            <div className="pr-alert pr-alert-danger" style={{ marginBottom: 14 }}>
              <Icon.AlertCircle /><span>{error}</span>
            </div>
          )}
          <p>Are you sure you want to delete tag <strong>"{tag?.name}"</strong>?</p>
          <p><small>This action cannot be undone.</small></p>
        </div>
        <div className="pr-modal-footer">
          <button className="pr-btn pr-btn-ghost" onClick={onHide} disabled={loading}>Cancel</button>
          <button className="pr-btn pr-btn-danger" onClick={onConfirm} disabled={loading}>
            {loading
              ? <><span className="pr-spinner" style={{ width: 14, height: 14, borderWidth: 2, margin: 0, display: 'inline-block' }} />Deleting…</>
              : <><Icon.Trash />Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---- Main Component ---- */
const TagList: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const navigate = useNavigate();

  const loadTags = async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await getTags();
      let filtered = data;
      if (search.trim()) {
        filtered = filtered.filter((t: Tag) =>
          t.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      setTags(filtered);
    } catch {
      setError('Error loading tags.');
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTags(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadTags(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    loadTags('');
  };

  const handleEditTag = (tag: Tag) => {
    setTagToEdit(tag);
    setShowEditModal(true);
  };

  const handleDeleteTag = (tag: Tag) => {
    setTagToDelete(tag);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!tagToDelete) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await deleteTag(tagToDelete.id);
      setShowDeleteModal(false);
      setTagToDelete(null);
      setSuccess('Tag deleted successfully.');
      loadTags(searchQuery);
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setDeleteError('Error deleting tag.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleTagAdded = () => {
    setSuccess('Tag added successfully.');
    loadTags(searchQuery);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleTagEdited = () => {
    setSuccess('Tag updated successfully.');
    loadTags(searchQuery);
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="pr-page">
      {/* ---- HEADER ---- */}
      <header className="pr-header">
        <div className="pr-header-inner">
          <div className="pr-brand">
            <div className="pr-logo-mark" aria-hidden="true"><Icon.Bolt /></div>
            <h1 className="pr-brand-name">EnerLink</h1>
            <span className="pr-brand-tag">CRM</span>
          </div>
          <div className="pr-header-actions">
            <button className="pr-btn" onClick={() => navigate('/dashboard')}>
              <Icon.Back /><span>Dashboard</span>
            </button>
            <button className="pr-btn pr-btn-primary" onClick={() => setShowAddModal(true)}>
              <Icon.Plus /><span>Add Tag</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---- MAIN ---- */}
      <main className="pr-main">
        {/* Hero */}
        <div className="pr-hero">
          <div className="pr-hero-grid" aria-hidden="true" />
          <div className="pr-hero-left">
            <div className="pr-hero-icon" aria-hidden="true"><Icon.Tag /></div>
            <div>
              <h2 className="pr-hero-title">Tag Management</h2>
              <p className="pr-hero-subtitle">Manage and organize customer tags</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="pr-alert pr-alert-danger">
            <Icon.AlertCircle /><span>{error}</span>
          </div>
        )}
        {success && (
          <div className="pr-alert pr-alert-success">
            <Icon.CheckCircle /><span>{success}</span>
          </div>
        )}

        {/* Toolbar */}
        <div className="pr-toolbar">
          <form className="pr-search-wrap" onSubmit={handleSearch}>
            <span className="pr-search-icon" aria-hidden="true"><Icon.Search /></span>
            <input
              className="pr-search-input"
              type="text"
              placeholder="Search tags by name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="pr-filter-group">
            <button className="pr-filter-btn" onClick={handleClear}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12, display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Clear
            </button>
          </div>
        </div>

        {loading ? (
          <div className="pr-state-center">
            <span className="pr-spinner" />
            <p className="pr-state-label">Loading tags…</p>
          </div>
        ) : (
          <>
            <p className="pr-results-info">{tags.length} tag{tags.length !== 1 ? 's' : ''} found</p>

            <div className="pr-table-card">
              <div className="pr-table-wrap">
                <table className="pr-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tags.length === 0 ? (
                      <tr>
                        <td colSpan={3}>
                          <div className="pr-table-empty">
                            <div className="pr-table-empty-icon"><Icon.Tag /></div>
                            No tags found.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      tags.map((tag) => (
                        <tr key={tag.id}>
                          <td><span className="pr-table-id">{tag.id}</span></td>
                          <td className="pr-table-name">
                            <span className="pr-badge pr-badge-active">{tag.name}</span>
                          </td>
                          <td>
                            <div className="pr-row-actions">
                              <button
                                className="pr-action-btn"
                                onClick={() => handleEditTag(tag)}
                              >
                                <Icon.Edit />Edit
                              </button>
                              <button
                                className="pr-action-btn pr-action-btn-danger"
                                onClick={() => handleDeleteTag(tag)}
                              >
                                <Icon.Trash />Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ---- MODALS ---- */}
      <AddTagModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onTagAdded={handleTagAdded}
      />
      <EditTagModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        tag={tagToEdit}
        onTagEdited={handleTagEdited}
      />
      <DeleteTagModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        tag={tagToDelete}
        loading={deleteLoading}
        error={deleteError}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TagList;
