import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/design';
import { useMachineStore } from '@/store/useMachineStore';
import { MaterialIcons } from '@expo/vector-icons';

const MACROS = [
  { label: 'PROBE', cmd: 'G38.2 Z-20 F100', icon: 'vertical-align-bottom' },
  { label: 'ZERO XY', cmd: 'G10 L20 P1 X0 Y0', icon: 'gps-fixed' },
  { label: 'ZERO Z', cmd: 'G10 L20 P1 Z0', icon: 'height' },
  { label: 'GO ZERO', cmd: 'G0 X0 Y0 Z5', icon: 'replay' },
  { label: 'PARK', cmd: 'G0 G53 Z-5\nG0 G53 X0 Y0', icon: 'local-parking' },
  { label: 'LASER ON', cmd: 'M3 S1000', icon: 'lightbulb' },
  { label: 'LASER OFF', cmd: 'M5', icon: 'lightbulb-outline' },
];

export const MacroButtons = () => {
  const sendCommand = useMachineStore((state) => state.sendCommand);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Macros</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {MACROS.map((macro) => (
          <Button
            key={macro.label}
            variant="secondary"
            onPress={() => sendCommand(macro.cmd)}
            style={styles.macroBtn}
            leftIcon={<MaterialIcons name={macro.icon as any} size={16} color={colors.text} />}
          >
            {macro.label}
          </Button>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  title: {
    ...typography.captionBold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  scroll: {
    paddingRight: spacing.xl,
  },
  macroBtn: {
    marginRight: spacing.sm,
    height: 40,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
