import { ChevronLeft, ChevronRight } from 'lucide-react';

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

function getPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total-4, total-3, total-2, total-1, total];
  return [1, '…', current-1, current, current+1, '…', total];
}

export default function Pagination({ page, perPage, total, onPage, onPerPage }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage + 1;
  const end   = Math.min(page * perPage, total);
  const pages = getPages(page, totalPages);

  return (
    <div className="pagination-bar">
      <span className="pagination-meta">
        Showing <strong>{start}–{end}</strong> of <strong>{total}</strong> users
      </span>

      <div className="pagination-controls">
        <button className="page-btn" onClick={() => onPage(page - 1)} disabled={page === 1}>
          <ChevronLeft size={14} />
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="page-ellipsis">…</span>
          ) : (
            <button key={p} className={`page-btn${p === page ? ' active' : ''}`} onClick={() => onPage(p)}>
              {p}
            </button>
          )
        )}
        <button className="page-btn" onClick={() => onPage(page + 1)} disabled={page === totalPages}>
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="pagination-right">
        Rows per page:
        <select className="per-page-select" value={perPage} onChange={(e) => onPerPage(Number(e.target.value))}>
          {PER_PAGE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
    </div>
  );
}
