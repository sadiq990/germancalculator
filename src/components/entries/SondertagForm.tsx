import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useTranslation } from '../../hooks/useTranslation';
import { useSondertagStore } from '../../store/useSondertagStore';
import type { Sondertag } from '../../types/sondertag.types';

export const SondertagForm: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const addSondertag = useSondertagStore(state => state.addSondertag);

  const [date, setDate] = useState('');
  const [type, setType] = useState<any>('urlaub');
  const [durationMinutes, setDurationMinutes] = useState(480);
  const [note, setNote] = useState('');

  const handleSave = async () => {
    const s: Sondertag = {
      id: crypto.randomUUID(),
      date,
      type,
      durationMinutes,
      note,
      isPaid: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await addSondertag(s);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('sondertage.add_sondertag')} footer={
      <div className="flex gap-2 justify-end w-full">
        <Button variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={handleSave}>{t('common.save')}</Button>
      </div>
    }>
      <div className="flex flex-col gap-4">
        <Input type="date" label={t('entries.date')} value={date} onChange={e => setDate(e.target.value)} />
        <Select 
          label="Typ"
          options={[
            { value: 'urlaub', label: t('sondertage.urlaub') },
            { value: 'krankheit', label: t('sondertage.krankheit') },
            { value: 'feiertag', label: t('sondertage.feiertag') }
          ]}
          value={type}
          onChange={e => setType(e.target.value)}
        />
        <Input type="number" label={t('entries.duration') + " (Minuten)"} value={durationMinutes} onChange={e => setDurationMinutes(Number(e.target.value))} />
        <Input label={t('entries.note')} value={note} onChange={e => setNote(e.target.value)} />
      </div>
    </Modal>
  );
};
