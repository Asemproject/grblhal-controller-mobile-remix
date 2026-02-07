import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '@/constants/design';
import { MaterialIcons } from '@expo/vector-icons';
import { useMachineStore } from '@/store/useMachineStore';

const STEP_SIZES = [0.1, 1, 10, 50, 100];

export const JogControls = () => {
  const [stepSize, setStepSize] = useState(1);
  const sendCommand = useMachineStore((state) => state.sendCommand);

  const jog = (axis: string, direction: number) => {
    // Standard GRBL jogging command
    const cmd = `$J=G91 ${axis}${direction * stepSize} F1000`;
    sendCommand(cmd);
  };

  const zeroAxis = (axis: string) => {
    sendCommand(`G10 L20 P1 ${axis}0`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Jog Control</Text>
        <View style={styles.stepContainer}>
          {STEP_SIZES.map((size) => (
            <TouchableOpacity
              key={size}
              onPress={() => setStepSize(size)}
              style={[
                styles.stepButton,
                stepSize === size && styles.stepButtonActive,
              ]}
            >
              <Text style={[
                styles.stepText,
                stepSize === size && styles.stepTextActive,
              ]}>
                {size >= 1 ? size : size.toFixed(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.padContainer}>
        {/* XY Pad */}
        <View style={styles.xyPad}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.zeroBtn} onPress={() => zeroAxis('Y')}>
              <Text style={styles.zeroBtnText}>Y0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.jogBtn} onPress={() => jog('Y', 1)}>
              <MaterialIcons name="arrow-upward" size={28} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.empty} />
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.jogBtn} onPress={() => jog('X', -1)}>
              <MaterialIcons name="arrow-back" size={28} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeBtn} onPress={() => sendCommand('$H')}>
              <MaterialIcons name="home" size={24} color={colors.accent} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.jogBtn} onPress={() => jog('X', 1)}>
              <MaterialIcons name="arrow-forward" size={28} color={colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.zeroBtn} onPress={() => zeroAxis('X')}>
              <Text style={styles.zeroBtnText}>X0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.jogBtn} onPress={() => jog('Y', -1)}>
              <MaterialIcons name="arrow-downward" size={28} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.zeroBtn} onPress={() => zeroAxis('Z')}>
              <Text style={styles.zeroBtnText}>Z0</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Z Pad */}
        <View style={styles.zPad}>
          <TouchableOpacity style={[styles.jogBtn, styles.zBtn]} onPress={() => jog('Z', 1)}>
            <MaterialIcons name="keyboard-double-arrow-up" size={28} color={colors.white} />
            <Text style={styles.zLabel}>Z+</Text>
          </TouchableOpacity>
          <View style={styles.zSpacer} />
          <TouchableOpacity style={[styles.jogBtn, styles.zBtn]} onPress={() => jog('Z', -1)}>
            <MaterialIcons name="keyboard-double-arrow-down" size={28} color={colors.white} />
            <Text style={styles.zLabel}>Z-</Text>
          </TouchableOpacity>
        </View>
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
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.captionBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stepContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 12,
    padding: 4,
  },
  stepButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  stepButtonActive: {
    backgroundColor: colors.primary,
  },
  stepText: {
    ...typography.smallBold,
    color: colors.textTertiary,
  },
  stepTextActive: {
    color: colors.white,
  },
  padContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  xyPad: {
    alignItems: 'center',
  },
  zPad: {
    justifyContent: 'center',
    paddingLeft: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jogBtn: {
    width: 64,
    height: 64,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  zBtn: {
    height: 80,
    width: 64,
  },
  homeBtn: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    margin: 6,
  },
  zeroBtn: {
    width: 64,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    margin: 6,
  },
  zeroBtnText: {
    ...typography.tinyBold,
    color: colors.textSecondary,
  },
  empty: {
    width: 64,
    margin: 6,
  },
  zLabel: {
    ...typography.tinyBold,
    color: colors.textTertiary,
    marginTop: 2,
  },
  zSpacer: {
    height: 12,
  },
});
