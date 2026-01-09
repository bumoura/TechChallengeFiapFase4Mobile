import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { COLORS } from '@/theme/colors';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
