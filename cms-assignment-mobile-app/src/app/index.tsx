import { Image } from 'expo-image';
import { Link, Stack, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getPublicMenus, getPublicPages, Menu, Page } from '@/lib/api';
import { localizedTitle } from '@/lib/localization';
import { useLanguage } from '@/providers/language-provider';

type Section = { id: number; title: string; title_ar?: string | null; pages: Page[] };

function flattenMenu(menu: Menu): Section[] {
  const pages = Array.isArray(menu.pages) ? menu.pages : [];
  const children = Array.isArray(menu.children) ? menu.children : [];

  return [
    ...(pages.length
      ? [{ id: menu.id, title: menu.title, title_ar: menu.title_ar, pages }]
      : []),
    ...children.flatMap(flattenMenu),
  ];
}

function PageCard({ page }: { page: Page }) {
  const { isArabic } = useLanguage();

  return (
    <Link href={{ pathname: '/page/[slug]', params: { slug: page.slug } } as never} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        {page.cover_image ? (
          <Image source={page.cover_image} style={styles.cover} contentFit="cover" transition={180} />
        ) : (
          <View style={[styles.cover, styles.coverPlaceholder]}>
            <Text style={styles.coverLetter}>CMS</Text>
          </View>
        )}
        <View style={styles.cardBody}>
          {page.menu?.title ? (
            <Text style={[styles.menuLabel, isArabic && styles.rtlText]}>
              {localizedTitle(page.menu, isArabic)}
            </Text>
          ) : null}
          <Text numberOfLines={2} style={[styles.cardTitle, isArabic && styles.rtlText]}>
            {localizedTitle(page, isArabic)}
          </Text>
          <Text style={[styles.openLabel, isArabic && styles.rtlText]}>
            {isArabic ? 'اقرأ الصفحة ←' : 'Read page →'}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

function MenuRow({
  menu,
  depth = 0,
  isArabic,
  onSelect,
}: {
  menu: Menu;
  depth?: number;
  isArabic: boolean;
  onSelect: (menu: Menu) => void;
}) {
  const children = Array.isArray(menu.children) ? menu.children : [];
  const pageCount = Array.isArray(menu.pages) ? menu.pages.length : 0;

  return (
    <>
      <Pressable
        onPress={() => onSelect(menu)}
        style={({ pressed }) => [
          styles.drawerMenuRow,
          isArabic && styles.rtl,
          { marginStart: depth * 16 },
          pressed && styles.drawerMenuPressed,
        ]}>
        <View style={styles.drawerMenuIcon}><Text style={styles.drawerMenuIconText}>▤</Text></View>
        <View style={styles.drawerMenuCopy}>
          <Text numberOfLines={1} style={[styles.drawerMenuTitle, isArabic && styles.rtlText]}>
            {localizedTitle(menu, isArabic)}
          </Text>
          {pageCount ? (
            <Text style={[styles.drawerMenuCount, isArabic && styles.rtlText]}>
              {isArabic ? `${pageCount} صفحة` : `${pageCount} ${pageCount === 1 ? 'page' : 'pages'}`}
            </Text>
          ) : null}
        </View>
        <Text style={styles.drawerChevron}>{isArabic ? '‹' : '›'}</Text>
      </Pressable>
      {children.map((child) => (
        <MenuRow
          key={child.id}
          menu={child}
          depth={depth + 1}
          isArabic={isArabic}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

export default function HomeScreen() {
  const [sections, setSections] = useState<Section[]>([]);
  const [latest, setLatest] = useState<Page[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const { isArabic, toggleLanguage } = useLanguage();
  const router = useRouter();

  const load = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError('');

    try {
      const [menus, pageResponse] = await Promise.all([getPublicMenus(), getPublicPages()]);
      const safeMenus = Array.isArray(menus) ? menus : [];
      setMenus(safeMenus);
      setSections(safeMenus.flatMap(flattenMenu));
      setLatest(Array.isArray(pageResponse.data) ? pageResponse.data : []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load published pages.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#1778c5" /></View>;
  }

  const displaySections = sections.length
    ? sections
    : latest.length
      ? [{ id: 0, title: isArabic ? 'الصفحات المنشورة' : 'Published pages', pages: latest }]
      : [];

  function openMenu(menu: Menu) {
    setDrawerOpen(false);
    router.push({
      pathname: '/menu/[id]',
      params: {
        id: String(menu.id),
        title: menu.title,
        titleAr: menu.title_ar || '',
      },
    });
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safe}>
      <Stack.Screen
        options={{
          title: 'CMS Assignment',
          headerRight: () => (
            <Pressable
              accessibilityLabel={isArabic ? 'فتح القائمة' : 'Open menu'}
              accessibilityRole="button"
              hitSlop={10}
              onPress={() => setDrawerOpen(true)}
              style={({ pressed }) => [styles.menuToggle, pressed && styles.pressed]}>
              <Text style={styles.menuToggleText}>☰</Text>
            </Pressable>
          ),
        }}
      />
      <Modal
        animationType="fade"
        onRequestClose={() => setDrawerOpen(false)}
        statusBarTranslucent
        transparent
        visible={drawerOpen}>
        <View style={styles.drawerModal}>
          <Pressable
            accessibilityLabel="Close menu"
            onPress={() => setDrawerOpen(false)}
            style={styles.drawerBackdrop}
          />
          <View style={[styles.drawer, isArabic ? styles.drawerLeft : styles.drawerRight]}>
            <View style={[styles.drawerHeader, isArabic && styles.rtl]}>
              <View style={styles.drawerBrandMark}><Text style={styles.drawerBrandMarkText}>C</Text></View>
              <View style={styles.drawerBrandCopy}>
                <Text style={[styles.drawerBrand, isArabic && styles.rtlText]}>CMS Assignment</Text>
                <Text style={[styles.drawerBrandSub, isArabic && styles.rtlText]}>
                  {isArabic ? 'المحتوى العام' : 'PUBLIC CONTENT'}
                </Text>
              </View>
              <Pressable
                accessibilityLabel="Close menu"
                hitSlop={8}
                onPress={() => setDrawerOpen(false)}
                style={styles.drawerClose}>
                <Text style={styles.drawerCloseText}>×</Text>
              </Pressable>
            </View>
            <Text style={[styles.drawerLabel, isArabic && styles.rtlText]}>
              {isArabic ? 'التنقل' : 'NAVIGATION'}
            </Text>
            <ScrollView contentContainerStyle={styles.drawerContent}>
              <Pressable
                onPress={() => setDrawerOpen(false)}
                style={({ pressed }) => [styles.drawerHome, isArabic && styles.rtl, pressed && styles.drawerMenuPressed]}>
                <Text style={styles.drawerHomeIcon}>⌂</Text>
                <Text style={[styles.drawerHomeText, isArabic && styles.rtlText]}>
                  {isArabic ? 'الرئيسية' : 'Home'}
                </Text>
              </Pressable>
              {menus.map((menu) => (
                <MenuRow
                  key={menu.id}
                  menu={menu}
                  isArabic={isArabic}
                  onSelect={openMenu}
                />
              ))}
            </ScrollView>
            <Pressable
              onPress={toggleLanguage}
              style={[styles.drawerLanguage, isArabic && styles.rtl]}>
              <View>
                <Text style={[styles.drawerLanguageTitle, isArabic && styles.rtlText]}>
                  {isArabic ? 'اللغة' : 'Language'}
                </Text>
                <Text style={[styles.drawerLanguageSub, isArabic && styles.rtlText]}>
                  {isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
                </Text>
              </View>
              <View style={styles.drawerLanguageBadge}>
                <Text style={styles.drawerLanguageBadgeText}>{isArabic ? 'EN' : 'AR'}</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
      <FlatList
        data={displaySections}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
            tintColor="#1778c5"
          />
        }
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <View style={styles.hero}>
              <View style={[styles.heroTop, isArabic && styles.rtl]}>
                <Text style={[styles.eyebrow, isArabic && styles.rtlText]}>
                  {isArabic ? 'المحتوى العام' : 'PUBLIC CONTENT'}
                </Text>
                <Pressable onPress={toggleLanguage} style={styles.languageButton}>
                  <Text style={styles.languageText}>{isArabic ? 'English' : 'العربية'}</Text>
                </Pressable>
              </View>
              <Text style={[styles.heading, isArabic && styles.rtlText]}>
                {isArabic ? 'اكتشف قراءتك التالية.' : 'Find your next read.'}
              </Text>
              <Text style={[styles.description, isArabic && styles.rtlText]}>
                {isArabic
                  ? 'صفحات منشورة من نظام إدارة المحتوى، منظّمة حسب القائمة المباشرة.'
                  : 'Published pages from the CMS, organized by the live menu.'}
              </Text>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, isArabic && styles.rtl]}>
              <Text style={[styles.sectionTitle, isArabic && styles.rtlText]}>
                {localizedTitle(item, isArabic)}
              </Text>
              {item.id ? (
                <Link
                  href={{
                    pathname: '/menu/[id]',
                    params: { id: String(item.id), title: item.title, titleAr: item.title_ar || '' },
                  } as never}
                  asChild>
                  <Pressable><Text style={styles.viewAll}>{isArabic ? 'عرض الكل' : 'View all'}</Text></Pressable>
                </Link>
              ) : null}
            </View>
            <FlatList
              contentContainerStyle={styles.carousel}
              horizontal
              data={item.pages}
              inverted={isArabic}
              ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
              keyExtractor={(page) => String(page.id)}
              renderItem={({ item: page }) => <PageCard page={page} />}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
        ListEmptyComponent={
          !error ? (
            <Text style={[styles.empty, isArabic && styles.rtlText]}>
              {isArabic ? 'لا توجد صفحات منشورة متاحة بعد.' : 'No published pages are available yet.'}
            </Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f6f8fb' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 32 },
  hero: { backgroundColor: '#0f2d4a', padding: 22, paddingTop: 30, paddingBottom: 36 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { color: '#76c5ff', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  languageButton: { borderWidth: 1, borderColor: '#76c5ff', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },
  languageText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  heading: { color: '#fff', fontSize: 31, fontWeight: '800', marginTop: 8 },
  description: { color: '#d6e5f3', lineHeight: 21, marginTop: 8, maxWidth: 320 },
  error: { color: '#b42318', backgroundColor: '#fef3f2', padding: 14, margin: 16, borderRadius: 10 },
  empty: { textAlign: 'center', color: '#667085', marginTop: 35 },
  section: { marginTop: 18 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, marginBottom: 11 },
  sectionTitle: { fontSize: 20, color: '#10233f', fontWeight: '800' },
  viewAll: { color: '#1778c5', fontWeight: '700' },
  carousel: { paddingHorizontal: 16, paddingBottom: 8 },
  cardSeparator: { width: 12 },
  card: { width: 240, minHeight: 270, borderRadius: 16, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4eaf1', shadowColor: '#10233f', shadowOpacity: .1, shadowRadius: 9, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  cover: { height: 142, width: '100%' },
  coverPlaceholder: { backgroundColor: '#ddecf8', justifyContent: 'center', alignItems: 'center' },
  coverLetter: { color: '#1778c5', fontSize: 18, fontWeight: '800' },
  cardBody: { padding: 13, minHeight: 112 },
  menuLabel: { color: '#1778c5', fontSize: 11, fontWeight: '700', marginBottom: 5 },
  cardTitle: { color: '#162b40', fontWeight: '700', fontSize: 16, lineHeight: 21 },
  openLabel: { color: '#1778c5', marginTop: 'auto', paddingTop: 9, fontSize: 12, fontWeight: '700' },
  pressed: { opacity: .78 },
  menuToggle: { width: 42, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#173f60' },
  menuToggleText: { color: '#fff', fontSize: 25, lineHeight: 28, fontWeight: '700' },
  drawerModal: { flex: 1 },
  drawerBackdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(5, 20, 34, .58)' },
  drawer: { position: 'absolute', top: 0, bottom: 0, width: '86%', maxWidth: 370, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: .25, shadowRadius: 18, elevation: 18 },
  drawerRight: { right: 0 },
  drawerLeft: { left: 0 },
  drawerHeader: { minHeight: 104, paddingTop: 36, paddingHorizontal: 18, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e7edf3', gap: 12 },
  drawerBrandMark: { width: 50, height: 50, borderRadius: 14, backgroundColor: '#208aef', alignItems: 'center', justifyContent: 'center' },
  drawerBrandMarkText: { color: '#fff', fontSize: 22, fontWeight: '900' },
  drawerBrandCopy: { flex: 1 },
  drawerBrand: { color: '#10233f', fontSize: 19, fontWeight: '900' },
  drawerBrandSub: { color: '#1778c5', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginTop: 2 },
  drawerClose: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f4f8', alignItems: 'center', justifyContent: 'center' },
  drawerCloseText: { color: '#10233f', fontSize: 30, lineHeight: 32, fontWeight: '300' },
  drawerLabel: { color: '#98a2b3', fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginTop: 20, marginHorizontal: 20, marginBottom: 8 },
  drawerContent: { paddingHorizontal: 14, paddingBottom: 24 },
  drawerHome: { minHeight: 58, borderRadius: 12, backgroundColor: '#eaf4fd', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 13, marginBottom: 8 },
  drawerHomeIcon: { color: '#1778c5', fontSize: 25, fontWeight: '700' },
  drawerHomeText: { color: '#1778c5', fontSize: 16, fontWeight: '800' },
  drawerMenuRow: { minHeight: 58, borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 11 },
  drawerMenuPressed: { backgroundColor: '#f0f6fb' },
  drawerMenuIcon: { width: 30, alignItems: 'center' },
  drawerMenuIconText: { color: '#667085', fontSize: 22 },
  drawerMenuCopy: { flex: 1 },
  drawerMenuTitle: { color: '#344054', fontSize: 16, fontWeight: '700' },
  drawerMenuCount: { color: '#98a2b3', fontSize: 11, marginTop: 2 },
  drawerChevron: { color: '#667085', fontSize: 28, fontWeight: '300' },
  drawerLanguage: { margin: 16, padding: 15, minHeight: 76, borderRadius: 13, borderWidth: 1, borderColor: '#d7e5f2', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  drawerLanguageTitle: { color: '#10233f', fontSize: 14, fontWeight: '800' },
  drawerLanguageSub: { color: '#667085', fontSize: 11, marginTop: 3 },
  drawerLanguageBadge: { backgroundColor: '#eaf4fd', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  drawerLanguageBadgeText: { color: '#1778c5', fontSize: 12, fontWeight: '900' },
  rtl: { flexDirection: 'row-reverse' },
  rtlText: { textAlign: 'right', writingDirection: 'rtl' },
});
