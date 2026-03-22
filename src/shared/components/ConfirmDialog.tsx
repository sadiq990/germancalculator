// ══════════════════════════════════════════════════
// FILE: src/shared/components/ConfirmDialog.tsx
// PURPOSE: Modal confirmation dialog — used for destructive actions
// ══════════════════════════════════════════════════

import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from './Typography';
import { Spacing, BorderRadius } from '@theme/spacing';
import type { Theme } from '@theme/index';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmLabel = 'Bestätigen',
  cancelLabel = 'Abbrechen',
  onConfirm,
  onCancel,
  destructive = false,
}) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      accessibilityViewIsModal
    >
      <TouchableWithoutFeedback onPress={onCancel} accessibilityRole="button">
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <View style={styles.content}>
                <Typography variant="title3" style={styles.title}>
                  {title}
                </Typography>
                <Typography
                  variant="body"
                  color={theme.colors.gray600}
                  style={styles.message}
                >
                  {message}
                </Typography>
              </View>
              <View style={styles.divider} />
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={onCancel}
                  style={[styles.action, styles.cancelAction]}
                  accessibilityRole="button"
                  accessibilityLabel={cancelLabel}
                >
                  <Typography variant="headline" color={theme.colors.primary}>
                    {cancelLabel}
                  </Typography>
                </TouchableOpacity>
                <View style={styles.actionDivider} />
                <TouchableOpacity
                  onPress={onConfirm}
                  style={[styles.action, styles.confirmAction]}
                  accessibilityRole="button"
                  accessibilityLabel={confirmLabel}
                >
                  <Typography
                    variant="headline"
                    color={destructive ? theme.colors.danger : theme.colors.primary}
                    style={destructive ? styles.destructiveLabel : {}}
                  >
                    {confirmLabel}
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.xl,
    },
    dialog: {
      backgroundColor: theme.colors.gray100,
      borderRadius: BorderRadius.md,
      width: '100%',
      maxWidth: 320,
      overflow: 'hidden',
    },
    content: {
      padding: Spacing.lg,
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    message: {
      textAlign: 'center',
      lineHeight: 22,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.gray200,
    },
    actions: {
      flexDirection: 'row',
    },
    action: {
      flex: 1,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    },
    cancelAction: {},
    confirmAction: {},
    actionDivider: {
      width: 1,
      backgroundColor: theme.colors.gray200,
    },
    destructiveLabel: {
      fontWeight: '700',
    },
  });
}
