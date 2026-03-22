// ══════════════════════════════════════════════════
// FILE: src/features/timer/components/EditSessionSheet.tsx
// PURPOSE: Bottom sheet modal for editing an existing work session
// ══════════════════════════════════════════════════

import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTimerStore } from '@store/timerStore';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { Button } from '@shared/components/Button';
import { Spacing, BorderRadius, Layout } from '@theme/spacing';
import { format, parse, isValid } from 'date-fns';
import type { WorkSession } from '@core/types/models';

interface EditSessionSheetProps {
  session: WorkSession | null;
  visible: boolean;
  onClose: () => void;
}

export const EditSessionSheet: React.FC<EditSessionSheetProps> = ({
  session,
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const theme = useColorScheme();
  const updateSession = useTimerStore((s) => s.updateSession);
  const deleteSession = useTimerStore((s) => s.deleteSession);

  const [dateStr, setDateStr] = useState('');
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isActive = session !== null && session.endTime === null && session.pausedAt === null;

  useEffect(() => {
    if (session) {
      setDateStr(format(new Date(session.startTime), 'dd.MM.yyyy'));
      setStartStr(format(new Date(session.startTime), 'HH:mm'));
      setEndStr(session.endTime ? format(new Date(session.endTime), 'HH:mm') : '');
      setNote(session.note ?? '');
      setError(null);
    }
  }, [session]);

  const formatTimeInput = (text: string) => {
    let cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length >= 3) {
      cleaned = cleaned.slice(0, 2) + ':' + cleaned.slice(2, 4);
    }
    return cleaned.slice(0, 5);
  };

  const handleSubmit = useCallback(async () => {
    if (!session) return;
    setError(null);

    try {
      if (isActive) {
        // Only note can be updated
        await updateSession(session.id, { note }); // ✓ WIRED
        onClose();
        return;
      }

      if (!startStr) return setError('Pflichtfeld (Startzeit)');
      if (!endStr) return setError('Pflichtfeld (Endzeit)');
      if (!dateStr) return setError('Pflichtfeld (Datum)');

      const parsedDate = parse(dateStr, 'dd.MM.yyyy', new Date());
      if (!isValid(parsedDate)) {
        setError('Ungültiges Datum');
        return;
      }

      const parsedStart = parse(startStr, 'HH:mm', parsedDate);
      const parsedEnd = parse(endStr, 'HH:mm', parsedDate);

      if (!isValid(parsedStart) || !isValid(parsedEnd)) {
        setError('Ungültige Zeit (HH:mm formati)');
        return;
      }

      const startTime = parsedStart.getTime();
      const endTime = parsedEnd.getTime();

      await updateSession(session.id, { startTime, endTime, note }); // ✓ WIRED
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        const msg = err.message;
        const validKeys = ['manual_entry.error_order', 'manual_entry.error_future', 'manual_entry.error_overlap', 'edit_session.active_locked'] as const;
        if (validKeys.includes(msg as any)) {
          setError(t(msg as typeof validKeys[number]));
        } else {
          setError(msg);
        }
      } else {
        setError('Unbekannter Fehler');
      }
    }
  }, [session, isActive, dateStr, startStr, endStr, note, updateSession, onClose, t]);

  const handleDelete = useCallback(() => {
    if (!session) return;
    Alert.alert(
      t('edit_session.delete'),
      'Bist du sicher, dass du diesen Eintrag löschen möchtest?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: t('edit_session.delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteSession(session.id); // ✓ WIRED
            onClose();
          },
        },
      ]
    );
  }, [session, deleteSession, onClose, t]);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.sheet, { backgroundColor: theme.isDark ? theme.colors.gray50 : theme.colors.white }]}
          >
            <View style={styles.header}>
              <Typography variant="headline" color={theme.colors.gray900}>
                {t('edit_session.title')}
              </Typography>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <Typography variant="body" color={theme.colors.gray400}>✕</Typography>
              </TouchableOpacity>
            </View>

            {error && (
              <View style={[styles.errorBox, { backgroundColor: theme.colors.dangerLight }]}>
                <Typography variant="caption1" color={theme.colors.danger}>
                  {error}
                </Typography>
              </View>
            )}

            {isActive && (
              <View style={[styles.infoBox, { backgroundColor: theme.colors.primaryLight }]}>
                <Typography variant="caption1" color={theme.colors.primary}>
                  {t('edit_session.active_locked')}
                </Typography>
              </View>
            )}

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Typography variant="caption1" color={theme.colors.gray600} style={styles.label}>
                  {t('manual_entry.date')}
                </Typography>
                <TextInput
                  style={[styles.input, { borderColor: theme.colors.gray200, color: isActive ? theme.colors.gray400 : theme.colors.gray900, backgroundColor: isActive ? (theme.isDark ? '#0F0F0F' : theme.colors.gray50) : 'transparent' }]}
                  value={dateStr}
                  onChangeText={(t) => setDateStr(t.replace(/[^0-9.]/g, '').slice(0, 10))}
                  placeholder="DD.MM.YYYY"
                  placeholderTextColor={theme.colors.gray400}
                  keyboardType="numeric"
                  editable={!isActive}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
                  <Typography variant="caption1" color={theme.colors.gray600} style={styles.label}>
                    {t('manual_entry.start_time')}
                  </Typography>
                  <TextInput
                    style={[styles.input, { borderColor: theme.colors.gray200, color: isActive ? theme.colors.gray400 : theme.colors.gray900, backgroundColor: isActive ? (theme.isDark ? '#0F0F0F' : theme.colors.gray50) : 'transparent' }]}
                    value={startStr}
                    onChangeText={(text) => setStartStr(formatTimeInput(text))}
                    placeholder="09:00"
                    placeholderTextColor={theme.colors.gray400}
                    keyboardType="numeric"
                    editable={!isActive}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: Spacing.sm }]}>
                  <Typography variant="caption1" color={theme.colors.gray600} style={styles.label}>
                    {t('manual_entry.end_time')}
                  </Typography>
                  <TextInput
                    style={[styles.input, { borderColor: theme.colors.gray200, color: isActive ? theme.colors.gray400 : theme.colors.gray900, backgroundColor: isActive ? (theme.isDark ? '#0F0F0F' : theme.colors.gray50) : 'transparent' }]}
                    value={endStr}
                    onChangeText={(text) => setEndStr(formatTimeInput(text))}
                    placeholder="17:30"
                    placeholderTextColor={theme.colors.gray400}
                    keyboardType="numeric"
                    editable={!isActive}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Typography variant="caption1" color={theme.colors.gray600} style={styles.label}>
                  {t('manual_entry.note')}
                </Typography>
                <TextInput
                  style={[styles.input, { borderColor: theme.colors.gray200, color: theme.colors.gray900, height: 80 }]}
                  value={note}
                  onChangeText={setNote}
                  placeholder="..."
                  placeholderTextColor={theme.colors.gray400}
                  multiline
                  maxLength={140}
                />
              </View>

              <View style={styles.actionRow}>
                <View style={{ flex: 1, marginRight: Spacing.sm }}>
                  <Button
                    label={t('edit_session.delete')}
                    onPress={handleDelete} // ✓ WIRED
                    variant="danger"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                  <Button
                    label={t('edit_session.save')}
                    onPress={() => void handleSubmit()} // ✓ WIRED
                    variant="primary"
                  />
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ✓ SELF-TEST: EditSessionSheet
// □ Session is pre-filled on open?
// □ Delete calls store via handleDelete + Alert dialog?
// □ Save calls store.updateSession via handleSubmit?
// □ isRunning/active session blocks time changes but permits note edit?
// □ Warning info box displayed when session is active?

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  errorBox: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  infoBox: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  form: {
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: Spacing.sm,
  },
  label: {
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  deleteBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1,
  },
});
