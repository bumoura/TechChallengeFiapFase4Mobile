import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext'; 

export default function TabsLayout() {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'professor';

  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: -2 },
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        },
        tabBarActiveTintColor: '#2563EB', 
        tabBarInactiveTintColor: '#94A3B8', 
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Feed',
          tabBarIcon: ({ color, size }) => <Ionicons name="newspaper-outline" size={size} color={color} />
        }} 
      />

      <Tabs.Screen 
        name="admin/index" 
        options={{ 
          title: 'Admin',
          href: isAdmin ? undefined : null, 
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />
        }} 
      />

      <Tabs.Screen 
        name="admin/docentes/index" 
        options={{ 
          title: 'Docentes',
          href: isAdmin ? undefined : null, 
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />
        }} 
      />

      <Tabs.Screen 
        name="admin/alunos/index" 
        options={{ 
          title: 'Alunos',
          href: isAdmin ? undefined : null, 
          tabBarIcon: ({ color, size }) => <Ionicons name="school-outline" size={size} color={color} />
        }} 
      />

      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />
        }} 
      />
    </Tabs>
  );
}