import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import api from '@/lib/api';
type Post = { _id: string; title: string; content: string; author: string };

export default function PostDetail() {
  const { id } = useLocalSearchParams<{id: string}>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    (async () => {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    })();
  }, [id]);

  if (!post) return <View style={{flex:1, alignItems:'center', justifyContent:'center'}}><Text>Carregando...</Text></View>;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '800' }}>{post.title}</Text>
      <Text style={{ color: '#666', marginBottom: 12 }}>Autor: {post.author}</Text>
      <Text style={{ fontSize: 16, lineHeight: 22 }}>{post.content}</Text>
    </ScrollView>
  );
}
