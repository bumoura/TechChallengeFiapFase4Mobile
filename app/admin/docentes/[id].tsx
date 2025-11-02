import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import api from '@/lib/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
const schema = z.object({ nome: z.string().min(2,'Obrigatório'), email: z.string().email('E-mail inválido') });
type FormData = z.infer<typeof schema>;
export default function EditDocente() {
  const { id } = useLocalSearchParams<{id: string}>();
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const router = useRouter();
  useEffect(() => { (async () => {
    const res = await api.get(`/docentes/${id}`).catch(()=>null);
    if (!res) return;
    const { nome, email } = res.data;
    setValue('nome', nome); setValue('email', email);
  })(); }, [id]);
  const onSubmit = async (data: FormData) => {
    await api.put(`/docentes/${id}`, data);
    Alert.alert('Sucesso', 'Docente atualizado!');
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
      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ backgroundColor: '#08c', padding: 14, borderRadius: 12 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}
