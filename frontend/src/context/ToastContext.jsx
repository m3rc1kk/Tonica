import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

function Toast({ id, message, type = 'info', onClose }) {
    return (
        <div className={`toast toast--${type}`}>
            <div className="toast__content">
                <span className="toast__message">{message}</span>
            </div>
            <button 
                className="toast__close" 
                onClick={() => onClose(id)}
                aria-label="Close"
            >
                ×
            </button>
        </div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const MAX_TOASTS = 5;
    
    const showToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();

        setToasts(prev => {
            // Если уже достигнут максимум, удаляем самый старый (первый)
            const newToasts = prev.length >= MAX_TOASTS 
                ? [...prev.slice(1), { id, message, type }]
                : [...prev, { id, message, type }];
            return newToasts;
        });

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
        
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);


    const showSuccess = useCallback((message) => showToast(message, 'success'), [showToast]);
    const showError = useCallback((message) => showToast(message, 'error'), [showToast]);
    const showWarning = useCallback((message) => showToast(message, 'warning'), [showToast]);
    const showInfo = useCallback((message) => showToast(message, 'info'), [showToast]);

    return (
        <ToastContext.Provider value={{
            showToast,
            showSuccess,
            showError,
            showWarning,
            showInfo,
            removeToast
        }}>
            {children}
            <div className="toast-container">
                {toasts.slice(-MAX_TOASTS).map(toast => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

