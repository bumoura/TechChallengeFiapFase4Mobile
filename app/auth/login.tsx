import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('prof@fiap.com');
  const [password, setPassword] = useState('prof123');
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async () => {
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data?.message ?? 'Falha no login');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Login</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none"
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }} />
      <TextInput value={password} onChangeText={setPassword} placeholder="Senha" secureTextEntry
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }} />
      <TouchableOpacity onPress={onSubmit} style={{ backgroundColor: '#0a7', padding: 14, borderRadius: 12 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
