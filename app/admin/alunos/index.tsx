import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LoadingOverlay } from '@/components/LoadingOverlay';

type Aluno = { _id: string; nome: string; email: string };
type Paged<T> = { items: T[]; total: number; page: number; limit: number };

export default function AlunosList() {
  const [data, setData] = useState<Paged<Aluno>>({ items: [], total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const load = async (page = 1) => {
    if (user?.role !== 'professor') return;
    if (!refreshing) setLoading(true); // Bloqueia se não for pull-to-refresh
    
    try {
      const res = await api.get(`/alunos?page=${page}&limit=${data.limit}`);
      setData(res.data);
    } catch (e) { 
      Alert.alert('Erro', 'Não foi possível carregar.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load(1);
    setRefreshing(false);
  };

  useEffect(() => { load(1); }, []);

  const removeItem = (id: string) => {
    Alert.alert('Confirmar Exclusão', 'Remover este aluno?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { 
        setLoading(true); // Bloqueia tela
        try {
          await api.delete(`/alunos/${id}`); 
          await load(data.page); 
        } catch(e) {
          setLoading(false);
          Alert.alert('Erro', 'Falha ao excluir.');
        }
      }}
    ]);
  };

  if (user?.role !== 'professor') {
    return (
      <View style={styles.center}>
        <Ionicons name="lock-closed-outline" size={64} color="#CBD5E1" />
        <Text style={{ color: '#64748B', marginTop: 16 }}>Acesso restrito.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Overlay impede interação enquanto carrega ou exclui */}
      <LoadingOverlay visible={loading} message="Aguarde..." />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestão de Alunos</Text>
        <Link href="/admin/alunos/new" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={data.items}
        keyExtractor={(i) => i._id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="school" size={24} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardSubtitle}>{item.email}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => router.push(`/admin/alunos/${item._id}`)} style={styles.actionBtn}>
                <Ionicons name="create-outline" size={20} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeItem(item._id)} style={styles.actionBtn}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={styles.pagination}>
            <TouchableOpacity disabled={data.page <= 1} onPress={() => load(data.page - 1)} style={[styles.pageBtn, data.page <= 1 && styles.disabledBtn]}>
              <Ionicons name="chevron-back" size={20} color={data.page <= 1 ? '#CBD5E1' : '#1E293B'} />
            </TouchableOpacity>
            <Text style={styles.pageText}>Pág {data.page}</Text>
            <TouchableOpacity disabled={data.page * data.limit >= data.total} onPress={() => load(data.page + 1)} style={[styles.pageBtn, (data.page * data.limit >= data.total) && styles.disabledBtn]}>
              <Ionicons name="chevron-forward" size={20} color={(data.page * data.limit >= data.total) ? '#CBD5E1' : '#1E293B'} />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  header: { 
    padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' 
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1E293B' },
  addButton: { 
    backgroundColor: '#2563EB', width: 40, height: 40, borderRadius: 20, 
    justifyContent: 'center', alignItems: 'center', shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 4 
  },
  list: { padding: 16, gap: 12 },
  card: { 
    backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: '#E2E8F0' 
  },
  iconContainer: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center'
  },
  cardTitle: { fontWeight: '600', fontSize: 16, color: '#1E293B' },
  cardSubtitle: { color: '#64748B', fontSize: 13, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 8 },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 16 },
  pageBtn: { padding: 10, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  disabledBtn: { backgroundColor: '#F1F5F9', borderColor: '#F1F5F9' },
  pageText: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
});