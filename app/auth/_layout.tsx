import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}