import { useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

let toastId = 0;
let globalAddToast = null;

export function toast(type, title, msg) {
  if (globalAddToast) globalAddToast({ type, title, msg });
}

const icons = {
  success: <CheckCircle size={16} />,
  error:   <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
};

function ToastItem({ item, onRemove }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(item.id), 4000);
    return () => clearTimeout(t);
  }, [item.id, onRemove]);

  return (
    <div className={`toast ${item.type}`}>
      <span className={`toast-icon ${item.type}`}>{icons[item.type]}</span>
      <div className="toast-content">
        <div className="toast-title">{item.title}</div>
        {item.msg && <div className="toast-msg">{item.msg}</div>}
      </div>
      <button className="toast-close" onClick={() => onRemove(item.id)}>
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((t) => {
    setToasts((prev) => [...prev, { ...t, id: ++toastId }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => { globalAddToast = addToast; return () => { globalAddToast = null; }; }, [addToast]);

  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} item={t} onRemove={removeToast} />
      ))}
    </div>
  );
}
