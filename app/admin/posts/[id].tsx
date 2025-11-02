import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import api from '@/lib/api';
import { useLocalSearchParams, useRouter } from 'expo-router';

const schema = z.object({ title: z.string().min(3), content: z.string().min(5), author: z.string().min(2) });
type FormData = z.infer<typeof schema>;

export default function EditPost() {
  const { id } = useLocalSearchParams<{id: string}>();
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const router = useRouter();

  useEffect(() => { (async () => {
    const res = await api.get(`/posts/${id}`);
    const { title, content, author } = res.data;
    setValue('title', title); setValue('content', content); setValue('author', author);
  })(); }, [id]);

  const onSubmit = async (data: FormData) => {
    await api.put(`/posts/${id}`, data);
    Alert.alert('Sucesso', 'Post atualizado!');
    router.back();
  };

  const Field = ({ name, placeholder, multiline=false }: any) => (
    <Controller control={control} name={name} render={({ field: { onChange, value } }) => (
      <TextInput placeholder={placeholder} value={value} onChangeText={onChange}
        multiline={multiline}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12, minHeight: multiline ? 120 : undefined }} />
    )} />
  );

  return (
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      <Field name="title" placeholder="Título" />
      {errors.title && <Text style={{ color: 'red' }}>Título inválido</Text>}
      <Field name="author" placeholder="Autor" />
      {errors.author && <Text style={{ color: 'red' }}>Autor inválido</Text>}
      <Field name="content" placeholder="Conteúdo" multiline />
      {errors.content && <Text style={{ color: 'red' }}>Conteúdo inválido</Text>}
      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ backgroundColor: '#08c', padding: 14, borderRadius: 12 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>Salvar alterações</Text>
      </TouchableOpacity>
    </View>
  );
}
