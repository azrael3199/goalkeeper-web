import { useDialog } from '@root/providers/DialogProvider';
import React from 'react';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';

interface ConfirmationDialogProps {
  onDelete: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  onDelete,
}) => {
  const { closeDialog } = useDialog();

  return (
    <>
      <DialogHeader>
        <DialogTitle>Confirm</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this task? You will not be able to
          recover this once deleted.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={closeDialog}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            onDelete();
            closeDialog();
          }}
        >
          Delete
        </Button>
      </DialogFooter>
    </>
  );
};

export default ConfirmationDialog;
