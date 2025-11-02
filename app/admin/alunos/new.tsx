import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import api from '@/lib/api';
import { useRouter } from 'expo-router';
const schema = z.object({ nome: z.string().min(2,'Obrigatório'), email: z.string().email('E-mail inválido') });
type FormData = z.infer<typeof schema>;
export default function NewAluno() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const router = useRouter();
  const onSubmit = async (data: FormData) => {
    await api.post('/alunos', data);
    Alert.alert('Sucesso', 'Aluno criado!');
    router.back();
  };
  const Field = ({ name, placeholder }: any) => (
    <Controller control={control} name={name} render={({ field: { onChange, value } }) => (
      <TextInput placeholder={placeholder} value={value} onChangeText={onChange}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }} />
    )} />
  );
  return (
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      <Field name="nome" placeholder="Nome" />
      {errors.nome && <Text style={{ color: 'red' }}>{errors.nome.message}</Text>}
      <Field name="email" placeholder="Email" />
      {errors.email && <Text style={{ color: 'red' }}>{errors.email.message}</Text>}
      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ backgroundColor: '#0a7', padding: 14, borderRadius: 12 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}
