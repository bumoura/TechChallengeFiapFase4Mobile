import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, TextInput, TouchableOpacity, View, Alert, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import api from '@/lib/api';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const schema = z.object({ 
  nome: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'), 
  email: z.string().email('Insira um e-mail válido') 
});

type FormData = z.infer<typeof schema>;

export default function NewDocente() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.post('/docentes', data);
      Alert.alert('Sucesso', 'Docente criado com sucesso!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o docente.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, placeholder, label }: any) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <Controller 
        control={control} 
        name={name} 
        render={({ field: { onChange, value } }) => (
          <TextInput 
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            value={value} 
            onChangeText={onChange}
            style={styles.input} 
          />
        )} 
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Docente</Text>
      </View>

      <View style={styles.form}>
        <Field name="nome" placeholder="Ex: João da Silva" label="Nome Completo" />
        {errors.nome && <Text style={styles.error}>{errors.nome.message}</Text>}

        <Field name="email" placeholder="Ex: joao@fiap.com" label="E-mail Corporativo" />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <TouchableOpacity 
          onPress={handleSubmit(onSubmit)} 
          disabled={loading}
          style={styles.saveButton}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveText}>Salvar Cadastro</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  backBtn: { padding: 4 },
  form: { padding: 24, gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginLeft: 4 },
  input: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 16,
    fontSize: 16, color: '#0F172A'
  },
  error: { color: '#EF4444', fontSize: 12, marginLeft: 4, marginTop: -8 },
  saveButton: {
    backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 12, marginTop: 20,
    alignItems: 'center', shadowColor: '#2563EB', shadowOpacity: 0.2, shadowRadius: 8
  },
  saveText: { color: 'white', fontSize: 16, fontWeight: '700' },
});