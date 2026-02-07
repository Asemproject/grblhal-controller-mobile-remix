import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Container, Button, Card } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/design';
import { useMachineStore } from '@/store/useMachineStore';
import { GCodeVisualizer } from '@/components/machine/GCodeVisualizer';
import { JogControls } from '@/components/machine/JogControls';
import { MaterialIcons } from '@expo/vector-icons';

const SAMPLE_GCODE = `G1 X10 Y10
G1 X50 Y10
G1 X50 Y50
G1 X10 Y50
G1 X10 Y10`;

export default function JogScreen() {
  const { status } = useMachineStore();
  const [showVisualizer, setShowVisualizer] = useState(true);

  return (
    <Container safeArea edges={['bottom']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Visual Path & Manual Control</Text>
          <Button 
            variant="ghost" 
            onPress={() => setShowVisualizer(!showVisualizer)}
            leftIcon={<MaterialIcons name={showVisualizer ? "visibility-off" : "visibility"} size={20} color={colors.primary} />}
          >
            {showVisualizer ? 'Hide Visualizer' : 'Show Visualizer'}
          </Button>
        </View>

        {showVisualizer && (
          <GCodeVisualizer gcode={SAMPLE_GCODE} currentPos={status.wpos} />
        )}

        <View style={styles.spacer} />
        <JogControls />

        <View style={styles.infoRow}>
          <Card variant="outline" style={styles.infoCard}>
            <Text style={styles.infoLabel}>X</Text>
            <Text style={styles.infoValue}>{status.wpos.x.toFixed(3)}</Text>
          </Card>
          <Card variant="outline" style={styles.infoCard}>
            <Text style={styles.infoLabel}>Y</Text>
            <Text style={styles.infoValue}>{status.wpos.y.toFixed(3)}</Text>
          </Card>
          <Card variant="outline" style={styles.infoCard}>
            <Text style={styles.infoLabel}>Z</Text>
            <Text style={styles.infoValue}>{status.wpos.z.toFixed(3)}</Text>
          </Card>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.captionBold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
  },
  spacer: {
    height: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  infoCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: spacing.sm,
    alignItems: 'center',
  },
  infoLabel: {
    ...typography.tiny,
    color: colors.textTertiary,
  },
  infoValue: {
    ...typography.bodyBold,
    color: colors.primary,
    fontFamily: 'SpaceMono_400Regular',
  },
});
