import { Tabs } from 'expo-router';
export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Posts' }} />
      <Tabs.Screen name="admin/index" options={{ title: 'Admin' }} />
      <Tabs.Screen name="admin/docentes/index" options={{ title: 'Docentes' }} />
      <Tabs.Screen name="admin/alunos/index" options={{ title: 'Alunos' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
