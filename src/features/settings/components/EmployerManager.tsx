// ══════════════════════════════════════════════════
// FILE: src/features/settings/components/EmployerManager.tsx
// PURPOSE: Add/edit/delete employers with color picker (Pro feature)
// ══════════════════════════════════════════════════

import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { Button } from '@shared/components/Button';
import { Card } from '@shared/components/Card';
import { Spacing, BorderRadius } from '@theme/spacing';
import { EMPLOYER_COLORS } from '@theme/colors';
import type { Employer } from '@core/types/models';
import type { Theme } from '@theme/index';

interface EmployerManagerProps {
  employers: Employer[];
  isPro: boolean;
  onAdd: (employer: Omit<Employer, 'id' | 'createdAt'>) => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export const EmployerManager: React.FC<EmployerManagerProps> = ({
  employers,
  isPro,
  onAdd,
  onSetDefault,
  onDelete,
}) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(EMPLOYER_COLORS[0] ?? '#1558C9');
  const [newRate, setNewRate] = useState('');

  const handleAdd = useCallback(() => {
    if (newName.trim().length === 0) return;
    onAdd({
      name: newName.trim(),
      color: newColor,
      hourlyRate: newRate.trim().length > 0 ? parseFloat(newRate.replace(',', '.')) : null,
      isDefault: employers.length === 0,
    });
    setIsAdding(false);
    setNewName('');
    setNewRate('');
  }, [newName, newColor, newRate, employers.length, onAdd]);

  const handleDeleteConfirm = useCallback(
    (employer: Employer) => {
      if (employer.isDefault) return;
      Alert.alert(
        `"${employer.name}" löschen?`,
        'Dieser Arbeitgeber wird gelöscht.',
        [
          { text: 'Abbrechen', style: 'cancel' },
          { text: 'Löschen', style: 'destructive', onPress: () => onDelete(employer.id) },
        ],
      );
    },
    [onDelete],
  );

  return (
    <View>
      {employers.map((emp) => (
        <View key={emp.id} style={styles.employerRow}>
          <View style={[styles.dot, { backgroundColor: emp.color }]} />
          <View style={styles.empInfo}>
            <Typography variant="body">{emp.name}</Typography>
            {emp.isDefault && (
              <Typography variant="caption1" color={theme.colors.gray400}>
                Standard
              </Typography>
            )}
          </View>
          {!emp.isDefault && (
            <TouchableOpacity
              onPress={() => onSetDefault(emp.id)}
              style={styles.actionBtn}
              accessibilityLabel="Als Standard setzen"
            >
              <Typography variant="caption1" color={theme.colors.primary}>
                Standard
              </Typography>
            </TouchableOpacity>
          )}
          {!emp.isDefault && (
            <TouchableOpacity
              onPress={() => handleDeleteConfirm(emp)}
              style={styles.actionBtn}
              accessibilityLabel="Arbeitgeber löschen"
            >
              <Typography variant="caption1" color={theme.colors.danger}>
                Löschen
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {!isAdding ? (
        <Button
          label="+ Arbeitgeber hinzufügen"
          onPress={() => setIsAdding(true)}
          variant={isPro ? 'ghost' : 'secondary'}
          fullWidth
          disabled={!isPro && employers.length >= 1}
        />
      ) : (
        <Card>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="Arbeitgebername"
            placeholderTextColor={theme.colors.gray400}
            style={[styles.input, { color: theme.colors.gray800, borderColor: theme.colors.gray200 }]}
            autoFocus
            accessibilityLabel="Name des Arbeitgebers"
          />
          <TextInput
            value={newRate}
            onChangeText={setNewRate}
            placeholder="Stundensatz (optional)"
            placeholderTextColor={theme.colors.gray400}
            style={[styles.input, { color: theme.colors.gray800, borderColor: theme.colors.gray200 }]}
            keyboardType="decimal-pad"
            accessibilityLabel="Stundensatz"
          />
          <View style={styles.colorPicker}>
            {EMPLOYER_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setNewColor(color)}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color },
                  newColor === color && styles.colorSwatchSelected,
                ]}
                accessibilityLabel={`Farbe ${color}`}
              />
            ))}
          </View>
          <View style={styles.addActions}>
            <Button label="Abbrechen" onPress={() => setIsAdding(false)} variant="secondary" />
            <Button label="Hinzufügen" onPress={handleAdd} variant="primary" disabled={newName.trim().length === 0} />
          </View>
        </Card>
      )}
    </View>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    employerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
      gap: Spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray200,
      marginBottom: Spacing.sm,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    empInfo: { flex: 1 },
    actionBtn: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      minHeight: 36,
      justifyContent: 'center',
    },
    input: {
      borderWidth: 1,
      borderRadius: BorderRadius.xs,
      padding: Spacing.sm,
      marginBottom: Spacing.sm,
      fontSize: 15,
    },
    colorPicker: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginBottom: Spacing.md,
    },
    colorSwatch: {
      width: 28,
      height: 28,
      borderRadius: 14,
    },
    colorSwatchSelected: {
      borderWidth: 3,
      borderColor: theme.colors.gray800,
    },
    addActions: {
      flexDirection: 'row',
      gap: Spacing.sm,
      justifyContent: 'flex-end',
    },
  });
}
