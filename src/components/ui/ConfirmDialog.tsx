import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="ghost" onClick={onClose} className="flex-1 sm:flex-none">
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} className="flex-1 sm:flex-none shadow-ios">
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <div className={`p-4 rounded-full ${confirmVariant === 'danger' ? 'bg-ios-red/10 text-ios-red' : 'bg-ios-blue/10 text-ios-blue'}`}>
          {confirmVariant === 'danger' ? <AlertTriangle size={32} /> : <Info size={32} />}
        </div>
        <p className="text-neutral-600 dark:text-ios-gray-2 leading-relaxed">
          {message}
        </p>
      </div>
    </Modal>
  );
};
