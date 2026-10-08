import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api, supabase } from '../lib/supabase';
import { Activity } from '../types';

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [stats, setStats] = useState({ members: 1, online: 1, activities: 0 });

  const loadData = async () => {
    try {
      const [acts, { count: pCount }, { count: aCount }] = await Promise.all([
        api.getActivities(),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('activities').select('*', { count: 'exact', head: true }),
      ]);

      setActivities(acts);
      setStats({
        members: pCount || 1,
        online: 1,
        activities: aCount || 0,
      });
    } catch (e) {
      // fallback
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6" />}
    >
      {/* Header Banner */}
      <View style={styles.heroCard}>
        <Text style={styles.badgeText}>✦ DUAL MEET</Text>
        <Text style={styles.heroTitle}>
          Tu fais quoi ce week-end, {user?.display_name || 'Ami'} ?
        </Text>
        <Text style={styles.heroSubtitle}>
          Rejoins une sortie amicale près de chez toi ou propose la tienne en 1 clic.
        </Text>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('CreateActivity')}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaButtonText}>+ Créer une sortie</Text>
        </TouchableOpacity>
      </View>

      {/* Real Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.members}</Text>
          <Text style={styles.statLabel}>{stats.members > 1 ? 'Membres' : 'Membre'}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statValueCyan}>{stats.online}</Text>
          <Text style={styles.statLabel}>En ligne</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statValueViolet}>{stats.activities}</Text>
          <Text style={styles.statLabel}>{stats.activities > 1 ? 'Activités' : 'Activité'}</Text>
        </View>
      </View>

      {/* Feed Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sorties récemment proposées</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ActivitiesTab')}>
          <Text style={styles.seeAllText}>Voir tout →</Text>
        </TouchableOpacity>
      </View>

      {/* Feed Items */}
      {loading ? (
        <ActivityIndicator size="large" color="#8B5CF6" style={{ marginVertical: 30 }} />
      ) : activities.length > 0 ? (
        activities.map(act => (
          <TouchableOpacity
            key={act.id}
            style={styles.activityCard}
            onPress={() => navigation.navigate('ActivityDetail', { id: act.id })}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: act.image_url || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800' }}
              style={styles.cardImage}
            />
            <View style={styles.cardOverlay}>
              <Text style={styles.categoryBadge}>{act.category}</Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.cardDate}>
                📅 {new Date(act.date_time).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
              </Text>
              <Text style={styles.cardTitle}>{act.title}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.cardMeta}>📍 {act.city}</Text>
                <Text style={styles.cardParticipants}>
                  👥 {act.participants?.length || act.current_participants_count || 1}/{act.max_participants} pers.
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📍</Text>
          <Text style={styles.emptyTitle}>Rien ici pour le moment</Text>
          <Text style={styles.emptySubtitle}>
            Il n'y a pas encore d'activité près de chez toi. Sois le tout premier membre à en créer une !
          </Text>
          <TouchableOpacity
            style={styles.emptyCta}
            onPress={() => navigation.navigate('CreateActivity')}
          >
            <Text style={styles.emptyCtaText}>Créer la première activité</Text>
          </TouchableOpacity>
        </View>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F17',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#1E1B4B',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#4338CA',
    marginBottom: 16,
  },
  badgeText: {
    color: '#A5B4FC',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#C7D2FE',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  ctaButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  statsBar: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '900',
  },
  statValueCyan: {
    color: '#06B6D4',
    fontSize: 18,
    fontWeight: '900',
  },
  statValueViolet: {
    color: '#A855F7',
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  seeAllText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '700',
  },
  activityCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  categoryBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  cardBody: {
    padding: 14,
  },
  cardDate: {
    color: '#A78BFA',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  cardMeta: {
    color: '#22D3EE',
    fontSize: 11,
    fontWeight: '600',
  },
  cardParticipants: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  emptySubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  emptyCta: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  emptyCtaText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
});
