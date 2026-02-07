import { Redirect } from 'expo-router';
import { useMachineStore } from '@/store/useMachineStore';
import { ConnectionForm } from '@/components/machine/ConnectionForm';

export default function Home() {
  const isConnected = useMachineStore((state) => state.isConnected);

  if (isConnected) {
    return <Redirect href="/(tabs)" />;
  }

  return <ConnectionForm />;
} 