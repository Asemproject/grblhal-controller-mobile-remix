import React from 'react';
import { ScrollView, StyleSheet, View, Text, Switch } from 'react-native';
import { Container, Card, Button } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/design';
import { useMachineStore } from '@/store/useMachineStore';
import { MaterialIcons } from '@expo/vector-icons';

export default function Settings() {
  const { config, disconnect } = useMachineStore();

  return (
    <Container safeArea edges={['bottom']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Machine Configuration</Text>
        <Card variant="elevated" style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <MaterialIcons name="router" size={24} color={colors.primary} />
            </View>
            <View style={styles.info}>
              <Text style={styles.label}>Controller IP</Text>
              <Text style={styles.value}>{config?.ip || 'Not set'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <MaterialIcons name="cable" size={24} color={colors.primary} />
            </View>
            <View style={styles.info}>
              <Text style={styles.label}>Port</Text>
              <Text style={styles.value}>{config?.port || 'Not set'}</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>App Settings</Text>
        <Card variant="elevated" style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.settingLabel}>Keep Screen Awake</Text>
            <Switch value={true} trackColor={{ true: colors.primary }} />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.settingLabel}>Auto-Reconnect</Text>
            <Switch value={false} trackColor={{ true: colors.primary }} />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.settingLabel}>Haptic Feedback</Text>
            <Switch value={true} trackColor={{ true: colors.primary }} />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>System</Text>
        <Card variant="elevated" style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.settingLabel}>Firmware Version</Text>
            <Text style={styles.value}>grblHAL 1.1f</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.settingLabel}>Build Date</Text>
            <Text style={styles.value}>2024-05-15</Text>
          </View>
        </Card>

        <Button 
          variant="outline" 
          onPress={disconnect}
          style={styles.logoutBtn}
          leftIcon={<MaterialIcons name="exit-to-app" size={20} color={colors.error} />}
        >
          <Text style={{ color: colors.error }}>DISCONNECT MACHINE</Text>
        </Button>

        <Text style={styles.footer}>CNC Controller v1.0.0</Text>
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
  sectionTitle: {
    ...typography.captionBold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  label: {
    ...typography.tiny,
    color: colors.textTertiary,
  },
  value: {
    ...typography.bodyBold,
    color: colors.text,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md,
  },
  logoutBtn: {
    marginTop: spacing.xxl,
    borderColor: colors.error,
  },
  footer: {
    ...typography.tiny,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
  },
});
