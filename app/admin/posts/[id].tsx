import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';

type Post = { _id: string; title: string; content: string; author: string };

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
      } catch (e) { console.log(e); }
    })();
  }, [id]);

  if (!post) return <View style={styles.center}><ActivityIndicator size="large" color="#2563EB" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.meta}>
          <Ionicons name="person-circle-outline" size={20} color="#64748B" />
          <Text style={styles.author}>Autor: {post.author}</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.body}>{post.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  backBtn: { padding: 4 },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#1E293B', marginBottom: 12, lineHeight: 34 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  author: { color: '#64748B', fontSize: 16, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 24 },
  body: { fontSize: 18, lineHeight: 28, color: '#334155' },
});