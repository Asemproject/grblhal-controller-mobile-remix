import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Svg, { Path, Circle, G, Line, Rect } from 'react-native-svg';
import { colors, spacing, typography } from '@/constants/design';
import { Position } from '@/types/machine';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
  gcode: string;
  currentPos: Position;
  isStreaming?: boolean;
}

export const GCodeVisualizer = ({ gcode, currentPos, isStreaming }: Props) => {
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const lines = useMemo(() => {
    const parsed: { x: number; y: number; z: number; cmd: string }[] = [];
    let curX = 0;
    let curY = 0;
    let curZ = 0;

    const gcodeLines = gcode.split('\n');
    gcodeLines.forEach((line) => {
      const xMatch = line.match(/X(-?\d+(\.\d+)?)/i);
      const yMatch = line.match(/Y(-?\d+(\.\d+)?)/i);
      const zMatch = line.match(/Z(-?\d+(\.\d+)?)/i);
      const cmdMatch = line.match(/G([0123])/i);

      if (xMatch) curX = parseFloat(xMatch[1]);
      if (yMatch) curY = parseFloat(yMatch[1]);
      if (zMatch) curZ = parseFloat(zMatch[1]);

      if (xMatch || yMatch || zMatch) {
        parsed.push({ 
          x: curX, 
          y: curY, 
          z: curZ,
          cmd: cmdMatch ? cmdMatch[0] : 'G1' 
        });
      }
    });

    return parsed;
  }, [gcode]);

  const { width } = Dimensions.get('window');
  const size = width - 40;
  const padding = 20;

  const bounds = useMemo(() => {
    if (lines.length === 0) return { minX: 0, maxX: 100, minY: 0, maxY: 100 };
    let minX = Math.min(...lines.map(l => l.x), currentPos.x);
    let maxX = Math.max(...lines.map(l => l.x), currentPos.x);
    let minY = Math.min(...lines.map(l => l.y), currentPos.y);
    let maxY = Math.max(...lines.map(l => l.y), currentPos.y);
    
    const dx = maxX - minX || 10;
    const dy = maxY - minY || 10;
    minX -= dx * 0.1;
    maxX += dx * 0.1;
    minY -= dy * 0.1;
    maxY += dy * 0.1;

    return { minX, maxX, minY, maxY };
  }, [lines, currentPos]);

  const scaleX = (x: number) => {
    const norm = (x - bounds.minX) / (bounds.maxX - bounds.minX);
    return norm * (size - padding * 2) + padding;
  };

  const scaleY = (y: number) => {
    const norm = (y - bounds.minY) / (bounds.maxY - bounds.minY);
    return size - (norm * (size - padding * 2) + padding);
  };

  const { pathData, cutPathData } = useMemo(() => {
    if (lines.length === 0) return { pathData: '', cutPathData: '' };
    
    let path = '';
    let cutPath = '';
    let reachedCurrent = false;

    lines.forEach((point, i) => {
      const sx = scaleX(point.x);
      const sy = scaleY(point.y);
      const cmd = i === 0 ? 'M' : 'L';
      
      const segment = `${cmd} ${sx} ${sy}`;
      path += ` ${segment}`;

      // Live cut view logic: highlight path near current position
      // For simplicity, we just check if we are in streaming mode
      if (isStreaming && !reachedCurrent) {
        cutPath += ` ${segment}`;
        // If the point is close to current position, we stop "cutting" in visualizer
        const dist = Math.sqrt(Math.pow(point.x - currentPos.x, 2) + Math.pow(point.y - currentPos.y, 2));
        if (dist < 1) reachedCurrent = true;
      }
    });

    return { pathData: path, cutPathData: cutPath };
  }, [lines, currentPos, isStreaming, bounds]);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.5, 5));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.5, 1));
  const handleReset = () => {
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Cut View</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={handleZoomOut} style={styles.iconBtn}>
            <MaterialIcons name="zoom-out" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleZoomIn} style={styles.iconBtn}>
            <MaterialIcons name="zoom-in" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReset} style={styles.iconBtn}>
            <MaterialIcons name="refresh" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={styles.svg}>
        <G transform={`scale(${zoom}) translate(${offsetX}, ${offsetY})`}>
          {/* Grid lines */}
          {[...Array(11)].map((_, i) => (
            <React.Fragment key={i}>
              <Line
                x1={padding + (i * (size - padding * 2)) / 10}
                y1={padding}
                x2={padding + (i * (size - padding * 2)) / 10}
                y2={size - padding}
                stroke={colors.border}
                strokeWidth="0.5"
                opacity={0.3}
              />
              <Line
                x1={padding}
                y1={padding + (i * (size - padding * 2)) / 10}
                x2={size - padding}
                y2={padding + (i * (size - padding * 2)) / 10}
                stroke={colors.border}
                strokeWidth="0.5"
                opacity={0.3}
              />
            </React.Fragment>
          ))}

          {/* Planned Path */}
          <Path
            d={pathData}
            stroke={colors.primary}
            strokeWidth="1.5"
            fill="none"
            opacity={0.3}
          />

          {/* Cut Path (Live Progress) */}
          {isStreaming && (
            <Path
              d={cutPathData}
              stroke={colors.accent}
              strokeWidth="2"
              fill="none"
            />
          )}

          {/* Current Position Marker (Tool Head) */}
          <G transform={`translate(${scaleX(currentPos.x)}, ${scaleY(currentPos.y)})`}>
            <Circle r="6" fill={colors.accent} opacity={0.3} />
            <Circle r="3" fill={colors.accent} />
            {/* Crosshair */}
            <Line x1="-10" y1="0" x2="10" y2="0" stroke={colors.accent} strokeWidth="1" />
            <Line x1="0" y1="-10" x2="0" y2="10" stroke={colors.accent} strokeWidth="1" />
          </G>
        </G>
      </Svg>
      
      <View style={styles.footer}>
        <Text style={styles.posText}>X: {currentPos.x.toFixed(3)}</Text>
        <Text style={styles.posText}>Y: {currentPos.y.toFixed(3)}</Text>
        <Text style={styles.posText}>Z: {currentPos.z.toFixed(3)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'center',
    marginVertical: spacing.md,
    overflow: 'hidden',
    width: Dimensions.get('window').width - 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  title: {
    ...typography.tinyBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  controls: {
    flexDirection: 'row',
  },
  iconBtn: {
    padding: 6,
    marginLeft: spacing.xs,
  },
  svg: {
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  posText: {
    ...typography.tiny,
    color: colors.accent,
    fontFamily: 'SpaceMono_400Regular',
  },
});
