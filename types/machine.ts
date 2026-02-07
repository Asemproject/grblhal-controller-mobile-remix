export type MachineState = 'Idle' | 'Run' | 'Hold' | 'Jog' | 'Alarm' | 'Check' | 'Door' | 'Sleep' | 'Disconnected' | 'Connecting';

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface MachineStatus {
  state: MachineState;
  mpos: Position;
  wpos: Position;
  feedRate: number;
  spindleSpeed: number;
  overrides: {
    feed: number;
    rapid: number;
    spindle: number;
  };
  pins?: string;
  accessory?: string;
  line?: number;
}

export interface ConnectionConfig {
  ip: string;
  port: number;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'in' | 'out' | 'info' | 'error';
  message: string;
}
