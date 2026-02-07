import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors, iconSize } from '@/constants/design';
import { useMachineStore } from '@/store/useMachineStore';

export default function TabLayout() {
  const isConnected = useMachineStore((state) => state.isConnected);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.backgroundSecondary,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: colors.backgroundSecondary,
        },
        headerTitleStyle: {
          color: colors.text,
        },
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="jog"
        options={{
          title: 'Jog',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="open-with" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="image-convert"
        options={{
          title: 'Convert',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="image" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="console"
        options={{
          title: 'Console',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="terminal" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
