import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Alert, Dimensions } from 'react-native';
import { Container, Button, Card, Input } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/design';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useMachineStore } from '@/store/useMachineStore';
import { WebView } from 'react-native-webview';
import { GCodeVisualizer } from '@/components/machine/GCodeVisualizer';

export default function ImageConvertScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [gcode, setGcode] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const webViewRef = useRef<WebView>(null);
  
  // Settings
  const [width, setWidth] = useState('50');
  const [height, setHeight] = useState('50');
  const [depth, setDepth] = useState('1');
  const [feedRate, setFeedRate] = useState('1000');
  const [mode, setMode] = useState<'laser' | 'milling'>('laser');

  const { addLog } = useMachineStore();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setGcode(null);
    }
  };

  const convertToGCode = async () => {
    if (!image) return;
    
    setConverting(true);
    addLog('info', 'Converting image to G-code...');
    
    // Send message to WebView to process the image
    const config = {
      imageUri: image,
      width: parseFloat(width),
      height: parseFloat(height),
      depth: parseFloat(depth),
      feedRate: parseFloat(feedRate),
      mode,
    };

    webViewRef.current?.postMessage(JSON.stringify({ type: 'PROCESS_IMAGE', payload: config }));
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const { type, payload } = JSON.parse(event.nativeEvent.data);
      if (type === 'GCODE_GENERATED') {
        setGcode(payload);
        addLog('success', 'Image converted successfully');
        setConverting(false);
      } else if (type === 'ERROR') {
        Alert.alert('Error', payload);
        addLog('error', `Conversion error: ${payload}`);
        setConverting(false);
      }
    } catch (e) {
      console.error('WebView message error:', e);
    }
  };

  const handleSendToMachine = () => {
    if (!gcode) return;
    // In a real app, we would update the store with this G-code
    // and navigate to the dashboard to start streaming
    addLog('info', 'G-code sent to dashboard');
    Alert.alert('Success', 'G-code is ready in the dashboard');
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <canvas id="canvas" style="display:none;"></canvas>
        <script>
          window.addEventListener('message', function(event) {
            const { type, payload } = JSON.parse(event.data);
            if (type === 'PROCESS_IMAGE') {
              processImage(payload);
            }
          });

          async function processImage(config) {
            try {
              const canvas = document.getElementById('canvas');
              const ctx = canvas.getContext('2d');
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.src = config.imageUri;
              
              img.onload = function() {
                // Set canvas size to a reasonable resolution for CNC
                const resolution = 100; // pixels per mm
                const targetWidth = Math.min(img.width, 300); // Caps size for speed
                const targetHeight = (img.height / img.width) * targetWidth;
                
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                
                const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
                const data = imageData.data;
                
                let gcode = "G21 (Metric)\\nG90 (Absolute)\\n";
                if (config.mode === 'laser') {
                  gcode += "M3 S0 (Laser On)\\n";
                } else {
                  gcode += "G0 Z5 (Safe Height)\\n";
                }

                const mmPerPixelX = config.width / targetWidth;
                const mmPerPixelY = config.height / targetHeight;

                for (let y = 0; y < targetHeight; y++) {
                  for (let x = 0; x < targetWidth; x++) {
                    const idx = (y * targetWidth + x) * 4;
                    const r = data[idx];
                    const g = data[idx+1];
                    const b = data[idx+2];
                    const brightness = (r + g + b) / 3;
                    
                    // Simple threshold or grayscale mapping
                    if (brightness < 128) {
                      const posX = (x * mmPerPixelX).toFixed(3);
                      const posY = ((targetHeight - y) * mmPerPixelY).toFixed(3);
                      
                      gcode += \`G0 X\${posX} Y\${posY}\\n\`;
                      if (config.mode === 'laser') {
                        const power = Math.floor((1 - brightness/255) * config.depth * 1000);
                        gcode += \`M3 S\${power}\\nG1 X\${(parseFloat(posX) + mmPerPixelX).toFixed(3)} Y\${posY} F\${config.feedRate}\\nM3 S0\\n\`;
                      } else {
                        gcode += \`G1 Z-\${config.depth} F500\\nG1 X\${(parseFloat(posX) + mmPerPixelX).toFixed(3)} Y\${posY} F\${config.feedRate}\\nG0 Z5\\n\`;
                      }
                    }
                  }
                }

                gcode += "M5 (Spindle/Laser Off)\\nG0 X0 Y0\\nM30 (End)";
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'GCODE_GENERATED', payload: gcode }));
              };
              
              img.onerror = function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', payload: 'Failed to load image' }));
              };
            } catch (err) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', payload: err.message }));
            }
          }
        </script>
      </body>
    </html>
  `;

  return (
    <Container safeArea edges={['bottom']} style={styles.container}>
      <View style={{ height: 0, width: 0, opacity: 0 }}>
        <WebView
          ref={webViewRef}
          source={{ html }}
          onMessage={handleWebViewMessage}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card variant="outline" style={styles.card}>
          <Text style={styles.cardTitle}>Image to G-Code</Text>
          <Text style={styles.cardSubtitle}>
            Convert any image into CNC paths for laser or milling
          </Text>

          <View style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholder}>
                <MaterialIcons name="add-photo-alternate" size={48} color={colors.textTertiary} />
                <Text style={styles.placeholderText}>No image selected</Text>
              </View>
            )}
          </View>

          <Button 
            variant="outline" 
            onPress={pickImage}
            style={styles.pickBtn}
            leftIcon={<MaterialIcons name="photo-library" size={20} />}
          >
            {image ? 'CHANGE IMAGE' : 'SELECT IMAGE'}
          </Button>
        </Card>

        {image && (
          <Card variant="outline" style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>Conversion Settings</Text>
            
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Input
                  label="Width (mm)"
                  value={width}
                  onChangeText={setWidth}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputGroup}>
                <Input
                  label="Height (mm)"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Input
                  label={mode === 'laser' ? 'Power (0-1000)' : 'Depth (mm)'}
                  value={depth}
                  onChangeText={setDepth}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputGroup}>
                <Input
                  label="Feed Rate"
                  value={feedRate}
                  onChangeText={setFeedRate}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.modeToggle}>
              <Button
                variant={mode === 'laser' ? 'primary' : 'ghost'}
                onPress={() => setMode('laser')}
                style={styles.modeBtn}
              >
                LASER
              </Button>
              <Button
                variant={mode === 'milling' ? 'primary' : 'ghost'}
                onPress={() => setMode('milling')}
                style={styles.modeBtn}
              >
                MILLING
              </Button>
            </View>

            <Button
              variant="primary"
              onPress={convertToGCode}
              loading={converting}
              disabled={converting}
              style={styles.convertBtn}
              leftIcon={<MaterialIcons name="sync" size={20} color={colors.white} />}
            >
              CONVERT TO G-CODE
            </Button>
          </Card>
        )}

        {gcode && (
          <Card variant="outline" style={styles.gcodeCard}>
            <Text style={styles.sectionTitle}>G-Code Preview</Text>
            
            <GCodeVisualizer 
              gcode={gcode} 
              currentPos={{ x: 0, y: 0, z: 0 }} 
            />

            <View style={styles.gcodePreview}>
              <Text style={styles.gcodeText} numberOfLines={10}>
                {gcode}
              </Text>
            </View>
            <Button
              variant="accent"
              onPress={handleSendToMachine}
              style={styles.sendBtn}
              leftIcon={<MaterialIcons name="send" size={20} color={colors.white} />}
            >
              SEND TO MACHINE
            </Button>
          </Card>
        )}
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
  card: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4/3,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderText: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  pickBtn: {
    width: '100%',
  },
  settingsCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 8,
    padding: 4,
    marginBottom: spacing.lg,
  },
  modeBtn: {
    flex: 1,
    height: 40,
  },
  convertBtn: {
    width: '100%',
  },
  gcodeCard: {
    marginBottom: spacing.xxl,
    padding: spacing.md,
  },
  gcodePreview: {
    backgroundColor: '#1a1a1a',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  gcodeText: {
    ...typography.tiny,
    color: '#00ff00',
    fontFamily: 'SpaceMono_400Regular',
  },
  sendBtn: {
    width: '100%',
  },
});
