import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from '../../hooks/useTranslation';
import { useEntryStore } from '../../store/useEntryStore';
import type { TimeEntry } from '../../types/entry.types';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface EntryFormProps {
  entry: TimeEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ entry, isOpen, onClose }) => {
  const { t } = useTranslation();
  const updateEntry = useEntryStore(state => state.updateEntry);
  const deleteEntry = useEntryStore(state => state.deleteEntry);

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [note, setNote] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (entry) {
      setDate(entry.date);
      setStartTime(entry.startTime);
      setEndTime(entry.endTime || '');
      setNote(entry.note || '');
    }
  }, [entry]);

  const handleSave = async () => {
    if (!entry) return;
    
    // Duration calc
    const [h1 = 0, m1 = 0] = startTime.split(':').map(Number);
    const [h2 = 0, m2 = 0] = endTime.split(':').map(Number);
    const total1 = h1 * 60 + m1;
    let total2 = h2 * 60 + m2;
    if (total2 < total1) total2 += 24 * 60;
    const duration = total2 - total1;

    await updateEntry(entry.id, {
      date,
      startTime,
      endTime,
      note,
      duration
    });
    onClose();
  };

  const handleDelete = async () => {
    if (!entry) return;
    await deleteEntry(entry.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showDeleteConfirm}
        onClose={onClose}
        title={entry ? t('entries.edit_entry') : t('entries.add_entry')}
        footer={
          <div className="flex w-full justify-between">
            {entry ? (
              <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                {t('common.delete')}
              </Button>
            ) : <div />}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
              <Button onClick={handleSave}>{t('common.save')}</Button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Input 
            label={t('entries.date')} 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
          <div className="flex gap-4">
            <Input 
              label={t('entries.start_time')} 
              type="time" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
            />
            <Input 
              label={t('entries.end_time')} 
              type="time" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
            />
          </div>
          <Input 
            label={t('entries.note')} 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
          />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={t('common.warning')}
        message={t('entries.delete_confirm')}
        confirmVariant="danger"
      />
    </>
  );
};
