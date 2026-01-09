import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View, StyleSheet, SafeAreaView } from 'react-native';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

type Post = { _id: string; title: string; content: string; author: string };

export default function AdminHome() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();
  const { user } = useAuth();

  const load = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (e) { console.log(e); }
  };

  const remove = async (id: string) => {
    Alert.alert('Confirmar Exclusão', 'Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { await api.delete(`/posts/${id}`); load(); } }
    ]);
  };

  useEffect(() => { load(); }, []);

  if (user?.role !== 'professor') {
    return (
      <View style={styles.center}>
        <Ionicons name="lock-closed-outline" size={64} color="#CBD5E1" />
        <Text style={{ color: '#64748B', marginTop: 16 }}>Acesso restrito a professores.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Posts</Text>
        <Link href="/admin/posts/new" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(i) => i._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text numberOfLines={1} style={styles.cardSubtitle}>{item.content}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => router.push(`/admin/posts/${item._id}`)} style={styles.actionBtn}>
                <Ionicons name="create-outline" size={20} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => remove(item._id)} style={styles.actionBtn}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#E2E8F0'
  },
  cardTitle: { fontWeight: '600', fontSize: 16, color: '#1E293B' },
  cardSubtitle: { color: '#64748B', fontSize: 13, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 8, marginLeft: 12 },
  actionBtn: { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 8 },
});