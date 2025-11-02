import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
type D = { _id: string; nome: string; email: string };
type Paged<T> = { items: T[]; total: number; page: number; limit: number };

export default function DocentesList() {
  const [data, setData] = useState<Paged<D>>({ items: [], total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const load = async (page=1) => {
    setLoading(true);
    const res = await api.get(`/docentes?page=${page}&limit=${data.limit}`);
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => { load(1); }, []);

  const removeItem = (id: string) => {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { await api.delete(`/docentes/${id}`); load(data.page); } }
    ]);
  };

  if (user?.role !== 'professor') {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>Acesso restrito a professores.</Text></View>;
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      <Link href="/admin/docentes/new" asChild><TouchableOpacity style={{ backgroundColor: '#0a7', padding: 14, borderRadius: 12 }}><Text style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>Novo Docente</Text></TouchableOpacity></Link>
      <FlatList
        data={data.items}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 12 }}>
            <Text style={{ fontWeight: '700' }}>{item.nome}</Text>
            <Text style={{ color: '#555' }}>{item.email}</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
              <TouchableOpacity onPress={() => router.push(`/admin/docentes/${item._id}`)} style={{ padding: 8, backgroundColor: '#08c', borderRadius: 8 }}><Text style={{ color: 'white' }}>Editar</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => removeItem(item._id)} style={{ padding: 8, backgroundColor: '#e33', borderRadius: 8 }}><Text style={{ color: 'white' }}>Excluir</Text></TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            <TouchableOpacity disabled={data.page<=1 || loading} onPress={()=>load(data.page-1)} style={{ padding: 10, backgroundColor: '#eee', borderRadius: 8 }}><Text>Anterior</Text></TouchableOpacity>
            <Text style={{ alignSelf: 'center' }}>Página {data.page}</Text>
            <TouchableOpacity disabled={data.page*data.limit>=data.total || loading} onPress={()=>load(data.page+1)} style={{ padding: 10, backgroundColor: '#eee', borderRadius: 8 }}><Text>Próxima</Text></TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
      />
    </View>
  );
}
