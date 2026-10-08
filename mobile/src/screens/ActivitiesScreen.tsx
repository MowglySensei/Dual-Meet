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
import { api } from '../lib/supabase';
import { Activity } from '../types';

export const ActivitiesScreen = ({ navigation }: any) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadActivities = async () => {
    try {
      const data = await api.getActivities();
      setActivities(data);
    } catch (e) {
      // fallback
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadActivities();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6" />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Toutes les activités</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateActivity')}
        >
          <Text style={styles.createButtonText}>+ Proposer</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8B5CF6" style={{ marginVertical: 40 }} />
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
          <Text style={styles.emptyTitle}>Pas encore d'activité près de chez toi</Text>
          <Text style={styles.emptySubtitle}>
            Sois le tout premier membre à proposer une sortie conviviale !
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  createButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
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
