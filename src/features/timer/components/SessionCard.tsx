// ══════════════════════════════════════════════════
// FILE: src/features/timer/components/SessionCard.tsx
// PURPOSE: Individual session card — slide-in animation, swipe-to-delete, i18n
// ══════════════════════════════════════════════════

import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  PanResponder,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { Card } from '@shared/components/Card';
import { Spacing, BorderRadius, Layout } from '@theme/spacing';
import { formatTimestamp, formatMinutesAsHHMM } from '@shared/utils/timeUtils';
import type { WorkSession, Employer } from '@core/types/models';
import type { Theme } from '@theme/index';

interface SessionCardProps {
  session: WorkSession;
  employer: Employer | undefined;
  onDelete: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  onEdit?: (session: WorkSession) => void;
}

const SWIPE_THRESHOLD = -80;
const DELETE_WIDTH = 80;

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  employer,
  onDelete,
  onUpdateNote,
  onEdit,
}) => {
  const { t } = useLanguage();
  const theme = useColorScheme();
  const styles = makeStyles(theme);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(session.note ?? '');
  const translateX = useRef(new Animated.Value(0)).current;
  const isSwipedOpen = useRef(false);

  // Slide-in entry animation
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Bug #6 Fix: Sync local state when prop changes
  useEffect(() => {
    setNoteText(session.note ?? '');
  }, [session.note]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, opacityAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 20,
      onPanResponderMove: (_, gestureState) => {
        const dx = Math.max(-DELETE_WIDTH - 20, Math.min(0, gestureState.dx));
        translateX.setValue(dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < SWIPE_THRESHOLD) {
          Animated.spring(translateX, {
            toValue: -DELETE_WIDTH,
            useNativeDriver: true,
          }).start(() => {
            isSwipedOpen.current = true;
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start(() => {
            isSwipedOpen.current = false;
          });
        }
      },
    }),
  ).current;

  const closeSwipe = useCallback(() => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      isSwipedOpen.current = false;
    });
  }, [translateX]);

  const handleDelete = useCallback(() => {
    closeSwipe();
    Alert.alert(
      t('common.delete'),
      t('settings.clear_data_confirm_message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => onDelete(session.id),
        },
      ],
    );
  }, [closeSwipe, onDelete, session.id, t]);

  const handleSaveNote = useCallback(() => {
    setIsEditingNote(false);
    if (noteText !== session.note) {
      onUpdateNote(session.id, noteText);
    }
  }, [noteText, session.id, session.note, onUpdateNote]);

  const accentColor = employer?.color ?? theme.colors.primary;
  const isActive = session.endTime === null;

  const endTimeDisplay = session.endTime !== null
    ? formatTimestamp(session.endTime)
    : '–';

  const durationDisplay = session.durationMinutes !== null
    ? formatMinutesAsHHMM(session.durationMinutes)
    : '–';

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      {/* Delete button revealed by swipe */}
      <View style={styles.deleteButton}>
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteTouch}
          accessibilityRole="button"
          accessibilityLabel={t('accessibility.delete_session')}
        >
          <Typography variant="subhead" color={theme.colors.white}>
            🗑
          </Typography>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
      >
        <TouchableWithoutFeedback 
          onLongPress={() => {
            if (onEdit) onEdit(session); // ✓ WIRED
          }}
          delayLongPress={500}
        >
          <View>
            <Card accentColor={isActive ? theme.colors.primary : accentColor}>
              <View style={styles.header}>
                <View style={styles.timeRow}>
                  <View style={styles.timeBlock}>
                    <Typography variant="caption2" color={theme.colors.gray400}>
                      {t('pdf.col_start')}
                    </Typography>
                    <Typography variant="callout" style={styles.timeValue}>
                      {formatTimestamp(session.startTime)}
                    </Typography>
                  </View>
                  <Typography variant="body" color={theme.colors.gray400} style={styles.arrow}>
                    →
                  </Typography>
                  <View style={styles.timeBlock}>
                    <Typography variant="caption2" color={theme.colors.gray400}>
                      {t('pdf.col_end')}
                    </Typography>
                    <Typography variant="callout" style={styles.timeValue}>
                      {endTimeDisplay}
                    </Typography>
                  </View>
                  <View style={styles.durationBlock}>
                    <Typography variant="caption2" color={theme.colors.gray400}>
                      {t('pdf.col_duration')}
                    </Typography>
                    <Typography
                      variant="headline"
                      color={isActive ? theme.colors.primary : theme.colors.gray900}
                    >
                      {durationDisplay}
                    </Typography>
                  </View>
                </View>
              </View>

              {/* Note section */}
              {isEditingNote ? (
                <TextInput
                  value={noteText}
                  onChangeText={(text) => setNoteText(text.slice(0, 140))}
                  onBlur={handleSaveNote}
                  onSubmitEditing={handleSaveNote}
                  style={[styles.noteInput, { color: theme.colors.gray800, borderColor: theme.colors.gray200 }]}
                  placeholder={t('home.note_placeholder')}
                  placeholderTextColor={theme.colors.gray400}
                  returnKeyType="done"
                  autoFocus
                  maxLength={140}
                  accessibilityLabel={t('accessibility.edit_session')}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => setIsEditingNote(true)}
                  style={styles.noteTouch}
                  accessibilityRole="button"
                  accessibilityLabel={session.note !== null ? t('accessibility.edit_session') : t('home.add_note')}
                >
                  {session.note !== null ? (
                    <Typography variant="footnote" color={theme.colors.gray600}>
                      {session.note}
                    </Typography>
                  ) : (
                    <Typography variant="footnote" color={theme.colors.gray400}>
                      + {t('home.add_note')}
                    </Typography>
                  )}
                </TouchableOpacity>
              )}
            </Card>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </Animated.View>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    wrapper: {
      marginBottom: Spacing.sm,
      position: 'relative',
    },
    deleteButton: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: DELETE_WIDTH,
      backgroundColor: theme.colors.danger,
      borderRadius: BorderRadius.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteTouch: {
      width: DELETE_WIDTH,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {},
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    timeBlock: { flex: 1 },
    arrow: { marginHorizontal: Spacing.xs },
    durationBlock: {
      alignItems: 'flex-end',
    },
    timeValue: {
      fontVariant: ['tabular-nums'],
    },
    noteTouch: {
      paddingTop: Spacing.xs,
      minHeight: Layout.minTouchTarget / 2,
    },
    noteInput: {
      marginTop: Spacing.xs,
      padding: Spacing.sm,
      borderWidth: 1,
      borderRadius: BorderRadius.xs,
      fontSize: 13,
    },
  });
}
