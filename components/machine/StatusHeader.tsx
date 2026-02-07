import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/constants/design';
import { MachineStatus } from '@/types/machine';

interface Props {
  status: MachineStatus;
}

export const StatusHeader = ({ status }: Props) => {
  const getStateColor = (state: string) => {
    switch (state) {
      case 'Idle': return colors.primary;
      case 'Run': return colors.success;
      case 'Alarm': return colors.error;
      case 'Hold': return colors.warning;
      case 'Home': return colors.accent;
      default: return colors.textTertiary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainRow}>
        <View style={styles.stateContainer}>
          <View style={[styles.indicator, { backgroundColor: getStateColor(status.state) }]}>
            {status.state === 'Run' && <View style={styles.pulse} />}
          </View>
          <Text style={[styles.stateText, { color: getStateColor(status.state) }]}>
            {status.state.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.connectionBadge}>
          <Text style={styles.badgeText}>GRBLHAL</Text>
        </View>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>FEED RATE</Text>
          <View style={styles.valRow}>
            <Text style={styles.statValue}>{status.feedRate}</Text>
            <Text style={styles.statUnit}>mm/min</Text>
          </View>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>SPINDLE</Text>
          <View style={styles.valRow}>
            <Text style={styles.statValue}>{status.spindleSpeed}</Text>
            <Text style={styles.statUnit}>RPM</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulse: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.5)',
    position: 'absolute',
  },
  stateText: {
    ...typography.h2,
    fontWeight: '900',
    letterSpacing: 2,
  },
  connectionBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeText: {
    ...typography.tinyBold,
    color: colors.textSecondary,
    fontSize: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    ...typography.tinyBold,
    color: colors.textTertiary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  valRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
    fontFamily: 'SpaceMono_400Regular',
  },
  statUnit: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});