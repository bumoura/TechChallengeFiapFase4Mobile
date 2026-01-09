import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Alert, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import api from '@/lib/api';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({ 
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'), 
  content: z.string().min(10, 'O conteúdo deve ser mais detalhado (mínimo 10 caracteres)'),
  author: z.string().min(2, 'Autor obrigatório') 
});

type FormData = z.infer<typeof schema>;

export default function NewPost() {
  const { user } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    defaultValues: {
      author: user?.name || ''
    }
  });
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.post('/posts', data);
      Alert.alert('Sucesso', 'Post publicado com sucesso!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível publicar o post.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, placeholder, label, multiline = false }: any) => (
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
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
            style={[styles.input, multiline && styles.textArea]} 
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
        <Text style={styles.headerTitle}>Novo Post</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.form}>
          <Field name="title" placeholder="Ex: Aviso de Provas" label="Título do Post" />
          {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

          <Field name="author" placeholder="Nome do Autor" label="Autor" />
          {errors.author && <Text style={styles.error}>{errors.author.message}</Text>}

          <Field 
            name="content" 
            placeholder="Escreva aqui o conteúdo da publicação..." 
            label="Conteúdo" 
            multiline 
          />
          {errors.content && <Text style={styles.error}>{errors.content.message}</Text>}
          
          <TouchableOpacity 
            onPress={handleSubmit(onSubmit)} 
            disabled={loading} 
            style={styles.saveButton}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveText}>Publicar</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    padding: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9' 
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  backBtn: { padding: 4 },
  form: { padding: 24, gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginLeft: 4 },
  input: {
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16, 
    color: '#0F172A',
    minHeight: 50
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16, 
  },
  error: { color: '#EF4444', fontSize: 12, marginLeft: 4, marginTop: -8 },
  saveButton: {
    backgroundColor: '#2563EB', 
    paddingVertical: 16, 
    borderRadius: 12, 
    marginTop: 20, 
    alignItems: 'center', 
    shadowColor: '#2563EB', 
    shadowOpacity: 0.2, 
    shadowRadius: 8,
    elevation: 4
  },
  saveText: { color: 'white', fontSize: 16, fontWeight: '700' },
});