import { createContext, useContext, useState, useEffect      } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

 useEffect(() => {
  const handleToast = (event) => {
    const { type, message } = event.detail;

    showToast(type, message);
  };

  window.addEventListener(
    'showToast',
    handleToast
  );

  return () => {
    window.removeEventListener(
      'showToast',
      handleToast
    );
  };
}, []); 

  const showToast = (type, message) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`fixed top-24 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              toast.type === 'success'
                ? 'bg-white text-emerald-600 border-emerald-100'
                : 'bg-white text-red-600 border-red-100'
            }`}
          >
            {toast.type === 'success'
              ? <CheckCircle2 size={20} />
              : <AlertCircle size={20} />}

            <span className="font-bold text-sm">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};