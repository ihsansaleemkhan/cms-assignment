import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPublicPage, PageDetail } from '@/lib/api';
import { htmlToText } from '@/lib/html';
import { localizedTitle } from '@/lib/localization';
import { useLanguage } from '@/providers/language-provider';

export default function PageScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [page, setPage] = useState<PageDetail | null>(null); const [error, setError] = useState('');
  const { isArabic } = useLanguage();
  useEffect(() => { if (!slug) return; getPublicPage(slug).then(setPage).catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load page.')); }, [slug]);
  if (!page && !error) return <View style={styles.loading}><ActivityIndicator size="large" color="#1778c5" /></View>;
  if (error) return <View style={styles.loading}><Text style={styles.error}>{error}</Text></View>;
  const title = localizedTitle(page, isArabic);
  const body = isArabic ? page?.body_ar || page?.body || '' : page?.body || page?.body_ar || '';
  return <SafeAreaView edges={['bottom']} style={styles.safe}><Stack.Screen options={{ title: title || (isArabic ? 'صفحة' : 'Page') }} /><ScrollView contentContainerStyle={styles.content}>{page?.cover_image ? <Image source={page.cover_image} contentFit="cover" style={styles.cover} /> : null}<Text style={[styles.menu, isArabic && styles.rtlText]}>{page?.menu?.title ?? (isArabic ? 'صفحة إدارة المحتوى' : 'CMS page')}</Text><Text style={[styles.title, isArabic && styles.rtlText]}>{title}</Text>{page?.publish_date ? <Text style={[styles.date, isArabic && styles.rtlText]}>{isArabic ? 'نُشرت في ' : 'Published '}{new Date(page.publish_date).toLocaleDateString(isArabic ? 'ar' : 'en')}</Text> : null}<Text style={[styles.body, isArabic && styles.rtlText]}>{htmlToText(body)}</Text></ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#fff' }, loading: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }, content: { padding: 20, paddingBottom: 48 }, cover: { width: '100%', height: 220, borderRadius: 15, marginBottom: 24 }, menu: { color: '#1778c5', fontWeight: '800', fontSize: 12, textTransform: 'uppercase', letterSpacing: .7 }, title: { color: '#10233f', fontWeight: '800', fontSize: 30, lineHeight: 38, marginTop: 8 }, date: { color: '#667085', marginTop: 10 }, body: { color: '#344054', fontSize: 17, lineHeight: 28, marginTop: 27 }, error: { color: '#b42318', textAlign: 'center' }, rtlText: { textAlign: 'right', writingDirection: 'rtl' } });
