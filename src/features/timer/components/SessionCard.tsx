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
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { Card } from '@shared/components/Card';
import { Spacing, BorderRadius } from '@theme/spacing';
import { formatTimestamp, formatMinutesAsHHMM } from '@shared/utils/timeUtils';
import { formatDate } from '@shared/utils/dateUtils';
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
  const { t } = useTranslation();
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
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, opacityAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        const newX = isSwipedOpen.current ? SWIPE_THRESHOLD + gesture.dx : gesture.dx;
        if (newX <= 0 && newX >= -DELETE_WIDTH - 20) {
          translateX.setValue(newX);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -40 || (isSwipedOpen.current && gesture.dx < 20)) {
          Animated.spring(translateX, {
            toValue: SWIPE_THRESHOLD,
            useNativeDriver: true,
          }).start();
          isSwipedOpen.current = true;
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          isSwipedOpen.current = false;
        }
      },
    }),
  ).current;

  const handleDeleteConfirm = useCallback(() => {
    Alert.alert(
      t('home.session_deleted'),
      t('settings.clear_data_confirm_message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: () => onDelete(session.id) },
      ],
    );
  }, [onDelete, session.id, t]);

  const handleNoteSubmit = useCallback(() => {
    onUpdateNote(session.id, noteText);
    setIsEditingNote(false);
  }, [onUpdateNote, session.id, noteText]);

  const durationStr = formatMinutesAsHHMM(session.durationMinutes ?? 0);
  const dateStr = formatDate(session.startTime);

  return (
    <View style={styles.outerContainer}>
      <Animated.View 
        style={[
          styles.deleteAction, 
          { 
            opacity: translateX.interpolate({
              inputRange: [SWIPE_THRESHOLD, 0],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }) 
          }
        ]}
      >
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteConfirm}>
          <Typography variant="caption1" color="white">
            {t('common.delete')}
          </Typography>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.cardWrapper,
          {
            transform: [{ translateX }, { translateY: slideAnim }],
            opacity: opacityAnim,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.content}
            onPress={() => onEdit?.(session)}
            activeOpacity={0.7}
          >
            <View style={styles.mainInfo}>
              <View style={styles.timeInfo}>
                <Typography variant="headline">
                  {durationStr}
                </Typography>
                <Typography variant="caption2" color={theme.colors.gray400}>
                  {dateStr}
                </Typography>
              </View>

              <View style={styles.employerInfo}>
                {employer && (
                  <View style={[styles.employerBadge, { backgroundColor: employer.color + '20' }]}>
                    <View style={[styles.colorDot, { backgroundColor: employer.color }]} />
                    <Typography variant="caption1" color={employer.color}>
                      {employer.name}
                    </Typography>
                  </View>
                )}
                <Typography variant="caption2" color={theme.colors.gray400}>
                  {formatTimestamp(session.startTime)} - {session.endTime ? formatTimestamp(session.endTime) : '--:--'}
                </Typography>
              </View>
            </View>

            {/* Note Section */}
            <TouchableWithoutFeedback onPress={() => setIsEditingNote(true)}>
              <View style={styles.noteContainer}>
                {isEditingNote ? (
                  <TextInput
                    style={styles.noteInput}
                    value={noteText}
                    onChangeText={setNoteText}
                    onBlur={handleNoteSubmit}
                    autoFocus
                    placeholder={t('home.add_note')}
                    maxLength={140}
                  />
                ) : (
                  <Typography
                    variant="footnote"
                    color={session.note ? theme.colors.gray600 : theme.colors.gray400}
                    numberOfLines={2}
                  >
                    {session.note || t('home.add_note')}
                  </Typography>
                )}
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Card>
      </Animated.View>
    </View>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    outerContainer: {
      marginBottom: Spacing.sm,
      position: 'relative',
    },
    cardWrapper: {
      flex: 1,
    },
    card: {
      padding: 0,
      overflow: 'hidden',
    },
    content: {
      padding: Spacing.md,
    },
    mainInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Spacing.sm,
    },
    timeInfo: {
      gap: 2,
    },
    employerInfo: {
      alignItems: 'flex-end',
      gap: 4,
    },
    employerBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: BorderRadius.full,
      gap: 4,
    },
    colorDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    noteContainer: {
      marginTop: Spacing.xs,
      paddingTop: Spacing.xs,
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray100,
      minHeight: 24,
    },
    noteInput: {
      fontSize: 13,
      color: theme.colors.gray900,
      padding: 0,
      fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
    },
    deleteAction: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: DELETE_WIDTH,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteButton: {
      backgroundColor: theme.colors.danger,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: BorderRadius.sm,
    },
  });
}
