import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { validateUserForm } from "../utils/validation";

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Product",
  "Operations",
];

const EMPTY_FORM = { firstName: "", lastName: "", email: "", department: "" };

export default function UserFormModal({ isOpen, onClose, onSubmit, editUser }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(
      editUser
        ? {
            firstName: editUser.firstName || "",
            lastName: editUser.lastName || "",
            email: editUser.email || "",
            department: editUser.department || "",
          }
        : EMPTY_FORM
    );
    setErrors({});
  }, [editUser, isOpen]);

  if (!isOpen) return null;

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validateUserForm(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" role="dialog" aria-labelledby="modal-title">
        <div className="modal-header">
          <span className="modal-title" id="modal-title">
            {editUser ? "Edit User" : "Add New User"}
          </span>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">
                  First Name <span className="required">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  className={`form-control${errors.firstName ? " error" : ""}`}
                  value={form.firstName}
                  onChange={onChange}
                  placeholder="e.g. Siva"
                  autoFocus
                />
                {errors.firstName && (
                  <span className="form-error">
                    <AlertCircle size={12} />
                    {errors.firstName}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lastName">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  className={`form-control${errors.lastName ? " error" : ""}`}
                  value={form.lastName}
                  onChange={onChange}
                  placeholder="e.g. Satish"
                />
                {errors.lastName && (
                  <span className="form-error">
                    <AlertCircle size={12} />
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-control${errors.email ? " error" : ""}`}
                value={form.email}
                onChange={onChange}
                placeholder="e.g. siva@example.com"
              />
              {errors.email && (
                <span className="form-error">
                  <AlertCircle size={12} />
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="department">
                Department <span className="required">*</span>
              </label>
              <select
                id="department"
                name="department"
                className={`form-control${errors.department ? " error" : ""}`}
                value={form.department}
                onChange={onChange}
              >
                <option value="">Select department…</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.department && (
                <span className="form-error">
                  <AlertCircle size={12} />
                  {errors.department}
                </span>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving…" : editUser ? "Save Changes" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}