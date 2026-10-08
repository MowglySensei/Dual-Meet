import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking
} from 'react-native';
import { api, COUNTRY_GUIDES } from '../lib/supabase';
import { TravelProject } from '../types';

export const TravelScreen = () => {
  const [projects, setProjects] = useState<TravelProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await api.getTravelProjects();
        setProjects(data);
      } catch (e) {
        // fallback
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.badgeText}>✈️ VOYAGER & PVT</Text>
        <Text style={styles.title}>Partir à l'étranger, mais pas seul.</Text>
        <Text style={styles.subtitle}>
          Tu rêves d'un PVT en Australie, au Canada ou au Japon ? Trouve des compagnons de route !
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8B5CF6" style={{ marginVertical: 40 }} />
      ) : projects.length > 0 ? (
        projects.map(proj => (
          <View key={proj.id} style={styles.projectCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.countryFlag}>{proj.country_flag} {proj.country}</Text>
              <Text style={styles.visaBadge}>{proj.visa_type}</Text>
            </View>

            <Text style={styles.projectTitle}>{proj.title}</Text>
            <Text style={styles.projectDesc}>« {proj.description} »</Text>

            <View style={styles.detailsBox}>
              <Text style={styles.detailText}>📅 Départ : {proj.departure_date}</Text>
              <Text style={styles.detailText}>📍 Arrivée : {proj.arrival_city}</Text>
              <Text style={styles.detailText}>💰 Budget : {proj.estimated_budget}</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>✈️</Text>
          <Text style={styles.emptyTitle}>Pas encore de projet de voyage</Text>
          <Text style={styles.emptySubtitle}>
            Tu veux partir, mais pas forcément seul ? Sois le premier à proposer un projet de départ !
          </Text>
        </View>
      )}

      {/* Official Guides Card */}
      <View style={styles.guideCard}>
        <Text style={styles.guideTitle}>🌏 Guides Officiels Immigration & Visas</Text>
        {COUNTRY_GUIDES.map(guide => (
          <TouchableOpacity
            key={guide.country}
            style={styles.guideRow}
            onPress={() => Linking.openURL(guide.official_url)}
          >
            <Text style={styles.guideCountry}>{guide.flag} {guide.country}</Text>
            <Text style={styles.guideLink}>Site Officiel ↗</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    marginBottom: 20,
  },
  badgeText: {
    color: '#8B5CF6',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
  },
  projectCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  countryFlag: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  visaBadge: {
    color: '#A78BFA',
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  projectTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  projectDesc: {
    color: '#CBD5E1',
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  detailsBox: {
    backgroundColor: '#0B0F17',
    padding: 12,
    borderRadius: 14,
    gap: 4,
  },
  detailText: {
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
    marginBottom: 20,
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
  },
  guideCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  guideTitle: {
    color: '#22D3EE',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  guideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  guideCountry: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  guideLink: {
    color: '#22D3EE',
    fontSize: 11,
    fontWeight: '800',
  },
});
