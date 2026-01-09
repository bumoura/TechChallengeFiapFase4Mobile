import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
  FlatList, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  RefreshControl 
} from 'react-native';
import api from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';

type Post = { _id: string; title: string; content: string; author: string };

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [q, setQ] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const load = async () => {
    const url = q ? `/posts/search?term=${encodeURIComponent(q)}` : '/posts';
    try {
      const res = await api.get(url);
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed de Notícias</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={20} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Buscar por palavra-chave..."
            placeholderTextColor="#94A3B8"
            value={q}
            onChangeText={setQ}
            onSubmitEditing={load}
            style={styles.input}
          />
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => router.push(`/post/${item._id}`)} 
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardAuthor}>Por {item.author}</Text>
            </View>
            
            <Text numberOfLines={3} style={styles.cardContent}>
              {item.content}
            </Text>

            <View style={styles.readMoreContainer}>
              <Text style={styles.readMoreText}>Ler completa</Text>
              <Ionicons name="arrow-forward" size={16} color="#2563EB" />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    padding: 20, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9' 
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1E293B' },
  searchContainer: { padding: 16 },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    height: 50 
  },
  input: { flex: 1, fontSize: 16, color: '#1E293B' },
  listContent: { paddingHorizontal: 16, paddingBottom: 20, gap: 16 }, 
  card: {
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2
  },
  cardHeader: { marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  cardAuthor: { fontSize: 13, color: '#64748B', fontStyle: 'italic' },
  cardContent: { 
    fontSize: 15, 
    color: '#334155', 
    lineHeight: 22, 
    marginBottom: 16 
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', 
    gap: 4
  },
  readMoreText: { 
    color: '#2563EB', 
    fontWeight: '700', 
    fontSize: 14 
  },
});