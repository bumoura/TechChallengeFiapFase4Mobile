import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '@/lib/api';
type Post = { _id: string; title: string; content: string; author: string };

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [q, setQ] = useState('');
  const router = useRouter();

  const load = async () => {
    const url = q ? `/posts/search?term=${encodeURIComponent(q)}` : '/posts';
    const res = await api.get(url);
    setPosts(res.data);
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      <TextInput
        placeholder="Buscar por palavra-chave..."
        value={q}
        onChangeText={setQ}
        onSubmitEditing={load}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/post/${item._id}`)} style={{ paddingVertical: 12 }}>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>{item.title}</Text>
            <Text style={{ color: '#555' }}>Autor: {item.author}</Text>
            <Text numberOfLines={2} style={{ color: '#333' }}>{item.content}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
      />
    </View>
  );
}
