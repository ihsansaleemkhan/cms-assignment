import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { LanguageProvider } from '@/providers/language-provider';

export default function RootLayout() {
  return (
    <LanguageProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#0f2d4a' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: '#f6f8fb' },
          }}>
          <Stack.Screen name="index" options={{ title: 'CMS Assignment' }} />
          <Stack.Screen name="menu/[id]" options={{ title: 'Menu' }} />
          <Stack.Screen name="page/[slug]" options={{ title: 'Page' }} />
        </Stack>
    </LanguageProvider>
  );
}
