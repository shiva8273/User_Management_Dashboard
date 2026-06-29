import { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

const DEPARTMENTS = ['', 'Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Product', 'Operations'];

export default function FilterPopup({ filters, onChange, onClear }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isActive = Object.values(filters).some((v) => v.trim());

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleChange(e) { onChange({ ...filters, [e.target.name]: e.target.value }); }
  function handleClear() { onClear(); }

  return (
    <div className="filter-popup-wrapper" ref={ref}>
      <button className="btn btn-secondary" onClick={() => setOpen(!open)}>
        <SlidersHorizontal size={15} />
        <span>Filter</span>
        {isActive && <span className="filter-active-dot" />}
      </button>

      {open && (
        <div className="filter-popup">
          <div className="filter-popup-header">
            <span className="filter-popup-title">Filter Users</span>
            <button className="btn btn-ghost btn-icon" onClick={() => setOpen(false)}><X size={14} /></button>
          </div>

          <div className="form-group">
            <label className="form-label">First Name</label>
            <input name="firstName" className="form-control" value={filters.firstName}
              onChange={handleChange} placeholder="Filter by first name…" />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input name="lastName" className="form-control" value={filters.lastName}
              onChange={handleChange} placeholder="Filter by last name…" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" className="form-control" value={filters.email}
              onChange={handleChange} placeholder="Filter by email…" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Department</label>
            <select name="department" className="form-control" value={filters.department} onChange={handleChange}>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d || 'All departments'}</option>)}
            </select>
          </div>

          <div className="filter-popup-footer">
            <button className="btn btn-secondary btn-sm" onClick={handleClear} style={{ flex: 1 }}>Clear Filters</button>
            <button className="btn btn-primary btn-sm" onClick={() => setOpen(false)} style={{ flex: 1 }}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}
