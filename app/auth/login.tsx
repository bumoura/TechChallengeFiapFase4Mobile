import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('prof@fiap.com');
  const [password, setPassword] = useState('prof123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data?.message ?? 'Falha no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Login</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none"
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }} />
      <TextInput value={password} onChangeText={setPassword} placeholder="Senha" secureTextEntry
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }} />
      <TouchableOpacity onPress={onSubmit} disabled={loading} style={{ backgroundColor: '#0a7', padding: 14, borderRadius: 12 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>{loading ? 'Carregando...' : 'Entrar'}</Text>
      </TouchableOpacity>
    </View>
  );
}
