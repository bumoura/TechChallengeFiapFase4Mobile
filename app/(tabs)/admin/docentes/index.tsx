import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

type D = { _id: string; nome: string; email: string };
type Paged<T> = { items: T[]; total: number; page: number; limit: number };

export default function DocentesList() {
  const [data, setData] = useState<Paged<D>>({ items: [], total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/docentes?page=${page}&limit=${data.limit}`);
      setData(res.data);
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  useEffect(() => { load(1); }, []);

  const removeItem = (id: string) => {
    Alert.alert('Confirmar Exclusão', 'Remover este docente?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { await api.delete(`/docentes/${id}`); load(data.page); } }
    ]);
  };

  if (user?.role !== 'professor') return <View style={styles.center}><Text>Acesso restrito.</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Docentes</Text>
        <Link href="/admin/docentes/new" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="person-add" size={20} color="white" />
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={data.items}
        keyExtractor={(i) => i._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardSubtitle}>{item.email}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => router.push(`/admin/docentes/${item._id}`)} style={styles.actionBtn}>
                <Ionicons name="pencil" size={18} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeItem(item._id)} style={styles.actionBtn}>
                <Ionicons name="trash" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={styles.pagination}>
            <TouchableOpacity disabled={data.page <= 1 || loading} onPress={() => load(data.page - 1)} style={[styles.pageBtn, data.page <= 1 && styles.disabledBtn]}>
              <Ionicons name="chevron-back" size={20} color={data.page <= 1 ? '#CBD5E1' : '#1E293B'} />
            </TouchableOpacity>
            <Text style={styles.pageText}>{data.page}</Text>
            <TouchableOpacity disabled={data.page * data.limit >= data.total || loading} onPress={() => load(data.page + 1)} style={[styles.pageBtn, (data.page * data.limit >= data.total) && styles.disabledBtn]}>
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1E293B' },
  addButton: { backgroundColor: '#2563EB', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontWeight: '600', fontSize: 16, color: '#1E293B' },
  cardSubtitle: { color: '#64748B', fontSize: 13 },
  actions: { flexDirection: 'row', gap: 8, marginLeft: 12 },
  actionBtn: { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 8 },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 16 },
  pageBtn: { padding: 10, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  disabledBtn: { backgroundColor: '#F1F5F9', borderColor: '#F1F5F9' },
  pageText: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
});