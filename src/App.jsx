import { useState, useMemo, useCallback } from 'react';
import { Users, Plus, RefreshCw, Search, X } from 'lucide-react';
import { useUsers } from './hooks/useUsers';
import UsersTable from './components/UsersTable';
import UserFormModal from './components/UserFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import FilterPopup from './components/FilterPopup';
import Pagination from './components/Pagination';
import ToastContainer, { toast } from './components/Toast';
import './styles/global.css';

const EMPTY_FILTERS = { firstName: '', lastName: '', email: '', department: '' };

export default function App() {
  const { users, loading, error, addUser, editUser, removeUser, reload } = useUsers();

  // ─── UI state ──────────────────────────────────────────────────────────
  const [search, setSearch]             = useState('');
  const [filters, setFilters]           = useState(EMPTY_FILTERS);
  const [sort, setSort]                 = useState({ key: 'id', dir: 'asc' });
  const [page, setPage]                 = useState(1);
  const [perPage, setPerPage]           = useState(10);
  const [formOpen, setFormOpen]         = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ─── Derived data ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users
      .filter((u) => {
        if (q) {
          const hay = `${u.firstName} ${u.lastName} ${u.email} ${u.department}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (filters.firstName && !u.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) return false;
        if (filters.lastName  && !u.lastName.toLowerCase().includes(filters.lastName.toLowerCase()))   return false;
        if (filters.email     && !u.email.toLowerCase().includes(filters.email.toLowerCase()))         return false;
        if (filters.department && u.department !== filters.department) return false;
        return true;
      })
      .sort((a, b) => {
        const av = String(a[sort.key] ?? '');
        const bv = String(b[sort.key] ?? '');
        const cmp = sort.key === 'id'
          ? Number(a.id) - Number(b.id)
          : av.localeCompare(bv, undefined, { numeric: true });
        return sort.dir === 'asc' ? cmp : -cmp;
      });
  }, [users, search, filters, sort]);

  const pageUsers = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  // ─── Handlers ───────────────────────────────────────────────────────────
  const handleSort = useCallback((key) => {
    setSort((prev) => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
    setPage(1);
  }, []);

  const handleSearch = useCallback((val) => { setSearch(val); setPage(1); }, []);
  const handleFilters = useCallback((f) => { setFilters(f); setPage(1); }, []);
  const handlePerPage = useCallback((n) => { setPerPage(n); setPage(1); }, []);

  const openAdd  = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (u) => { setEditTarget(u); setFormOpen(true); };

  const handleFormSubmit = useCallback(async (data) => {
    try {
      if (editTarget) {
        await editUser(editTarget.id, data);
        toast('success', 'User updated', `${data.firstName} ${data.lastName} has been updated.`);
      } else {
        await addUser(data);
        toast('success', 'User added', `${data.firstName} ${data.lastName} has been added.`);
      }
    } catch (err) {
      toast('error', 'Action failed', err.message);
      throw err;
    }
  }, [editTarget, editUser, addUser]);

  const handleDelete = useCallback(async (id) => {
    try {
      await removeUser(id);
      toast('success', 'User deleted', 'The user has been removed.');
    } catch (err) {
      toast('error', 'Delete failed', err.message);
      throw err;
    }
  }, [removeUser]);

  const handleReload = async () => {
    try { await reload(); toast('success', 'Refreshed', 'User list is up to date.'); }
    catch (err) { toast('error', 'Refresh failed', err.message); }
  };

  const filtersActive = Object.values(filters).some((v) => v.trim());

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-brand">
          <Users size={20} />
          User Management
        </div>
        <span className="app-header-meta">{users.length} total users</span>
      </header>

      <main className="app-main">
        <div className="card">
          {/* Toolbar */}
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="search-wrapper">
                <Search size={15} className="search-icon" />
                <input
                  className="search-input"
                  placeholder="Search users…"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {search && (
                  <button className="search-clear" onClick={() => handleSearch('')} aria-label="Clear search">
                    <X size={14} />
                  </button>
                )}
              </div>

              <FilterPopup
                filters={filters}
                onChange={handleFilters}
                onClear={() => { setFilters(EMPTY_FILTERS); setPage(1); }}
              />

              {(search || filtersActive) && (
                <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="toolbar-right">
              <button className="btn btn-secondary btn-icon" onClick={handleReload} title="Refresh">
                <RefreshCw size={15} />
              </button>
              <button className="btn btn-primary" onClick={openAdd}>
                <Plus size={15} />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="state-box">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <p>Loading users…</p>
            </div>
          ) : error ? (
            <div className="state-box">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--danger)' }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h3>Failed to load users</h3>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={handleReload} style={{ marginTop: '0.5rem' }}>Try Again</button>
            </div>
          ) : (
            <>
              <UsersTable
                users={pageUsers}
                sort={sort}
                onSort={handleSort}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
              <Pagination
                page={page}
                perPage={perPage}
                total={filtered.length}
                onPage={setPage}
                onPerPage={handlePerPage}
              />
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <UserFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        editUser={editTarget}
      />
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        user={deleteTarget}
      />

      <ToastContainer />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
