import { create } from 'zustand';
import { MachineStatus, ConnectionConfig, LogEntry, MachineState } from '../types/machine';

interface MachineStore {
  // Connection State
  isConnected: boolean;
  isConnecting: boolean;
  config: ConnectionConfig | null;
  
  // Machine State
  status: MachineStatus;
  logs: LogEntry[];
  
  // Actions
  connect: (config: ConnectionConfig) => Promise<void>;
  disconnect: () => void;
  updateStatus: (status: Partial<MachineStatus>) => void;
  addLog: (type: LogEntry['type'], message: string) => void;
  sendCommand: (command: string) => void;
}

const initialStatus: MachineStatus = {
  state: 'Disconnected',
  mpos: { x: 0, y: 0, z: 0 },
  wpos: { x: 0, y: 0, z: 0 },
  feedRate: 0,
  spindleSpeed: 0,
  overrides: { feed: 100, rapid: 100, spindle: 100 },
};

export const useMachineStore = create<MachineStore>((set, get) => ({
  isConnected: false,
  isConnecting: false,
  config: null,
  status: initialStatus,
  logs: [],

  connect: async (config) => {
    set({ isConnecting: true, config });
    get().addLog('info', `Connecting to ${config.ip}:${config.port}...`);
    
    // Simulate connection for preview
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    set({ 
      isConnected: true, 
      isConnecting: false, 
      status: { ...initialStatus, state: 'Idle' } 
    });
    get().addLog('info', 'Connected to GRBLHAL controller');
    get().addLog('in', 'GrblHAL 1.1f [\'$\' for help]');
  },

  disconnect: () => {
    set({ 
      isConnected: false, 
      isConnecting: false, 
      status: initialStatus 
    });
    get().addLog('info', 'Disconnected from controller');
  },

  updateStatus: (status) => set((state) => ({
    status: { ...state.status, ...status }
  })),

  addLog: (type, message) => set((state) => ({
    logs: [
      {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date(),
        type,
        message,
      },
      ...state.logs.slice(0, 99), // Keep last 100 logs
    ]
  })),

  sendCommand: (command) => {
    const { isConnected, addLog } = get();
    if (!isConnected) return;
    
    addLog('out', command);
    
    // Simple mock response for common commands
    if (command === '?') {
      // Handled by background status updates in a real app
    } else if (command.startsWith('$')) {
      addLog('in', 'ok');
    } else if (command.toUpperCase().startsWith('G')) {
      addLog('in', 'ok');
      // Mock move simulation
      if (command.toUpperCase().includes('X') || command.toUpperCase().includes('Y') || command.toUpperCase().includes('Z')) {
        const parts = command.toUpperCase().match(/[XYZ]-?\d+(\.\d+)?/g);
        if (parts) {
          const newWpos = { ...get().status.wpos };
          parts.forEach(p => {
            const axis = p[0].toLowerCase() as keyof typeof newWpos;
            const val = parseFloat(p.substring(1));
            newWpos[axis] = val;
          });
          set((state) => ({ 
            status: { ...state.status, wpos: newWpos, mpos: newWpos, state: 'Run' } 
          }));
          setTimeout(() => {
            set((state) => ({ status: { ...state.status, state: 'Idle' } }));
          }, 500);
        }
      }
    }
  },
}));
