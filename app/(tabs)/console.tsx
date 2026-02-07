import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Container, Button } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/design';
import { useMachineStore } from '@/store/useMachineStore';
import { LogEntry } from '@/types/machine';
import { format } from 'date-fns';

export default function Console() {
  const [command, setCommand] = useState('');
  const { logs, sendCommand } = useMachineStore();
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!command.trim()) return;
    sendCommand(command);
    setCommand('');
  };

  const renderLog = ({ item }: { item: LogEntry }) => {
    const getColor = () => {
      switch (item.type) {
        case 'in': return colors.primary;
        case 'out': return colors.info;
        case 'error': return colors.error;
        default: return colors.textTertiary;
      }
    };

    return (
      <View style={styles.logLine}>
        <Text style={styles.timestamp}>{format(item.timestamp, 'HH:mm:ss')}</Text>
        <Text style={[styles.prefix, { color: getColor() }]}>
          {item.type === 'in' ? '<' : item.type === 'out' ? '>' : '*'}
        </Text>
        <Text style={[styles.message, { color: item.type === 'error' ? colors.error : colors.text }]}>
          {item.message}
        </Text>
      </View>
    );
  };

  return (
    <Container safeArea edges={['bottom']} style={styles.container}>
      <View style={styles.terminal}>
        <FlatList
          ref={flatListRef}
          data={logs}
          renderItem={renderLog}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.logList}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type G-Code or Command..."
            placeholderTextColor={colors.textTertiary}
            value={command}
            onChangeText={setCommand}
            autoCapitalize="characters"
            onSubmitEditing={handleSend}
          />
          <Button 
            variant="primary" 
            onPress={handleSend}
            style={styles.sendBtn}
          >
            SEND
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  terminal: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    margin: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  logList: {
    padding: spacing.sm,
  },
  logLine: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timestamp: {
    ...typography.tiny,
    color: colors.textTertiary,
    fontFamily: 'SpaceMono_400Regular',
    width: 60,
  },
  prefix: {
    ...typography.smallBold,
    fontFamily: 'SpaceMono_400Regular',
    width: 15,
    textAlign: 'center',
  },
  message: {
    ...typography.small,
    fontFamily: 'SpaceMono_400Regular',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontFamily: 'SpaceMono_400Regular',
    height: 48,
  },
  sendBtn: {
    marginLeft: spacing.sm,
    height: 48,
    width: 80,
  },
});
