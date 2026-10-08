import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Activity } from '../types';

export const ActivityDetailScreen = ({ route, navigation }: any) => {
  const { id } = route.params || {};
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [joining, setJoining] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('activities')
            .select('*, organizer:profiles(*), participants:activity_participants(user:profiles(*))')
            .eq('id', id)
            .single();

          if (!error && data) {
            setActivity(data as Activity);
          }
        } catch (e) {
          // fallback
        }
      }
      setLoading(false);
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>Activité introuvable</Text>
      </View>
    );
  }

  const isOrganizer = user?.id === activity.organizer_id;
  const participants = activity.participants || [activity.organizer!];
  const isParticipant = participants.some(p => p.id === user?.id) || isOrganizer;

  const handleJoin = async () => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }

    setJoining(true);
    try {
      if (isSupabaseConfigured) {
        await supabase
          .from('activity_participants')
          .insert({ activity_id: activity.id, user_id: user.id });
      }

      setActivity({
        ...activity,
        participants: [...participants, user],
      });

      showToast('Votre participation a été enregistrée !', 'success');
    } catch (e: any) {
      showToast('Erreur lors de l’inscription.', 'error');
    } finally {
      setJoining(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={{ uri: activity.image_url || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800' }}
        style={styles.heroImage}
      />

      <View style={styles.body}>
        <Text style={styles.categoryBadge}>{activity.category}</Text>
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.dateText}>
          📅 {new Date(activity.date_time).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.cityText}>📍 {activity.city} (Secteur approximatif)</Text>

        <View style={styles.cardBox}>
          <Text style={styles.boxTitle}>À propos de cette sortie</Text>
          <Text style={styles.boxDescription}>{activity.description || 'Aucune description fournie.'}</Text>
        </View>

        <View style={styles.cardBox}>
          <Text style={styles.boxTitle}>Participants ({participants.length}/{activity.max_participants})</Text>
          {participants.map(part => (
            <View key={part.id} style={styles.participantRow}>
              <Image
                source={{ uri: part.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' }}
                style={styles.partAvatar}
              />
              <Text style={styles.partName}>{part.display_name}</Text>
            </View>
          ))}
        </View>

        {!isParticipant && (
          <TouchableOpacity style={styles.joinButton} onPress={handleJoin} disabled={joining}>
            <Text style={styles.joinButtonText}>{joining ? 'Inscription...' : 'Rejoindre la sortie'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F17',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B0F17',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 220,
  },
  body: {
    padding: 16,
  },
  categoryBadge: {
    color: '#8B5CF6',
    fontWeight: '900',
    fontSize: 11,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 8,
  },
  dateText: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  cityText: {
    color: '#22D3EE',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 16,
  },
  cardBox: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  boxTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  boxDescription: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  partAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    marginRight: 10,
  },
  partName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  joinButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
