import { Dialog, DialogContent } from '@root/components/ui/dialog';
import { createContext, useContext, useState } from 'react';

// eslint-disable-next-line no-spaced-func
const DialogContext = createContext<{
  // eslint-disable-next-line func-call-spacing
  openDialog: (content: React.ReactNode, id?: string) => void;
  closeDialog: () => void;
} | null>(null);

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
    null
  );
  const [dialogId, setDialogId] = useState<string>('');

  const openDialog = (content: React.ReactNode, id?: string) => {
    setDialogContent(content);
    setDialogId(id ?? '');
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setDialogContent(null);
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent id={dialogId}>{dialogContent}</DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
