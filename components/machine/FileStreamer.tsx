import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Button, Card } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/design';
import { useMachineStore } from '@/store/useMachineStore';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons } from '@expo/vector-icons';

export const FileStreamer = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [progress, setProgress] = useState(0);
  const { sendCommand, isConnected, addLog, updateStatus } = useMachineStore();

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // In real app, filter for .nc, .gcode
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setFileName(result.assets[0].name);
        addLog('info', `Loaded file: ${result.assets[0].name}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startStream = async () => {
    if (!isConnected) {
      Alert.alert('Not Connected', 'Please connect to a machine first.');
      return;
    }
    
    setStreaming(true);
    setProgress(0);
    updateStatus({ state: 'Run' });
    addLog('info', 'Starting G-code stream...');

    // Simulate streaming
    for (let i = 0; i <= 100; i += 10) {
      if (!streaming && i > 0) break; // Allow cancel
      setProgress(i);
      sendCommand(`(Streaming line ${i})`);
      await new Promise(r => setTimeout(r, 500));
    }

    setStreaming(false);
    updateStatus({ state: 'Idle' });
    addLog('info', 'Stream complete');
  };

  return (
    <Card variant="outline" style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="insert-drive-file" size={20} color={colors.primary} />
        <Text style={styles.title}>File Streamer</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.fileName} numberOfLines={1}>
          {fileName || 'No file selected'}
        </Text>
        
        {streaming && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}

        <View style={styles.actions}>
          {!streaming ? (
            <>
              <Button 
                variant="ghost" 
                onPress={pickFile}
                style={styles.btn}
                leftIcon={<MaterialIcons name="file-upload" size={18} color={colors.primary} />}
              >
                PICK FILE
              </Button>
              <Button 
                variant="primary" 
                onPress={startStream}
                disabled={!fileName}
                style={styles.btn}
                leftIcon={<MaterialIcons name="play-arrow" size={18} color={colors.white} />}
              >
                START
              </Button>
            </>
          ) : (
            <Button 
              variant="danger" 
              onPress={() => setStreaming(false)}
              fullWidth
              leftIcon={<MaterialIcons name="stop" size={18} color={colors.white} />}
            >
              CANCEL
            </Button>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  content: {
    alignItems: 'center',
  },
  fileName: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
  },
  progressContainer: {
    width: '100%',
    height: 20,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: spacing.md,
    position: 'relative',
    justifyContent: 'center',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    ...typography.tiny,
    color: colors.text,
    position: 'absolute',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
  },
  btn: {
    flex: 1,
    marginHorizontal: 4,
  },
});
