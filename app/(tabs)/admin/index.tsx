import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
type Post = { _id: string; title: string; content: string; author: string };

export default function AdminHome() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();
  const { user } = useAuth();

  const load = async () => {
    const res = await api.get('/posts');
    setPosts(res.data);
  };

  const remove = async (id: string) => {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { await api.delete(`/posts/${id}`); load(); } }
    ]);
  };

  useEffect(() => { load(); }, []);

  if (user?.role !== 'professor') {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>Acesso restrito a professores.</Text></View>;
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      <Link href="/admin/posts/new" asChild><TouchableOpacity style={{ backgroundColor: '#0a7', padding: 14, borderRadius: 12 }}><Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>Novo Post</Text></TouchableOpacity></Link>
      <FlatList
        data={posts}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 12 }}>
            <Text style={{ fontWeight: '700' }}>{item.title}</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
              <TouchableOpacity onPress={() => router.push(`/admin/posts/${item._id}`)} style={{ padding: 8, backgroundColor: '#08c', borderRadius: 8 }}><Text style={{ color: 'white' }}>Editar</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => remove(item._id)} style={{ padding: 8, backgroundColor: '#e33', borderRadius: 8 }}><Text style={{ color: 'white' }}>Excluir</Text></TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
      />
    </View>
  );
}
