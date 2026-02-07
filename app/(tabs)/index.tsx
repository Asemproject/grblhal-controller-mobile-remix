import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Container } from '@/components/ui';
import { colors, spacing } from '@/constants/design';
import { useMachineStore } from '@/store/useMachineStore';
import { StatusHeader } from '@/components/machine/StatusHeader';
import { AxisReadout } from '@/components/machine/AxisReadout';
import { JogControls } from '@/components/machine/JogControls';
import { MacroButtons } from '@/components/machine/MacroButtons';
import { FileStreamer } from '@/components/machine/FileStreamer';
import { GCodeVisualizer } from '@/components/machine/GCodeVisualizer';
import { Button } from '@/components/ui';
import { MaterialIcons } from '@expo/vector-icons';

export default function Dashboard() {
  const { status, sendCommand, disconnect } = useMachineStore();

  return (
    <Container safeArea edges={['bottom']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <StatusHeader status={status} />
        
        <GCodeVisualizer 
          gcode={status.state === 'Run' ? '(Active Cut Path...)' : ''} 
          currentPos={status.wpos}
          isStreaming={status.state === 'Run'}
        />

        <View style={styles.readouts}>
          <AxisReadout positions={status.wpos} type="Work" />
          <View style={styles.spacer} />
          <AxisReadout positions={status.mpos} type="Machine" />
        </View>

        <View style={styles.actions}>
          <Button 
            variant="outline" 
            onPress={() => sendCommand('$H')}
            style={styles.actionBtn}
            leftIcon={<MaterialIcons name="home" size={18} color={colors.text} />}
          >
            HOME
          </Button>
          <Button 
            variant="outline" 
            onPress={() => sendCommand('$X')}
            style={styles.actionBtn}
            leftIcon={<MaterialIcons name="lock-open" size={18} color={colors.text} />}
          >
            UNLOCK
          </Button>
          <Button 
            variant="danger" 
            onPress={() => sendCommand('!')}
            style={styles.actionBtn}
            leftIcon={<MaterialIcons name="stop" size={18} color={colors.white} />}
          >
            STOP
          </Button>
        </View>

        <MacroButtons />

        <FileStreamer />

        <JogControls />

        <View style={styles.bottomActions}>
          <Button 
            variant="ghost" 
            onPress={disconnect}
            leftIcon={<MaterialIcons name="link-off" size={20} color={colors.error} />}
          >
            Disconnect
          </Button>
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
  readouts: {
    marginBottom: spacing.lg,
  },
  spacer: {
    height: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
    height: 48,
  },
  bottomActions: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
});
