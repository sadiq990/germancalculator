import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useTranslation } from '../../hooks/useTranslation';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmVariant?: 'primary' | 'danger';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmVariant = 'primary'
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
          <Button variant={confirmVariant} onClick={() => { onConfirm(); onClose(); }}>{t('common.ok')}</Button>
        </>
      }
    >
      <p className="text-neutral-600 dark:text-dark-text-secondary">{message}</p>
    </Modal>
  );
};
