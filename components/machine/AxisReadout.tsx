import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/constants/design';
import { Position } from '@/types/machine';

interface AxisReadoutProps {
  label: string;
  value: number;
  unit?: string;
  color?: string;
}

const ReadoutItem = ({ label, value, unit = 'mm', color = colors.primary }: AxisReadoutProps) => (
  <View style={styles.item}>
    <View style={styles.labelContainer}>
      <Text style={styles.label}>{label}</Text>
    </View>
    <View style={styles.valueContainer}>
      <Text style={[styles.value, { color }]}>{value.toFixed(3)}</Text>
      <Text style={styles.unit}>{unit}</Text>
    </View>
  </View>
);

interface Props {
  positions: Position;
  type: 'Work' | 'Machine';
}

export const AxisReadout = ({ positions, type }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.typeLabel}>{type} Position</Text>
        <View style={styles.divider} />
      </View>
      <View style={styles.itemsContainer}>
        <ReadoutItem label="X" value={positions.x} color={colors.primary} />
        <ReadoutItem label="Y" value={positions.y} color={colors.primary} />
        <ReadoutItem label="Z" value={positions.z} color={colors.accent} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  typeLabel: {
    ...typography.tinyBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginRight: spacing.sm,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  itemsContainer: {
    gap: spacing.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: spacing.xs,
    borderRadius: 8,
  },
  labelContainer: {
    width: 32,
    height: 32,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  valueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    marginLeft: spacing.md,
  },
  value: {
    fontSize: 32,
    fontFamily: 'SpaceMono_400Regular',
    fontWeight: '700',
    textAlign: 'right',
  },
  unit: {
    ...typography.tiny,
    color: colors.textTertiary,
    marginLeft: 6,
    width: 24,
  },
});