import { ChevronUp, ChevronDown, ChevronsUpDown, Pencil, Trash2, Users } from 'lucide-react';

const COLUMNS = [
  { key: 'id',         label: 'ID',         sortable: true },
  { key: 'firstName',  label: 'First Name',  sortable: true },
  { key: 'lastName',   label: 'Last Name',   sortable: true },
  { key: 'email',      label: 'Email',       sortable: true },
  { key: 'department', label: 'Department',  sortable: true },
  { key: 'actions',    label: 'Actions',     sortable: false },
];

function SortIcon({ col, sort }) {
  if (sort.key !== col) return <ChevronsUpDown size={13} className="sort-icon" />;
  return sort.dir === 'asc'
    ? <ChevronUp size={13} className="sort-icon active" />
    : <ChevronDown size={13} className="sort-icon active" />;
}

export default function UsersTable({ users, sort, onSort, onEdit, onDelete }) {
  if (!users.length) {
    return (
      <div className="state-box">
        <Users size={40} />
        <h3>No users found</h3>
        <p>Try adjusting your search or filter criteria, or add a new user.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'th-sortable' : ''}
                onClick={col.sortable ? () => onSort(col.key) : undefined}
              >
                <span className="th-inner">
                  {col.label}
                  {col.sortable && <SortIcon col={col.key} sort={sort} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="td-id">#{u.id}</td>
              <td className="td-name">{u.firstName}</td>
              <td>{u.lastName}</td>
              <td className="td-email"><a href={`mailto:${u.email}`}>{u.email}</a></td>
              <td><span className="dept-badge">{u.department}</span></td>
              <td>
                <div className="td-actions">
                  <button
                    className="btn btn-ghost btn-icon"
                    title="Edit user"
                    onClick={() => onEdit(u)}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    className="btn btn-ghost btn-icon"
                    title="Delete user"
                    onClick={() => onDelete(u)}
                    style={{ color: 'var(--danger)' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
