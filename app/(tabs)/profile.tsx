import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>{user ? user.name : 'Visitante'}</Text>
      <Text>Role: {user?.role ?? '---'}</Text>
      <TouchableOpacity onPress={async () => { await logout(); router.replace('/auth/login'); }} style={{ backgroundColor: '#e33', padding: 12, borderRadius: 10 }}>
        <Text style={{ color: 'white' }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
