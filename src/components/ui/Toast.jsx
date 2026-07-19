import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export function useToast() {
  const [toast, setToast] = useState(null)

  function showToast(message, type = 'success') {
    setToast({ message, type, id: Date.now() })
  }

  function hideToast() {
    setToast(null)
  }

  return { toast, showToast, hideToast }
}

export function Toast({ toast, onHide }) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(onHide, 3500)
    return () => clearTimeout(timer)
  }, [toast?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!toast) return null

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl font-nunito font-semibold text-sm text-white min-w-[280px] max-w-sm ${
        toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
      }`}
    >
      {toast.type === 'error'
        ? <XCircle size={18} className="shrink-0" />
        : <CheckCircle size={18} className="shrink-0" />}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={onHide}
        className="text-white/70 hover:text-white shrink-0 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  )
}
