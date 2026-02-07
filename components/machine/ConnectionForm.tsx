import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button, Input, Card, Container } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/design';
import { useMachineStore } from '@/store/useMachineStore';
import { MaterialIcons } from '@expo/vector-icons';

export const ConnectionForm = () => {
  const [ip, setIp] = useState('192.168.1.100');
  const [port, setPort] = useState('23');
  const { connect, isConnecting } = useMachineStore();

  const handleConnect = async () => {
    if (!ip || !port) return;
    await connect({ ip, port: parseInt(port, 10) });
  };

  return (
    <Container safeArea padding="lg">
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <MaterialIcons name="settings-input-component" size={64} color={colors.primary} />
          <Text style={styles.title}>CNC Controller</Text>
          <Text style={styles.subtitle}>Connect to your GRBLHAL or FluidNC device</Text>
        </View>

        <Card variant="elevated" style={styles.card}>
          <Card.Header>
            <Text style={styles.cardTitle}>Network Connection</Text>
          </Card.Header>
          <Card.Content style={styles.content}>
            <Input
              label="IP Address"
              placeholder="e.g. 192.168.1.100"
              value={ip}
              onChangeText={setIp}
              keyboardType="numeric"
              leftIcon={<MaterialIcons name="router" size={20} color={colors.textSecondary} />}
            />
            <View style={styles.spacer} />
            <Input
              label="Port"
              placeholder="e.g. 23 (Telnet)"
              value={port}
              onChangeText={setPort}
              keyboardType="numeric"
              leftIcon={<MaterialIcons name="cable" size={20} color={colors.textSecondary} />}
            />
          </Card.Content>
          <Card.Footer>
            <Button
              variant="primary"
              onPress={handleConnect}
              loading={isConnecting}
              style={styles.button}
              fullWidth
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          </Card.Footer>
        </Card>

        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Ensure your mobile device is on the same WiFi network as your controller.
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginTop: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
  },
  content: {
    paddingTop: spacing.md,
  },
  spacer: {
    height: spacing.md,
  },
  button: {
    marginTop: spacing.sm,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.xl,
    maxWidth: 400,
    alignSelf: 'center',
    alignItems: 'center',
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
});
