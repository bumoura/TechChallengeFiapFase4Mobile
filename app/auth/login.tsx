import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  Alert, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('prof@fiap.com');
  const [password, setPassword] = useState('prof123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Erro de Acesso', e?.response?.data?.message ?? 'Falha ao realizar login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Portal FIAP</Text>
          <Text style={styles.subtitle}>Faça login para gerenciar o sistema.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
              value={email} 
              onChangeText={setEmail} 
              placeholder="ex: prof@fiap.com" 
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input} 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput 
              value={password} 
              onChangeText={setPassword} 
              placeholder="••••••••" 
              placeholderTextColor="#94A3B8"
              secureTextEntry
              style={styles.input} 
            />
          </View>

          <TouchableOpacity 
            onPress={onSubmit} 
            disabled={loading} 
            activeOpacity={0.8}
            style={[styles.button, loading && styles.buttonDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  headerContainer: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748B' },
  formContainer: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginLeft: 4 },
  input: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 16,
    fontSize: 16, color: '#0F172A'
  },
  button: {
    backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 12, marginTop: 12, alignItems: 'center',
    shadowColor: '#2563EB', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4
  },
  buttonDisabled: { backgroundColor: '#93C5FD' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '700' },
});