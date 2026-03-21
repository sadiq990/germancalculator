// ══════════════════════════════════════════════════
// FILE: src/features/timer/components/SessionCard.tsx
// PURPOSE: Individual session card — shows times, duration, note, swipe-to-delete
// ══════════════════════════════════════════════════

import React, { useCallback, useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  PanResponder,
  Alert,
} from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { Card } from '@shared/components/Card';
import { Spacing, BorderRadius, Layout } from '@theme/spacing';
import { formatTimestamp, formatMinutesAsHHMM } from '@shared/utils/timeUtils';
import type { WorkSession, Employer } from '@core/types/models';
import type { Theme } from '@theme/index';

interface SessionCardProps {
  session: WorkSession;
  employer?: Employer;
  onDelete: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
}

const SWIPE_THRESHOLD = -80;
const DELETE_WIDTH = 80;

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  employer,
  onDelete,
  onUpdateNote,
}) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(session.note ?? '');
  const translateX = useRef(new Animated.Value(0)).current;
  const isSwipedOpen = useRef(false);

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
      'Schicht löschen?',
      'Diese Schicht wird unwiderruflich gelöscht.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => onDelete(session.id),
        },
      ],
    );
  }, [closeSwipe, onDelete, session.id]);

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
    <View
      style={styles.wrapper}
      accessibilityRole="none"
    >
      {/* Delete button revealed by swipe */}
      <View style={styles.deleteButton}>
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteTouch}
          accessibilityRole="button"
          accessibilityLabel="Schicht löschen"
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
        <Card accentColor={isActive ? theme.colors.primary : accentColor}>
          <View style={styles.header}>
            <View style={styles.timeRow}>
              <View style={styles.timeBlock}>
                <Typography variant="caption2" color={theme.colors.gray400}>
                  Beginn
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
                  Ende
                </Typography>
                <Typography variant="callout" style={styles.timeValue}>
                  {endTimeDisplay}
                </Typography>
              </View>
              <View style={styles.durationBlock}>
                <Typography variant="caption2" color={theme.colors.gray400}>
                  Dauer
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
              onChangeText={(t) => setNoteText(t.slice(0, 140))}
              onBlur={handleSaveNote}
              onSubmitEditing={handleSaveNote}
              style={[styles.noteInput, { color: theme.colors.gray800, borderColor: theme.colors.gray200 }]}
              placeholder="Kurze Notiz (max. 140 Zeichen)"
              placeholderTextColor={theme.colors.gray400}
              returnKeyType="done"
              autoFocus
              maxLength={140}
              accessibilityLabel="Schichtnotiz bearbeiten"
            />
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditingNote(true)}
              style={styles.noteTouch}
              accessibilityRole="button"
              accessibilityLabel={session.note !== null ? 'Notiz bearbeiten' : 'Notiz hinzufügen'}
            >
              {session.note !== null ? (
                <Typography variant="footnote" color={theme.colors.gray600}>
                  {session.note}
                </Typography>
              ) : (
                <Typography variant="footnote" color={theme.colors.gray400}>
                  + Notiz hinzufügen
                </Typography>
              )}
            </TouchableOpacity>
          )}
        </Card>
      </Animated.View>
    </View>
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
