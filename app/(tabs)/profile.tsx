import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={48} color="#2563EB" />
        </View>
        
        <Text style={styles.name}>{user ? user.name : 'Visitante'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role?.toUpperCase() ?? '---'}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>ID do Usuário</Text>
          <Text style={styles.infoValue}>{user?.id ?? 'Não identificado'}</Text>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  avatarContainer: { 
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#DBEAFE', 
    justifyContent: 'center', alignItems: 'center', marginBottom: 20 
  },
  name: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
  roleBadge: { 
    backgroundColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 4, 
    borderRadius: 20, marginBottom: 40 
  },
  roleText: { color: '#475569', fontWeight: '600', fontSize: 12, letterSpacing: 1 },
  infoCard: { 
    width: '100%', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 24,
    borderWidth: 1, borderColor: '#E2E8F0'
  },
  infoLabel: { color: '#64748B', fontSize: 12, marginBottom: 4 },
  infoValue: { color: '#1E293B', fontSize: 16, fontWeight: '500' },
  logoutButton: { 
    width: '100%', backgroundColor: '#EF4444', padding: 16, borderRadius: 12, alignItems: 'center' 
  },
  logoutText: { color: 'white', fontWeight: '700', fontSize: 16 },
});