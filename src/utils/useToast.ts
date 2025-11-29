import { useState, useCallback } from 'react';

export function useToast() {
  const [message, setMessage] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const showToast = useCallback((msg: string, duration = 2200) => {
    setMessage(msg);
    setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);
    }, duration);
  }, []);

  return { message, isVisible, showToast };
}

