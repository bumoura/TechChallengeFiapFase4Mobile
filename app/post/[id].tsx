import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
  ScrollView, 
  Text, 
  View, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
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

  if (!post) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header Fixo Simples */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Artigo</Text>
        <View style={{ width: 24 }} /> {/* Espaçador para centralizar o título */}
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.articleCard}>
          {/* Tag / Categoria Visual */}
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>NOTÍCIA</Text>
            </View>
          </View>

          <Text style={styles.title}>{post.title}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.authorRow}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarLetter}>{post.author.charAt(0).toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.authorName}>{post.author}</Text>
                <Text style={styles.dateText}>Publicado recentemente</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />
          
          <Text style={styles.body}>{post.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC', // Fundo geral Ice Gray
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { 
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    zIndex: 10,
  },
  headerTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  backBtn: { 
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
  },
  scrollContent: { 
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    // Sombras
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  }, // <--- A VÍRGULA ESTAVA FALTANDO AQUI NO SEU CÓDIGO PROVAVELMENTE
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#EFF6FF', // Azul bem claro
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#1E293B', 
    marginBottom: 20, 
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  metaContainer: { 
    marginBottom: 24,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  authorName: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '600',
  },
  dateText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '400',
  },
  divider: { 
    height: 1, 
    backgroundColor: '#F1F5F9', 
    marginBottom: 24,
  },
  body: { 
    fontSize: 17, 
    lineHeight: 28, 
    color: '#334155',
    textAlign: 'left',
  },
});