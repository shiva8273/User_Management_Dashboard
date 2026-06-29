import { Trash2, X } from 'lucide-react';
import { useState } from 'react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, user }) {
  const [deleting, setDeleting] = useState(false);
  if (!isOpen || !user) return null;

  async function handleDelete() {
    setDeleting(true);
    try { await onConfirm(user.id); onClose(); }
    catch { setDeleting(false); }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal confirm-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <span className="modal-title">Delete User</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="confirm-body">
          <div className="confirm-icon-wrap"><Trash2 size={22} /></div>
          <h3>Are you sure?</h3>
          <p>
            You are about to delete <strong>{user.firstName} {user.lastName}</strong>.
            This action cannot be undone.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete User'}
          </button>
        </div>
      </div>
    </div>
  );
}
