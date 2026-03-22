import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const PaywallModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Upgrade auf PRO" maxWidthClass="max-w-md">
      <div className="flex flex-col gap-4 items-center text-center p-4">
        <h3 className="text-xl font-bold dark:text-dark-text">Limits erreichen — Zeit fürs Upgrade!</h3>
        <p className="text-neutral-500 dark:text-dark-text-secondary">Sichere dir die PRO Version für unbegrenzte PDF Exports & AI Erklärungen.</p>
        <Button className="w-full" size="lg">Für €34.99/Jahr abonnieren</Button>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Vielleicht später</Button>
      </div>
    </Modal>
  );
};
