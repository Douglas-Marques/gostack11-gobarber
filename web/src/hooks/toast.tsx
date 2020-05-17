import React, { createContext, useCallback, useState, useContext } from 'react';
import { uuid } from 'uuidv4';

import ToastContainer from '../components/ToastContainer';

interface ToastContextData {
  addToast(message: Omit<Message, 'id'>): void;
  removeToast(id: string): void;
}

interface Message {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addToast = useCallback(
    ({ type, title, description }: Omit<Message, 'id'>) => {
      const id = uuid();
      const toast = {
        id,
        type,
        title,
        description,
      };
      setMessages((oldMessages) => [...oldMessages, toast]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setMessages((oldMessages) =>
      oldMessages.filter((oldMessage) => oldMessage.id !== id),
    );
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextData {
  const context = useContext(ToastContext);
  if (!context)
    throw new Error('useToast must be used within an ToastProvider!');
  else return context;
}
