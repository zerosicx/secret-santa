import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export function Toast({ message, isVisible }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
    } else {
      // Delay hiding to allow fade out animation
      const timeout = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-slate-900/90 text-white text-xs sm:text-sm shadow-lg transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
    </div>
  );
}

